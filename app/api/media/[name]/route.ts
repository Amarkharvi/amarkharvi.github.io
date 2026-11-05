import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { head, issueSignedToken, presignUrl } from "@vercel/blob";
import { explainBlobError } from "@/lib/blob-errors";
import { isBlobStorageEnabled } from "@/lib/storage";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "uploads");
const BLOB_PREFIX = "uploads/";

const TYPES: Record<string, string> = {
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".gif": "image/gif",
	".avif": "image/avif",
	".mp4": "video/mp4",
	".webm": "video/webm",
	".mov": "video/quicktime",
};

type RouteContext = { params: Promise<{ name: string }> };

function assertSafeName(name: string) {
	if (!name || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(name) || name.includes("..")) {
		return false;
	}
	return true;
}

function contentTypeFor(name: string) {
	const ext = path.extname(name).toLowerCase();
	return TYPES[ext] ?? "application/octet-stream";
}

/**
 * Private Blob files must not be streamed through this function for video — browsers send
 * Range requests, and a proxied 200/partial body pair looks like a corrupted file even when
 * the object in the store is fine. Instead we 307 to a short-lived signed Blob URL so the
 * CDN serves bytes (and Range) directly.
 */
async function redirectToBlob(pathname: string) {
	try {
		const token = await issueSignedToken({
			pathname,
			operations: ["get"],
			validUntil: Date.now() + 60 * 60 * 1000,
		});
		const { presignedUrl } = await presignUrl(token, {
			operation: "get",
			pathname,
			access: "private",
			validUntil: Date.now() + 30 * 60 * 1000,
		});
		return Response.redirect(presignedUrl, 307);
	} catch (privateError) {
		// Store may still be Public — fall back to the public object URL.
		try {
			const meta = await head(pathname);
			return Response.redirect(meta.url, 307);
		} catch {
			throw privateError;
		}
	}
}

/**
 * Streams an admin upload. On Vercel the file lives in Blob and this route redirects to a
 * signed URL. Locally it still comes from `public/media/uploads`.
 */
export async function GET(request: Request, context: RouteContext) {
	const { name: raw } = await context.params;
	const name = decodeURIComponent(raw);
	if (!assertSafeName(name)) return new Response("Not found", { status: 404 });

	if (isBlobStorageEnabled()) {
		try {
			return await redirectToBlob(`${BLOB_PREFIX}${name}`);
		} catch (error) {
			console.error(`[api/media] ${explainBlobError(error)}`);
			return new Response(explainBlobError(error), { status: 503 });
		}
	}

	const target = path.join(UPLOAD_DIR, name);
	if (path.dirname(target) !== UPLOAD_DIR) return new Response("Not found", { status: 404 });

	const range = request.headers.get("range") ?? undefined;

	try {
		const info = await stat(target);
		const type = contentTypeFor(name);
		const headers = new Headers({
			"Content-Type": type,
			"Cache-Control": "public, max-age=31536000, immutable",
			"X-Content-Type-Options": "nosniff",
			"Accept-Ranges": "bytes",
			"Content-Length": String(info.size),
		});

		if (range) {
			const match = /^bytes=(\d*)-(\d*)$/.exec(range);
			if (match) {
				const start = match[1] ? Number(match[1]) : 0;
				const end = match[2] ? Number(match[2]) : info.size - 1;
				if (start >= info.size || end >= info.size || start > end) {
					return new Response("Range Not Satisfiable", {
						status: 416,
						headers: { "Content-Range": `bytes */${info.size}` },
					});
				}
				const buffer = await readFile(target);
				const slice = buffer.subarray(start, end + 1);
				headers.set("Content-Range", `bytes ${start}-${end}/${info.size}`);
				headers.set("Content-Length", String(slice.byteLength));
				return new Response(slice, { status: 206, headers });
			}
		}

		const buffer = await readFile(target);
		return new Response(buffer, { status: 200, headers });
	} catch (error) {
		if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return new Response("Not found", { status: 404 });
		throw error;
	}
}
