// Builds a static export for GitHub Pages (no Node server there — see the GitHub Actions
// workflow at .github/workflows/github-pages.yml).
//
// The public pages and the admin UI are both exported. Admin saves from the hosted site go
// through the GitHub API in the browser. `/api/*` and the `"use server"` action files still need
// a Node server (cookies, filesystem), so this script moves them aside for the build and always
// moves them back, even if the build fails.
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(root, "app");
const stashDir = join(root, ".static-export-stash");

const actionFiles = [
	"app/admin/(dashboard)/about/actions.ts",
	"app/admin/(dashboard)/films/actions.ts",
	"app/admin/(dashboard)/media/actions.ts",
	"app/admin/(dashboard)/products/actions.ts",
	"app/admin/(dashboard)/site/actions.ts",
	"app/admin/(dashboard)/stack/actions.ts",
];

const moves = [
	{ from: join(appDir, "api"), to: join(stashDir, "api") },
	...actionFiles.map((file) => ({ from: join(root, file), to: join(stashDir, file) })),
];

function stash() {
	mkdirSync(stashDir, { recursive: true });
	for (const { from, to } of moves) {
		if (!existsSync(from)) continue;
		if (existsSync(to)) rmSync(to, { recursive: true, force: true });
		mkdirSync(dirname(to), { recursive: true });
		renameSync(from, to);
	}
}

function restore() {
	for (const { from, to } of moves) {
		if (!existsSync(to)) continue;
		// A previous interrupted build can leave both copies. Keep the live tree.
		if (existsSync(from)) {
			rmSync(to, { recursive: true, force: true });
			continue;
		}
		mkdirSync(dirname(from), { recursive: true });
		renameSync(to, from);
	}
}

// `cacheComponents` implements Partial Prerendering, and PPR can't be combined with
// `output: "export"` (see next.config.ts), so the export build runs with `cacheComponents` off.
// But `"use cache"` and `cacheTag` need that same flag — Next errors on the directive otherwise.
// A static export has no server to ever invalidate a cache tag on anyway, so for this build only,
// these calls are stripped and the functions run as plain `async` calls, same result either way.
const cacheDirectiveFiles = ["lib/about.ts", "lib/content.ts", "lib/products.ts", "lib/site-settings.ts"].map((p) => join(root, p));
const originalSources = new Map();

function stripUseCacheDirectives() {
	for (const file of cacheDirectiveFiles) {
		const original = readFileSync(file, "utf8");
		originalSources.set(file, original);
		const stripped = original
			.replace(/^import \{ cacheTag \} from "next\/cache";\n/m, "")
			.replace(/\n\t*"use cache";/g, "")
			.replace(/\n\t*cacheTag\([^)]*\);/g, "");
		writeFileSync(file, stripped);
	}
}

function restoreCacheDirectives() {
	for (const [file, original] of originalSources) {
		writeFileSync(file, original);
	}
}

let result;
try {
	stash();
	stripUseCacheDirectives();
	// A leftover `.next/dev/types/*` from a prior `next dev` run still references routes this build
	// moves aside, and `tsc` checks it because tsconfig.json includes it.
	try {
		rmSync(join(root, ".next"), { recursive: true, force: true, maxRetries: 3 });
	} catch (error) {
		console.warn("Could not clear .next before the static build:", error instanceof Error ? error.message : error);
	}
	result = spawnSync("npx", ["next", "build"], {
		cwd: root,
		stdio: "inherit",
		env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_STATIC_SITE: "1" },
	});
} finally {
	restoreCacheDirectives();
	restore();
}

if (!result || result.status !== 0) {
	process.exit(result?.status ?? 1);
}

console.log("\nStatic export written to ./out");
