// Builds a static export for GitHub Pages (no Node server there — see the GitHub Actions
// workflow at .github/workflows/github-pages.yml).
//
// `/admin` and `/api/*` both need a real server: the admin pages read and write cookies and run
// Server Actions, and the API routes handle POSTed requests. None of that works in a static
// export, so this script moves both directories out of `app/` before the build and always moves
// them back afterward, even if the build fails.
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(root, "app");
const stashDir = join(root, ".static-export-stash");

const moves = [
	{ from: join(appDir, "admin"), to: join(stashDir, "admin") },
	{ from: join(appDir, "api"), to: join(stashDir, "api") },
	// `components/admin/*` only imports from `app/admin/*` (Server Actions) and isn't imported by
	// anything outside `app/admin/*` — stash it too, or `tsc` fails on the now-missing imports.
	{ from: join(root, "components", "admin"), to: join(stashDir, "components-admin") },
];

function stash() {
	mkdirSync(stashDir, { recursive: true });
	for (const { from, to } of moves) {
		if (existsSync(from)) renameSync(from, to);
	}
}

function restore() {
	for (const { from, to } of moves) {
		if (existsSync(to)) renameSync(to, from);
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

stash();
stripUseCacheDirectives();
// A leftover `.next/dev/types/*` from a prior `next dev` run still references the now-moved admin
// and API routes, and `tsc` checks it because tsconfig.json includes it — clean it so this build
// generates its own types for the routes that actually remain.
rmSync(join(root, ".next"), { recursive: true, force: true });
let result;
try {
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
