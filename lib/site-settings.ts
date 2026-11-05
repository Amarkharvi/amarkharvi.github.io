import { cacheTag } from "next/cache";
import { defaultSiteSettings, isOrderChannel, type SiteSettings } from "./site-settings-data";

export type { OrderChannel, PersonaSide, ReelSettings, SiteSettings, SocialLink, SwipeImages } from "./site-settings-data";
export { defaultSiteSettings, instagramUsername, isOrderChannel, parseToolChips } from "./site-settings-data";

export async function getSiteSettings(): Promise<SiteSettings> {
	"use cache";
	cacheTag("content:site-settings");
	// Merge over defaults (and merge `socials` one level deeper) so a settings file saved before a
	// new field existed — e.g. before youtube/instagram were added — still gets a usable value for it.
	const { readContent } = await import("./content-store");
	const stored = await readContent<Partial<SiteSettings>>("site-settings", {});
	return {
		...defaultSiteSettings,
		...stored,
		whatsapp: stored.whatsapp ?? defaultSiteSettings.whatsapp,
		orderChannel: isOrderChannel(stored.orderChannel) ? stored.orderChannel : defaultSiteSettings.orderChannel,
		introHeading: stored.introHeading ?? defaultSiteSettings.introHeading,
		introSubheading: stored.introSubheading ?? defaultSiteSettings.introSubheading,
		introParagraph: stored.introParagraph ?? defaultSiteSettings.introParagraph,
		swipe: { ...defaultSiteSettings.swipe, ...stored.swipe },
		reel: { ...defaultSiteSettings.reel, ...stored.reel },
		persona1: { ...defaultSiteSettings.persona1, ...stored.persona1 },
		persona2: { ...defaultSiteSettings.persona2, ...stored.persona2 },
		socials: { ...defaultSiteSettings.socials, ...stored.socials },
	};
}

export async function saveSiteSettings(next: SiteSettings): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("site-settings", next);
}
