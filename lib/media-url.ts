/** Site-relative URL used in content JSON for admin uploads. */
export function uploadPublicPath(name: string): string {
	return `/api/media/${encodeURIComponent(name)}`;
}

/**
 * Rewrites stored media values so the browser never hits a raw Blob URL.
 * Private Blob stores reject anonymous fetches; the `/api/media/...` route streams them.
 * Also maps the older `/media/uploads/...` disk paths onto the same route.
 */
export function normalizeStoredMediaUrl(url: string): string {
	if (!url || typeof url !== "string") return url;

	if (url.startsWith("/api/media/")) return url;

	if (url.startsWith("/media/uploads/")) {
		const name = url.slice("/media/uploads/".length).split("?")[0] ?? "";
		if (name && !name.includes("..") && !name.includes("/")) return uploadPublicPath(name);
		return url;
	}

	try {
		const parsed = new URL(url);
		if (!parsed.hostname.endsWith("blob.vercel-storage.com")) return url;
		const parts = parsed.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
		const uploadsAt = parts.indexOf("uploads");
		const name = uploadsAt >= 0 ? parts[uploadsAt + 1] : parts.at(-1);
		if (name && !name.includes("..")) return uploadPublicPath(name);
	} catch {
		/* not a URL */
	}

	return url;
}

/** Walk JSON and rewrite any media URL strings so private Blob stays reachable. */
export function rewriteMediaUrls<T>(data: T): T {
	if (typeof data === "string") return normalizeStoredMediaUrl(data) as T;
	if (Array.isArray(data)) return data.map((item) => rewriteMediaUrls(item)) as T;
	if (data && typeof data === "object") {
		const next: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
			next[key] = rewriteMediaUrls(value);
		}
		return next as T;
	}
	return data;
}
