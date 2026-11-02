import { site } from "./site";

export type SocialLink = { label: string; handle: string; href: string };

// The showreel background: a short clip behind the "PERSONA 01" hero on the Dual Persona home
// page and the player at the top of Cinema. `video` is a `/media/uploads/...` path from the admin
// media library; `poster` shows while there's no video (or before it loads).
export type ReelSettings = { video: string; poster: string };

export type SwipeImages = { reel: string; product: string; portrait: string };

export type SiteSettings = {
	name: string;
	tagline: string;
	availability: string;
	location: string;
	role: string;
	whatsapp: string;
	/** First line of the hero heading (plain serif) */
	introHeading: string;
	/** Second (gradient-styled) line of the hero heading */
	introSubheading: string;
	/** Paragraph below the hero heading */
	introParagraph: string;
	/** Thumbnail images for "The swipe" Instagram grid */
	swipe: SwipeImages;
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
	introHeading: "Light in the frame,",
	introSubheading: "logic in the stack.",
	introParagraph: "I am Amar Kharvi. One side of me shoots and cuts for YouTube and Instagram. The other builds full-stack products. Pick a side, or take both.",
	swipe: {
		reel: "/media/work/quiet-moments-train.png",
		product: "/media/cinema/neon-monolith-cover.jpg",
		portrait: "/media/cinema/symphony-of-rust-cover.jpg",
	},
	reel: { video: "", poster: "/media/work/quiet-moments-train.png" },
	socials: {
		github: { ...site.socials.github },
		linkedin: { ...site.socials.linkedin },
		twitter: { ...site.socials.twitter },
		youtube: { ...site.socials.youtube },
		instagram: { ...site.socials.instagram },
	},
};
