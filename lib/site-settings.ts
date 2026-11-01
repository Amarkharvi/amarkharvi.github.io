import "server-only";
import { cacheTag } from "next/cache";
import { readContent, writeContent } from "./content-store";
import { site } from "./site";

export type SocialLink = { label: string; handle: string; href: string };

export type SiteSettings = {
	name: string;
	tagline: string;
	availability: string;
	location: string;
	role: string;
	whatsapp: string;
	socials: {
		github: SocialLink;
		linkedin: SocialLink;
		twitter: SocialLink;
		youtube: SocialLink;
		instagram: SocialLink;
	};
};

export const defaultSiteSettings: SiteSettings = {
	name: site.name,
	tagline: site.tagline,
	availability: site.availability,
	location: site.location,
	role: site.role,
	whatsapp: "",
	socials: {
		github: { ...site.socials.github },
		linkedin: { ...site.socials.linkedin },
		twitter: { ...site.socials.twitter },
		youtube: { ...site.socials.youtube },
		instagram: { ...site.socials.instagram },
	},
};

export async function getSiteSettings(): Promise<SiteSettings> {
	"use cache";
	cacheTag("content:site-settings");
	// Merge over defaults (and merge `socials` one level deeper) so a settings file saved before a
	// new field existed — e.g. before youtube/instagram were added — still gets a usable value for it.
	const stored = await readContent<Partial<SiteSettings>>("site-settings", {});
	return {
		...defaultSiteSettings,
		...stored,
		whatsapp: stored.whatsapp ?? defaultSiteSettings.whatsapp,
		socials: { ...defaultSiteSettings.socials, ...stored.socials },
	};
}

export async function saveSiteSettings(next: SiteSettings): Promise<void> {
	await writeContent("site-settings", next);
}
