import { site } from "./site";

export type SocialLink = { label: string; handle: string; href: string };

// The showreel background: a short clip behind the "PERSONA 01" hero on the Dual Persona home
// page and the player at the top of Cinema. `video` is a `/media/uploads/...` path from the admin
// media library; `poster` shows while there's no video (or before it loads).
export type ReelSettings = { video: string; poster: string };

export type SiteSettings = {
	name: string;
	tagline: string;
	availability: string;
	location: string;
	role: string;
	whatsapp: string;
	reel: ReelSettings;
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
	reel: { video: "", poster: "/media/work/quiet-moments-train.png" },
	socials: {
		github: { ...site.socials.github },
		linkedin: { ...site.socials.linkedin },
		twitter: { ...site.socials.twitter },
		youtube: { ...site.socials.youtube },
		instagram: { ...site.socials.instagram },
	},
};
