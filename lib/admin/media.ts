import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "uploads");
const PUBLIC_PREFIX = "/media/uploads";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
const MAX_UPLOAD_BYTES = 80 * 1024 * 1024; // 80MB — comfortably covers a cut-down reel

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

export async function listMedia(): Promise<MediaItem[]> {
	await mkdir(UPLOAD_DIR, { recursive: true });
	const entries = await readdir(UPLOAD_DIR);
	const items = await Promise.all(
		entries
			.filter((name) => name !== ".gitkeep")
			.map(async (name) => {
				const info = await stat(path.join(UPLOAD_DIR, name));
				const kind = kindOf(extOf(name));
				return kind ? ({ name, url: `${PUBLIC_PREFIX}/${name}`, kind, size: info.size, uploadedAt: info.mtime.toISOString() } satisfies MediaItem) : null;
			}),
	);
	return items.filter((item): item is MediaItem => item !== null).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function saveMedia(file: File): Promise<MediaItem> {
	if (!file || file.size === 0) throw new Error("The file is empty.");
	if (file.size > MAX_UPLOAD_BYTES) throw new Error("That file is larger than 80MB.");
	const ext = extOf(file.name);
	const kind = kindOf(ext);
	if (!kind) throw new Error("Upload an image (jpg, png, webp, gif, avif) or a video (mp4, webm, mov).");

	await mkdir(UPLOAD_DIR, { recursive: true });
	const name = `${safeStem(file.name)}-${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(path.join(UPLOAD_DIR, name), buffer);

	return { name, url: `${PUBLIC_PREFIX}/${name}`, kind, size: buffer.byteLength, uploadedAt: new Date().toISOString() };
}

export async function deleteMedia(name: string): Promise<void> {
	if (!/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(name) || name.includes("..")) throw new Error("Invalid file name.");
	const target = path.join(UPLOAD_DIR, name);
	if (path.dirname(target) !== UPLOAD_DIR) throw new Error("Invalid file path.");
	await unlink(target);
}
