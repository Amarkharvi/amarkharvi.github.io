"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { revalidatePublicSite } from "@/lib/admin/revalidate-site";
import { mediaKindOf, normalizeFilm, saveFilms, type Film, type FilmMedia } from "@/lib/content";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";

export type FilmsFormState = { error: string | null; saved: boolean };

function isMedia(value: unknown): value is FilmMedia {
	if (!value || typeof value !== "object") return false;
	const item = value as Record<string, unknown>;
	return typeof item.src === "string" && typeof item.alt === "string";
}

function isFilm(value: unknown): value is Film {
	if (!value || typeof value !== "object") return false;
	const film = value as Record<string, unknown>;
	const gallery = Array.isArray(film.gallery) ? film.gallery : Array.isArray(film.stills) ? film.stills : null;
	return (
		typeof film.slug === "string" &&
		typeof film.title === "string" &&
		typeof film.badge === "string" &&
		typeof film.badgeTone === "string" &&
		typeof film.cover === "string" &&
		typeof film.note === "string" &&
		Array.isArray(film.specs) &&
		film.specs.length === 2 &&
		Boolean(gallery) &&
		gallery!.length >= 3 &&
		gallery!.every(isMedia)
	);
}

export async function saveFilmsAction(_prevState: FilmsFormState, formData: FormData): Promise<FilmsFormState> {
	await assertAdmin();

	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("films") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isFilm)) {
		return { error: "Each entry needs a slug, title, badge, cover, note, 2 specs, and at least 3 gallery photos or reels.", saved: false };
	}

	const slugs = new Set<string>();
	const normalized: Film[] = [];
	for (const film of parsed) {
		if (!film.slug.trim()) return { error: "Every entry needs a slug.", saved: false };
		if (slugs.has(film.slug)) return { error: `Duplicate slug "${film.slug}".`, saved: false };
		slugs.add(film.slug);
		const next = normalizeFilm(film);
		if (next.gallery.some((item) => !item.src.trim())) {
			return { error: `Fill every gallery file for "${film.title || film.slug}".`, saved: false };
		}
		next.gallery = next.gallery.map((item) => ({ ...item, kind: mediaKindOf(item.src, item.kind) }));
		normalized.push(next);
	}

	await saveFilms(normalized);

	// Keep Dual Persona "The swipe" thumbs aligned with Picture Work covers so one admin edit
	// updates Cinema cards and the home page grid together.
	const settings = await getSiteSettings();
	const swipeMap = {
		"instagram-reels": "reel",
		"product-shoots": "product",
		portraits: "portrait",
	} as const;
	const nextSwipe = { ...settings.swipe };
	let swipeChanged = false;
	for (const film of normalized) {
		const key = swipeMap[film.slug as keyof typeof swipeMap];
		if (!key || !film.cover.trim()) continue;
		if (nextSwipe[key] === film.cover) continue;
		nextSwipe[key] = film.cover;
		swipeChanged = true;
	}
	if (swipeChanged) {
		await saveSiteSettings({ ...settings, swipe: nextSwipe });
	}

	revalidatePublicSite(["content:films", ...(swipeChanged ? ["content:site-settings"] : [])]);

	return { error: null, saved: true };
}
