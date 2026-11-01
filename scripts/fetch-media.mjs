import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = path.join(root, "public", "media");
const manifest = JSON.parse(await readFile(path.join(root, "scripts", "media-manifest.json"), "utf8"));
const force = process.argv.includes("--force");

async function exists(file) {
	try {
		await access(file);
		return true;
	} catch {
		return false;
	}
}

let fetched = 0;
let skipped = 0;
let failed = 0;

for (const [relative, url] of Object.entries(manifest)) {
	const target = path.join(mediaDir, relative);
	if (!force && (await exists(target))) {
		skipped++;
		continue;
	}
	try {
		const res = await fetch(`${url}=w1600`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		await mkdir(path.dirname(target), { recursive: true });
		await writeFile(target, Buffer.from(await res.arrayBuffer()));
		fetched++;
		console.log(`✓ ${relative}`);
	} catch (error) {
		failed++;
		console.error(`✗ ${relative}: ${error.message}`);
	}
}

console.log(`\nfetched ${fetched}, skipped ${skipped}, failed ${failed}`);
if (failed) process.exitCode = 1;
