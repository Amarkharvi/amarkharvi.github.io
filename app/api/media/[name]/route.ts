import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { get, head, presignUrl } from "@vercel/blob";
import { explainBlobError } from "@/lib/blob-errors";
import { getBlobReadToken } from "@/lib/blob-sign";
import { isBlobStorageEnabled } from "@/lib/storage";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "uploads");
const BLOB_PREFIX = "uploads/";
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);

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

function kindOf(name: string): "image" | "video" | "other" {
	const ext = path.extname(name).toLowerCase();
	if (IMAGE_EXT.has(ext)) return "image";
	if (VIDEO_EXT.has(ext)) return "video";
	return "other";
}

/** Signed CDN URL for video (Range-friendly). Token is cached; only the HMAC is per pathname. */
async function redirectToSignedBlob(pathname: string) {
	try {
		const token = await getBlobReadToken();
		const { presignedUrl } = await presignUrl(token, {
			operation: "get",
			pathname,
			access: "private",
			// Long enough for a reel to play; short enough that a leaked URL expires.
			validUntil: Date.now() + 60 * 60 * 1000,
		});
		return new Response(null, {
			status: 307,
			headers: {
				Location: presignedUrl,
				// Browsers may reuse this redirect briefly so repeat views skip re-signing.
				"Cache-Control": "public, max-age=120, stale-while-revalidate=600",
			},
		});
	} catch (privateError) {
		try {
			const meta = await head(pathname);
			return new Response(null, {
				status: 307,
				headers: {
					Location: meta.url,
					"Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
				},
			});
		} catch {
			throw privateError;
		}
	}
}

/**
 * Images stream through this stable `/api/media/<name>` URL so `next/image` can cache
 * optimizations. Videos redirect to a signed Blob URL so Range requests hit the CDN.
 */
export async function GET(request: Request, context: RouteContext) {
	const { name: raw } = await context.params;
	const name = decodeURIComponent(raw);
	if (!assertSafeName(name)) return new Response("Not found", { status: 404 });

	const pathname = `${BLOB_PREFIX}${name}`;
	const kind = kindOf(name);

	if (isBlobStorageEnabled()) {
		try {
			if (kind === "video") return await redirectToSignedBlob(pathname);

			const ifNoneMatch = request.headers.get("if-none-match") ?? undefined;
			const result = await get(pathname, {
				access: "private",
				headers: ifNoneMatch ? { "If-None-Match": ifNoneMatch } : undefined,
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
			// Upload names include a random suffix — safe to cache forever at the edge + browser.
			headers.set("Cache-Control", "public, max-age=31536000, immutable");
			headers.set("X-Content-Type-Options", "nosniff");
			const etag = result.headers.get("etag");
			if (etag) headers.set("ETag", etag);
			const contentLength = result.headers.get("content-length");
			if (contentLength) headers.set("Content-Length", contentLength);
			else if (typeof result.blob.size === "number") headers.set("Content-Length", String(result.blob.size));

			return new Response(result.stream, { status: 200, headers });
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
