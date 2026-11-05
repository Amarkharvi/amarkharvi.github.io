import "server-only";

/** True when a Vercel Blob store is wired up (token for local / CI, or store id + OIDC on Vercel). */
export function isBlobStorageEnabled(): boolean {
	return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim() || process.env.BLOB_STORE_ID?.trim());
}

/** Running inside a Vercel deployment (preview or production). */
export function isVercelRuntime(): boolean {
	return process.env.VERCEL === "1";
}

/**
 * On Vercel the filesystem under `/var/task` is read-only, so admin content and uploads must use
 * Blob. Locally (and for the GitHub Pages static export) the disk under `content/` and
 * `public/media/uploads/` is fine when no Blob store is configured.
 */
export function requireWritableStorage(): "blob" | "fs" {
	if (isBlobStorageEnabled()) return "blob";
	if (isVercelRuntime()) {
		throw new Error(
			"This deploy has no Vercel Blob store. Create one in the Vercel dashboard (Storage → Blob), connect it to this project, then redeploy.",
		);
	}
	return "fs";
}
