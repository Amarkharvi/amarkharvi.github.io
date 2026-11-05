"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { revalidatePublicSite } from "@/lib/admin/revalidate-site";
import { isOrderChannel, saveSiteSettings, type SiteSettings } from "@/lib/site-settings";

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

function isPersona(value: unknown): boolean {
	if (!value || typeof value !== "object") return false;
	const persona = value as Record<string, unknown>;
	return (
		typeof persona.badge === "string" &&
		typeof persona.role === "string" &&
		typeof persona.headline === "string" &&
		typeof persona.body === "string" &&
		typeof persona.tools === "string" &&
		typeof persona.ctaLabel === "string" &&
		typeof persona.ctaHref === "string" &&
		typeof persona.columnEyebrow === "string" &&
		typeof persona.columnTitle === "string" &&
		typeof persona.featureTitle === "string" &&
		typeof persona.featureBody === "string" &&
		typeof persona.featureChips === "string" &&
		typeof persona.featureHref === "string" &&
		typeof persona.featureLinkLabel === "string" &&
		typeof persona.featureMedia === "string" &&
		typeof persona.featurePoster === "string"
	);
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
		!isOrderChannel(settings.orderChannel) ||
		typeof settings.introHeading !== "string" ||
		typeof settings.introSubheading !== "string" ||
		typeof settings.introParagraph !== "string" ||
		!isSwipe(settings.swipe) ||
		!isReel(settings.reel) ||
		!isPersona(settings.persona1) ||
		!isPersona(settings.persona2)
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
	revalidatePublicSite(["content:site-settings"]);

	return { error: null, saved: true };
}
