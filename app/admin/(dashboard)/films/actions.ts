"use server";

import { revalidatePath, updateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { saveFilms, type Film } from "@/lib/content";

export type FilmsFormState = { error: string | null; saved: boolean };

function isFilm(value: unknown): value is Film {
	if (!value || typeof value !== "object") return false;
	const film = value as Record<string, unknown>;
	return (
		typeof film.slug === "string" &&
		typeof film.title === "string" &&
		typeof film.badge === "string" &&
		typeof film.badgeTone === "string" &&
		typeof film.cover === "string" &&
		typeof film.note === "string" &&
		Array.isArray(film.specs) &&
		film.specs.length === 2 &&
		Array.isArray(film.stills) &&
		film.stills.length === 2
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
		return { error: "Each entry needs at least a slug, title, badge, cover, note, 2 specs, and 2 stills.", saved: false };
	}

	const slugs = new Set<string>();
	for (const film of parsed) {
		if (!film.slug.trim()) return { error: "Every entry needs a slug.", saved: false };
		if (slugs.has(film.slug)) return { error: `Duplicate slug "${film.slug}".`, saved: false };
		slugs.add(film.slug);
	}

	await saveFilms(parsed);
	updateTag("content:films");
	revalidatePath("/cinema");
	revalidatePath("/cinema/quiet-moments");
	revalidatePath("/");

	return { error: null, saved: true };
}
