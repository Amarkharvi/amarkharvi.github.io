import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { del, list, put } from "@vercel/blob";
import { explainBlobError } from "@/lib/blob-errors";
import { uploadPublicPath } from "@/lib/media-url";
import { isBlobStorageEnabled, requireWritableStorage } from "@/lib/storage";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "uploads");
const BLOB_PREFIX = "uploads/";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
const MAX_UPLOAD_BYTES = 80 * 1024 * 1024; // 80MB — comfortably covers a cut-down reel
// Vercel Functions cap the request body around 4.5MB on Hobby; Blob itself accepts larger files
// via client uploads. Keep the server route under that ceiling when on Vercel.
const VERCEL_UPLOAD_BYTES = 4_500_000;

export type MediaKind = "image" | "video";
export type MediaItem = { name: string; url: string; kind: MediaKind; size: number; uploadedAt: string };

function extOf(name: string): string {
	const ext = path.extname(name).toLowerCase();
	return /^\.[a-z0-9]{1,8}$/.test(ext) ? ext : "";
}

function kindOf(ext: string): MediaKind | null {
	if (IMAGE_EXT.has(ext)) return "image";
	if (VIDEO_EXT.has(ext)) return "video";
	return null;
}

function safeStem(name: string): string {
	const stem = path.basename(name, path.extname(name));
	const cleaned = stem.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 48);
	return cleaned || "upload";
}

function assertSafeName(name: string) {
	if (!/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(name) || name.includes("..")) {
		throw new Error("Invalid file name.");
	}
}

async function listFromBlob(): Promise<MediaItem[]> {
	const items: MediaItem[] = [];
	let cursor: string | undefined;
	do {
		const page = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
		for (const blob of page.blobs) {
			const name = blob.pathname.slice(BLOB_PREFIX.length);
			if (!name || name.includes("/")) continue;
			const kind = kindOf(extOf(name));
			if (!kind) continue;
			items.push({
				name,
				url: uploadPublicPath(name),
				kind,
				size: blob.size,
				uploadedAt: blob.uploadedAt.toISOString(),
			});
		}
		cursor = page.hasMore ? page.cursor : undefined;
	} while (cursor);
	return items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

async function listFromFs(): Promise<MediaItem[]> {
	try {
		const entries = await readdir(UPLOAD_DIR);
		const items = await Promise.all(
			entries
				.filter((name) => name !== ".gitkeep")
				.map(async (name) => {
					const info = await stat(path.join(UPLOAD_DIR, name));
					const kind = kindOf(extOf(name));
					return kind
						? ({ name, url: uploadPublicPath(name), kind, size: info.size, uploadedAt: info.mtime.toISOString() } satisfies MediaItem)
						: null;
				}),
		);
		return items.filter((item): item is MediaItem => item !== null).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
	} catch (error) {
		// Don't create the directory on read — on Vercel `/var/task/public` is read-only and that
		// mkdir was the ENOENT that broke the Media Library.
		if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return [];
		throw error;
	}
}

export async function listMedia(): Promise<MediaItem[]> {
	if (isBlobStorageEnabled()) {
		try {
			return await listFromBlob();
		} catch (error) {
			throw new Error(explainBlobError(error));
		}
	}
	return listFromFs();
}

export async function saveMedia(file: File): Promise<MediaItem> {
	if (!file || file.size === 0) throw new Error("The file is empty.");
	const mode = requireWritableStorage();
	const limit = mode === "blob" ? VERCEL_UPLOAD_BYTES : MAX_UPLOAD_BYTES;
	if (file.size > limit) {
		throw new Error(
			mode === "blob"
				? "That file is larger than about 4.5MB. Compress it, or upload a shorter cut."
				: "That file is larger than 80MB.",
		);
	}
	const ext = extOf(file.name);
	const kind = kindOf(ext);
	if (!kind) throw new Error("Upload an image (jpg, png, webp, gif, avif) or a video (mp4, webm, mov).");

	const name = `${safeStem(file.name)}-${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
	const uploadedAt = new Date().toISOString();

	if (mode === "blob") {
		try {
			await put(`${BLOB_PREFIX}${name}`, file, {
				access: "private",
				addRandomSuffix: false,
				contentType: file.type || undefined,
			});
		} catch (error) {
			throw new Error(explainBlobError(error));
		}
		return { name, url: uploadPublicPath(name), kind, size: file.size, uploadedAt };
	}

	await mkdir(UPLOAD_DIR, { recursive: true });
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(path.join(UPLOAD_DIR, name), buffer);
	return { name, url: uploadPublicPath(name), kind, size: buffer.byteLength, uploadedAt };
}

export async function deleteMedia(name: string): Promise<void> {
	assertSafeName(name);
	const mode = requireWritableStorage();
	if (mode === "blob") {
		try {
			const pathname = `${BLOB_PREFIX}${name}`;
			const { blobs } = await list({ prefix: pathname, limit: 1 });
			const match = blobs.find((blob) => blob.pathname === pathname);
			if (match) await del(match.url);
		} catch (error) {
			throw new Error(explainBlobError(error));
		}
		return;
	}
	const target = path.join(UPLOAD_DIR, name);
	if (path.dirname(target) !== UPLOAD_DIR) throw new Error("Invalid file path.");
	await unlink(target);
}
