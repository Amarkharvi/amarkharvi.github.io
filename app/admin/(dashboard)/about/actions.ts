"use server";

import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { saveAboutContent, type AboutContent } from "@/lib/about";

export type AboutFormState = { error: string | null; saved: boolean };

const REQUIRED_KEYS: (keyof AboutContent)[] = [
	"heroImage",
	"heroImageAlt",
	"heroBadge",
	"heroChip",
	"heroOverlayTag",
	"heroCaptionTitle",
	"heroCaptionNote",
	"eyebrow",
	"headline",
	"bio",
	"homeBaseImage",
	"homeBaseImageAlt",
	"homeBaseMapTag",
	"homeBaseTitle",
	"homeBaseBody",
];

function isAboutContent(value: unknown): value is AboutContent {
	if (!value || typeof value !== "object") return false;
	const data = value as Record<string, unknown>;
	return REQUIRED_KEYS.every((key) => typeof data[key] === "string");
}

export async function saveAboutContentAction(_prevState: AboutFormState, formData: FormData): Promise<AboutFormState> {
	await assertAdmin();

	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("about") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!isAboutContent(parsed) || !parsed.headline.trim() || !parsed.bio.trim() || !parsed.heroImage.trim()) {
		return { error: "Fill in at least the headline, bio, and hero image.", saved: false };
	}

	await saveAboutContent(parsed);
	updateTag("content:about");
	revalidatePath("/about");

	return { error: null, saved: true };
}
