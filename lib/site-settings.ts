import { cacheTag } from "next/cache";
import { defaultSiteSettings, type SiteSettings } from "./site-settings-data";

export type { ReelSettings, SiteSettings, SocialLink } from "./site-settings-data";
export { defaultSiteSettings } from "./site-settings-data";

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
		reel: { ...defaultSiteSettings.reel, ...stored.reel },
		socials: { ...defaultSiteSettings.socials, ...stored.socials },
	};
}

export async function saveSiteSettings(next: SiteSettings): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("site-settings", next);
}
