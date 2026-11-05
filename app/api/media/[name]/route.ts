import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { get } from "@vercel/blob";
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

function contentTypeFor(name: string, fallback?: string | null) {
	const ext = path.extname(name).toLowerCase();
	return TYPES[ext] ?? fallback ?? "application/octet-stream";
}

/**
 * Streams an admin upload. On Vercel the file lives in a private Blob store; locally it
 * still comes from `public/media/uploads`. Content JSON stores `/api/media/<name>` so the
 * public site never depends on a raw `*.blob.vercel-storage.com` URL.
 */
export async function GET(request: Request, context: RouteContext) {
	const { name: raw } = await context.params;
	const name = decodeURIComponent(raw);
	if (!assertSafeName(name)) return new Response("Not found", { status: 404 });

	const range = request.headers.get("range") ?? undefined;
	const ifNoneMatch = request.headers.get("if-none-match") ?? undefined;

	if (isBlobStorageEnabled()) {
		const result = await get(`${BLOB_PREFIX}${name}`, {
			access: "private",
			headers: {
				...(range ? { Range: range } : {}),
				...(ifNoneMatch ? { "If-None-Match": ifNoneMatch } : {}),
			},
		});

		if (!result) return new Response("Not found", { status: 404 });
		if (result.statusCode === 304) {
			return new Response(null, {
				status: 304,
				headers: {
					ETag: result.headers.get("etag") ?? "",
					"Cache-Control": "public, max-age=31536000, immutable",
				},
			});
		}

		const headers = new Headers();
		headers.set("Content-Type", contentTypeFor(name, result.blob.contentType));
		headers.set("Cache-Control", "public, max-age=31536000, immutable");
		headers.set("X-Content-Type-Options", "nosniff");
		headers.set("Accept-Ranges", "bytes");
		const etag = result.headers.get("etag");
		if (etag) headers.set("ETag", etag);
		const contentLength = result.headers.get("content-length");
		if (contentLength) headers.set("Content-Length", contentLength);
		else if (typeof result.blob.size === "number") headers.set("Content-Length", String(result.blob.size));

		return new Response(result.stream, { status: 200, headers });
	}

	const target = path.join(UPLOAD_DIR, name);
	if (path.dirname(target) !== UPLOAD_DIR) return new Response("Not found", { status: 404 });

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
