import { site } from "./site";

export type SocialLink = { label: string; handle: string; href: string };

// The showreel background: a short clip behind the "PERSONA 01" hero on the Dual Persona home
// page and the player at the top of Cinema. `video` is a `/media/uploads/...` path from the admin
// media library; `poster` shows while there's no video (or before it loads).
export type ReelSettings = { video: string; poster: string };

export type SwipeImages = { reel: string; product: string; portrait: string };

/** Where LUT orders from the shop go: an Instagram DM or a prefilled WhatsApp message. */
export type OrderChannel = "instagram" | "whatsapp";

export function isOrderChannel(value: unknown): value is OrderChannel {
	return value === "instagram" || value === "whatsapp";
}

/** Copy for the Dual Persona home heroes and column headings. */
export type PersonaSide = {
	badge: string;
	role: string;
	headline: string;
	body: string;
	/** Comma-separated chips under the headline */
	tools: string;
	ctaLabel: string;
	ctaHref: string;
	columnEyebrow: string;
	columnTitle: string;
	/** First card under the column heading ("The long watch" / the stack card). */
	featureTitle: string;
	featureBody: string;
	/** Comma-separated chips on that card */
	featureChips: string;
	featureHref: string;
	featureLinkLabel: string;
	/** Image or video for that card. Empty keeps the showreel (persona 1) or the code window (persona 2). */
	featureMedia: string;
	featurePoster: string;
	/** Persona 02 terminal strip (ignored for cinema) */
	promptPath?: string;
	terminalWhoami?: string;
	terminalStack?: string;
};

export type SiteSettings = {
	name: string;
	tagline: string;
	availability: string;
	location: string;
	role: string;
	whatsapp: string;
	orderChannel: OrderChannel;
	/** First line of the hero heading (plain serif) */
	introHeading: string;
	/** Second (gradient-styled) line of the hero heading */
	introSubheading: string;
	/** Paragraph below the hero heading */
	introParagraph: string;
	/** Thumbnail images for "The swipe" Instagram grid */
	swipe: SwipeImages;
	reel: ReelSettings;
	persona1: PersonaSide;
	persona2: PersonaSide;
	socials: {
		github: SocialLink;
		linkedin: SocialLink;
		twitter: SocialLink;
		youtube: SocialLink;
		instagram: SocialLink;
	};
};

/** `instagram.com/AmarKharvi/` or `@AmarKharvi` -> `AmarKharvi`; empty when neither yields a username. */
export function instagramUsername(link: SocialLink): string {
	const fromHref = link.href.match(/instagram\.com\/([^/?#\s]+)/i)?.[1];
	const raw = fromHref ?? link.handle;
	return raw.replace(/^@/, "").replace(/[^A-Za-z0-9._]/g, "");
}

export function parseToolChips(tools: string): string[] {
	return tools
		.split(",")
		.map((tool) => tool.trim())
		.filter(Boolean);
}

export const defaultSiteSettings: SiteSettings = {
	name: site.name,
	tagline: site.tagline,
	availability: site.availability,
	location: site.location,
	role: site.role,
	whatsapp: "",
	orderChannel: "instagram",
	introHeading: "Light in the frame,",
	introSubheading: "logic in the stack.",
	introParagraph: "I am Amar Kharvi. One side of me shoots and cuts for YouTube and Instagram. The other builds full-stack products. Pick a side, or take both.",
	swipe: {
		reel: "/media/work/quiet-moments-train.png",
		product: "/media/cinema/neon-monolith-cover.jpg",
		portrait: "/media/cinema/symphony-of-rust-cover.jpg",
	},
	reel: { video: "", poster: "/media/work/quiet-moments-train.png" },
	persona1: {
		badge: "PERSONA 01 • REC",
		role: "Cinematographer & editor",
		headline: "Behind the camera.",
		body: "Product films and portraits on YouTube. Reels, product stills, and portraits on Instagram.",
		tools: "Lightroom, DaVinci Resolve, Premiere Pro",
		ctaLabel: "Enter the cinema",
		ctaHref: "/cinema",
		columnEyebrow: "Persona 01 // Cinematographer",
		columnTitle: "The frame",
		featureTitle: "The long watch",
		featureBody: "Product films, portraits, and the grade, cut to be watched all the way through.",
		featureChips: "Product films, Portraits, Grade & cut",
		featureHref: "/cinema",
		featureLinkLabel: "Watch",
		featureMedia: "",
		featurePoster: "",
	},
	persona2: {
		badge: "PERSONA 02 • BUILD",
		role: "Full-stack developer",
		headline: "Behind the keyboard.",
		body: "ColdFusion where the app already lives. Next.js when it's new.",
		tools: "ColdFusion, jQuery, React, Next.js, Django, Python, shell, SQL, PostgreSQL",
		ctaLabel: "Enter the lab",
		ctaHref: "/lab",
		columnEyebrow: "Persona 02 // Full-stack developer",
		columnTitle: "The stack",
		featureTitle: "stack.js",
		featureBody: "",
		featureChips: "",
		featureHref: "/lab/spectra-wgsl",
		featureLinkLabel: "Stack notes",
		featureMedia: "",
		featurePoster: "",
		promptPath: "~/amar",
		terminalWhoami: "amar — full-stack, Bengaluru",
		terminalStack: "ColdFusion · jQuery · Django · Python · SQL · PostgreSQL · React · Next.js",
	},
	socials: {
		github: { ...site.socials.github },
		linkedin: { ...site.socials.linkedin },
		twitter: { ...site.socials.twitter },
		youtube: { ...site.socials.youtube },
		instagram: { ...site.socials.instagram },
	},
};
