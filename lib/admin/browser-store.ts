import { IS_STATIC_SITE } from "@/lib/is-static";
import {
	clearGithubToken,
	githubDeleteUpload,
	githubListUploads,
	githubReadJson,
	githubToken,
	githubUpload,
	githubWriteJson,
	setGithubToken,
	verifyGithubToken,
	type UploadItem,
} from "@/lib/admin/github-store";

export type { UploadItem };
export type SaveState = { error: string | null; saved: boolean };

async function readError(res: Response): Promise<string> {
	const body = (await res.json().catch(() => null)) as { error?: string } | null;
	return body?.error ?? `Request failed (${res.status}).`;
}

export async function signIn(secret: string): Promise<string | null> {
	if (IS_STATIC_SITE) {
		try {
			await verifyGithubToken(secret);
			setGithubToken(secret);
			return null;
		} catch (error) {
			return error instanceof Error ? error.message : "That token was rejected.";
		}
	}
	const res = await fetch("/api/admin/session", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ password: secret }),
	});
	if (!res.ok) return readError(res);
	return null;
}

export async function signOut(): Promise<void> {
	if (IS_STATIC_SITE) {
		clearGithubToken();
		return;
	}
	await fetch("/api/admin/session", { method: "DELETE" });
}

export async function hasSession(): Promise<boolean> {
	if (IS_STATIC_SITE) return Boolean(githubToken());
	const res = await fetch("/api/admin/session", { cache: "no-store" });
	if (!res.ok) return false;
	const body = (await res.json()) as { ok?: boolean };
	return body.ok === true;
}

export async function loadJson<T>(name: string, fallback: T): Promise<T> {
	if (IS_STATIC_SITE) return githubReadJson(`content/${name}.json`, fallback);
	const res = await fetch(`/api/admin/content/${name}`, { cache: "no-store" });
	if (res.status === 401) throw new Error("Sign in required.");
	if (res.status === 404) return fallback;
	if (!res.ok) throw new Error(await readError(res));
	return (await res.json()) as T;
}

export async function saveJsonForm(name: string, field: string, formData: FormData): Promise<SaveState> {
	let data: unknown;
	try {
		data = JSON.parse(String(formData.get(field) ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	try {
		if (IS_STATIC_SITE) {
			await githubWriteJson(`content/${name}.json`, data, `Update ${name} from admin`);
		} else {
			const res = await fetch(`/api/admin/content/${name}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) return { error: await readError(res), saved: false };
		}
		return { error: null, saved: true };
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Save failed.", saved: false };
	}
}

export function saveFilmsForm(prev: SaveState, formData: FormData) {
	return saveJsonForm("films", "films", formData).then((state) => state ?? prev);
}
export function saveProductsForm(prev: SaveState, formData: FormData) {
	return saveJsonForm("products", "products", formData).then((state) => state ?? prev);
}
export function saveAboutForm(prev: SaveState, formData: FormData) {
	return saveJsonForm("about", "about", formData).then((state) => state ?? prev);
}
export function saveSiteForm(prev: SaveState, formData: FormData) {
	return saveJsonForm("site-settings", "settings", formData).then((state) => state ?? prev);
}
export function saveTechStackForm(prev: SaveState, formData: FormData) {
	return saveJsonForm("tech-stack", "techStack", formData).then((state) => state ?? prev);
}
export function saveCredentialsForm(prev: SaveState, formData: FormData) {
	return saveJsonForm("credentials", "credentials", formData).then((state) => state ?? prev);
}

export async function loadUploads(): Promise<UploadItem[]> {
	if (IS_STATIC_SITE) return githubListUploads();
	const res = await fetch("/api/admin/media", { cache: "no-store" });
	if (res.status === 401) throw new Error("Sign in required.");
	if (!res.ok) throw new Error(await readError(res));
	return (await res.json()) as UploadItem[];
}

export async function uploadFile(file: File): Promise<string | null> {
	try {
		if (IS_STATIC_SITE) {
			await githubUpload(file);
			return null;
		}
		const body = new FormData();
		body.set("file", file);
		const res = await fetch("/api/admin/media", { method: "POST", body });
		if (!res.ok) return readError(res);
		return null;
	} catch (error) {
		return error instanceof Error ? error.message : "Upload failed.";
	}
}

export async function removeUpload(name: string): Promise<void> {
	if (IS_STATIC_SITE) {
		await githubDeleteUpload(name);
		return;
	}
	const res = await fetch(`/api/admin/media?name=${encodeURIComponent(name)}`, { method: "DELETE" });
	if (!res.ok) throw new Error(await readError(res));
}
