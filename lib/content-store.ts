import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { explainBlobError, isMissingBlobStoreError } from "./blob-errors";
import { rewriteMediaUrls } from "./media-url";
import { isBlobStorageEnabled, requireWritableStorage } from "./storage";

const CONTENT_DIR = path.join(process.cwd(), "content");

function contentPath(name: string) {
	if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid content file name: ${name}`);
	return path.join(CONTENT_DIR, `${name}.json`);
}

function blobPathname(name: string) {
	if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid content file name: ${name}`);
	return `content/${name}.json`;
}

async function readFromBlob<T>(name: string): Promise<T | null> {
	const result = await get(blobPathname(name), { access: "private", useCache: false });
	if (!result || result.statusCode !== 200 || !result.stream) return null;
	const text = await new Response(result.stream).text();
	return rewriteMediaUrls(JSON.parse(text) as T);
}

async function readFromFs<T>(name: string, fallback: T): Promise<T> {
	try {
		const raw = await readFile(contentPath(name), "utf8");
		return rewriteMediaUrls(JSON.parse(raw) as T);
	} catch (error) {
		if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return fallback;
		console.error(`[content-store] failed to read "${name}"`, error);
		return fallback;
	}
}

/** Reads content/<name>.json (Blob on Vercel, disk locally). Returns `fallback` when missing. */
export async function readContent<T>(name: string, fallback: T): Promise<T> {
	if (isBlobStorageEnabled()) {
		try {
			const fromBlob = await readFromBlob<T>(name);
			if (fromBlob !== null) return fromBlob;
		} catch (error) {
			if (isMissingBlobStoreError(error)) {
				console.error(`[content-store] ${explainBlobError(error)}`);
			} else {
				console.error(`[content-store] blob read failed for "${name}"`, error);
			}
		}
		// First deploy / empty store / stale token: fall through to committed defaults on disk when present.
		return readFromFs(name, fallback);
	}
	return readFromFs(name, fallback);
}

/** Writes content/<name>.json to Blob on Vercel, or atomically to disk when developing locally. */
export async function writeContent<T>(name: string, data: T): Promise<void> {
	const mode = requireWritableStorage();
	const body = `${JSON.stringify(rewriteMediaUrls(data), null, "\t")}\n`;
	if (mode === "blob") {
		try {
			await put(blobPathname(name), body, {
				access: "private",
				addRandomSuffix: false,
				allowOverwrite: true,
				contentType: "application/json",
			});
		} catch (error) {
			throw new Error(explainBlobError(error));
		}
		return;
	}
	await mkdir(CONTENT_DIR, { recursive: true });
	const target = contentPath(name);
	const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
	await writeFile(tmp, body, "utf8");
	await rename(tmp, target);
}
