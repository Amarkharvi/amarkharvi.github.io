import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

function contentPath(name: string) {
	if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid content file name: ${name}`);
	return path.join(CONTENT_DIR, `${name}.json`);
}

/** Reads content/<name>.json. Returns `fallback` if the file doesn't exist yet or fails to parse. */
export async function readContent<T>(name: string, fallback: T): Promise<T> {
	try {
		const raw = await readFile(contentPath(name), "utf8");
		return JSON.parse(raw) as T;
	} catch (error) {
		if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return fallback;
		console.error(`[content-store] failed to read "${name}"`, error);
		return fallback;
	}
}

/** Writes content/<name>.json atomically (write to a temp file, then rename over the target). */
export async function writeContent<T>(name: string, data: T): Promise<void> {
	await mkdir(CONTENT_DIR, { recursive: true });
	const target = contentPath(name);
	const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
	await writeFile(tmp, JSON.stringify(data, null, "\t"), "utf8");
	await rename(tmp, target);
}
