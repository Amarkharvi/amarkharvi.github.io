import "server-only";
import { cacheTag } from "next/cache";
import { readContent, writeContent } from "./content-store";

export type AboutContent = {
	heroImage: string;
	heroImageAlt: string;
	heroBadge: string;
	heroChip: string;
	heroOverlayTag: string;
	heroCaptionTitle: string;
	heroCaptionNote: string;
	eyebrow: string;
	headline: string;
	bio: string;
	homeBaseImage: string;
	homeBaseImageAlt: string;
	homeBaseMapTag: string;
	homeBaseTitle: string;
	homeBaseBody: string;
};

export const defaultAboutContent: AboutContent = {
	heroImage: "/media/about/portrait-studio.jpg",
	heroImageAlt: "Studio frame used as a light reference, not a portrait of Amar",
	heroBadge: "BENGALURU",
	heroChip: "Reels & stills",
	heroOverlayTag: "REELS • PRODUCT • PORTRAITS",
	heroCaptionTitle: "Light reference",
	heroCaptionNote: "not a headshot",
	eyebrow: "Amar Kharvi",
	headline: "Full stack, and the pictures that go with it",
	bio:
		"I build product interfaces and web apps with ColdFusion, HTML, CSS, JavaScript, jQuery, Django, Python, SQL, PostgreSQL, React, Next.js, and shell. I edit in Lightroom, DaVinci Resolve, and Premiere Pro — reels, product shoots, and portraits. Bengaluru is home base. Builds can be remote. Shoots are on location.",
	homeBaseImage: "/media/about/shibuya-map.png",
	homeBaseImageAlt: "Abstract city map used as a visual texture",
	homeBaseMapTag: "Bengaluru",
	homeBaseTitle: "Home base",
	homeBaseBody: "Shoots on location in and around Bengaluru. Full-stack work can be remote. The map image is a texture, not a studio address.",
};

export async function getAboutContent(): Promise<AboutContent> {
	"use cache";
	cacheTag("content:about");
	const stored = await readContent<Partial<AboutContent>>("about", {});
	return { ...defaultAboutContent, ...stored };
}

export async function saveAboutContent(next: AboutContent): Promise<void> {
	await writeContent("about", next);
}
