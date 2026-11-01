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
