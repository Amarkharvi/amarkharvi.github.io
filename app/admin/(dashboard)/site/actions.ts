"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { saveSiteSettings, type SiteSettings } from "@/lib/site-settings";

export type SiteFormState = { error: string | null; saved: boolean };

function isSocial(value: unknown): boolean {
	if (!value || typeof value !== "object") return false;
	const social = value as Record<string, unknown>;
	return typeof social.label === "string" && typeof social.handle === "string" && typeof social.href === "string";
}

function isReel(value: unknown): boolean {
	if (!value || typeof value !== "object") return false;
	const reel = value as Record<string, unknown>;
	return typeof reel.video === "string" && typeof reel.poster === "string";
}

function isSwipe(value: unknown): boolean {
	if (!value || typeof value !== "object") return false;
	const swipe = value as Record<string, unknown>;
	return typeof swipe.reel === "string" && typeof swipe.product === "string" && typeof swipe.portrait === "string";
}

function isSettings(value: unknown): value is SiteSettings {
	if (!value || typeof value !== "object") return false;
	const settings = value as Record<string, unknown>;
	if (
		typeof settings.name !== "string" ||
		typeof settings.tagline !== "string" ||
		typeof settings.availability !== "string" ||
		typeof settings.location !== "string" ||
		typeof settings.role !== "string" ||
		typeof settings.whatsapp !== "string" ||
		typeof settings.introHeading !== "string" ||
		typeof settings.introSubheading !== "string" ||
		typeof settings.introParagraph !== "string" ||
		!isSwipe(settings.swipe) ||
		!isReel(settings.reel)
	) {
		return false;
	}
	const socials = settings.socials as Record<string, unknown> | undefined;
	return (
		Boolean(socials) &&
		isSocial(socials?.github) &&
		isSocial(socials?.linkedin) &&
		isSocial(socials?.twitter) &&
		isSocial(socials?.youtube) &&
		isSocial(socials?.instagram)
	);
}

export async function saveSiteSettingsAction(_prevState: SiteFormState, formData: FormData): Promise<SiteFormState> {
	await assertAdmin();

	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("settings") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!isSettings(parsed)) {
		return { error: "Fill in every field, including all five social links.", saved: false };
	}

	await saveSiteSettings(parsed);
	revalidateTag("content:site-settings", { expire: 0 });
	revalidatePath("/");
	revalidatePath("/cinema");

	return { error: null, saved: true };
}
