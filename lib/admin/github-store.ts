// Browser-side reads and writes for the GitHub Pages admin. GitHub's contents API is
// CORS-enabled, so the hosted site can commit content JSON and uploads straight to `main`.
// The token never leaves this browser tab.

const REPO = "Amarkharvi/amarkharvi.github.io";
const BRANCH = "main";
const TOKEN_KEY = "dp_github_token";

export type UploadItem = { name: string; url: string; previewUrl?: string; kind: "image" | "video"; size: number; uploadedAt: string };

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);

export function githubToken(): string | null {
	if (typeof sessionStorage === "undefined") return null;
	return sessionStorage.getItem(TOKEN_KEY);
}

// A token pasted from a chat app, notes, or a password manager can carry an invisible character
// (zero-width space, a smart quote, a stray newline) that `.trim()` doesn't catch. Browsers reject
// `fetch()` headers containing anything outside Latin-1, which otherwise surfaces as a cryptic
// "String contains non ISO-8859-1 code point" error. GitHub tokens are only ever `[A-Za-z0-9_]`,
// so strip everything else.
function sanitizeToken(token: string): string {
	return token.trim().replace(/[^\x21-\x7e]/g, "");
}

export function setGithubToken(token: string) {
	sessionStorage.setItem(TOKEN_KEY, sanitizeToken(token));
}

export function clearGithubToken() {
	sessionStorage.removeItem(TOKEN_KEY);
}

function headers(token: string, json = true): HeadersInit {
	return {
		Accept: "application/vnd.github+json",
		Authorization: `Bearer ${token}`,
		"X-GitHub-Api-Version": "2022-11-28",
		...(json ? { "Content-Type": "application/json" } : {}),
	};
}

function requireToken(): string {
	const token = githubToken();
	if (!token) throw new Error("Sign in with a GitHub token first.");
	return token;
}

async function githubError(res: Response): Promise<string> {
	const body = (await res.json().catch(() => null)) as { message?: string } | null;
	return body?.message ? `GitHub: ${body.message}` : `GitHub request failed (${res.status}).`;
}

type ContentResponse = { content?: string; sha?: string; name?: string; size?: number; type?: string };

async function getContent(path: string, token: string): Promise<ContentResponse | ContentResponse[] | null> {
	const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
		headers: headers(token, false),
		cache: "no-store",
	});
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(await githubError(res));
	return (await res.json()) as ContentResponse | ContentResponse[];
}

function decodeBase64(value: string): string {
	const binary = atob(value.replace(/\n/g, ""));
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

function encodeUtf8(value: string): string {
	const bytes = new TextEncoder().encode(value);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary);
}

export async function verifyGithubToken(rawToken: string): Promise<void> {
	const token = sanitizeToken(rawToken);
	if (!token) throw new Error("Paste a GitHub token first.");
	const res = await fetch(`https://api.github.com/repos/${REPO}`, { headers: headers(token, false) });
	if (!res.ok) throw new Error(await githubError(res));
}

export async function githubReadJson<T>(path: string, fallback: T): Promise<T> {
	const token = requireToken();
	const file = await getContent(path, token);
	if (!file || Array.isArray(file) || !file.content) return fallback;
	return JSON.parse(decodeBase64(file.content)) as T;
}

export async function githubWriteJson(path: string, data: unknown, message: string): Promise<void> {
	const token = requireToken();
	const existing = await getContent(path, token);
	const sha = existing && !Array.isArray(existing) ? existing.sha : undefined;
	const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
		method: "PUT",
		headers: headers(token),
		body: JSON.stringify({
			message,
			content: encodeUtf8(`${JSON.stringify(data, null, "\t")}\n`),
			branch: BRANCH,
			...(sha ? { sha } : {}),
		}),
	});
	if (!res.ok) throw new Error(await githubError(res));
}

// GitHub Pages serves `/media/uploads/*` only after the static build finishes. The commit is
// available on raw.githubusercontent.com immediately, so the admin preview uses that while the
// value saved into content stays the site path.
function previewUrlFor(name: string): string {
	return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public/media/uploads/${encodeURIComponent(name)}`;
}

function kindOf(name: string): UploadItem["kind"] | null {
	const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
	if (IMAGE_EXT.has(ext)) return "image";
	if (VIDEO_EXT.has(ext)) return "video";
	return null;
}

export async function githubListUploads(): Promise<UploadItem[]> {
	const token = requireToken();
	const listing = await getContent("public/media/uploads", token);
	if (!listing) return [];
	const entries = Array.isArray(listing) ? listing : [];
	const items: UploadItem[] = [];
	for (const entry of entries) {
		const kind = kindOf(entry.name ?? "");
		if (!kind || !entry.name || entry.name === ".gitkeep") continue;
		items.push({ name: entry.name, url: `/media/uploads/${entry.name}`, previewUrl: previewUrlFor(entry.name), kind, size: entry.size ?? 0, uploadedAt: "" });
	}
	return items;
}

export async function githubUpload(file: File): Promise<void> {
	if (file.size > 4_500_000) throw new Error("GitHub's API accepts files up to about 4.5MB. Compress the image or reel, then upload again.");
	const token = requireToken();
	const stem = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 48) || "upload";
	const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
	if (!kindOf(`file${ext}`)) throw new Error("Upload an image (jpg, png, webp, gif, avif) or a video (mp4, webm, mov).");
	const name = `${stem}-${Date.now()}${ext}`;
	const bytes = new Uint8Array(await file.arrayBuffer());
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	const res = await fetch(`https://api.github.com/repos/${REPO}/contents/public/media/uploads/${name}`, {
		method: "PUT",
		headers: headers(token),
		body: JSON.stringify({
			message: `Upload ${name} from admin`,
			content: btoa(binary),
			branch: BRANCH,
		}),
	});
	if (!res.ok) throw new Error(await githubError(res));
}

export async function githubDeleteUpload(name: string): Promise<void> {
	if (!/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(name)) throw new Error("Invalid file name.");
	const token = requireToken();
	const existing = await getContent(`public/media/uploads/${name}`, token);
	const sha = existing && !Array.isArray(existing) ? existing.sha : undefined;
	if (!sha) throw new Error("That file isn't in the repo.");
	const res = await fetch(`https://api.github.com/repos/${REPO}/contents/public/media/uploads/${name}`, {
		method: "DELETE",
		headers: headers(token),
		body: JSON.stringify({ message: `Remove ${name} from admin`, sha, branch: BRANCH }),
	});
	if (!res.ok) throw new Error(await githubError(res));
}
