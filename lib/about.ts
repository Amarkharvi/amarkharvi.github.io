import { cacheTag } from "next/cache";
import { defaultAboutContent, type AboutContent } from "./about-data";

export type { AboutContent } from "./about-data";
export { defaultAboutContent } from "./about-data";

export async function getAboutContent(): Promise<AboutContent> {
	"use cache";
	cacheTag("content:about");
	const { readContent } = await import("./content-store");
	const stored = await readContent<Partial<AboutContent>>("about", {});
	return { ...defaultAboutContent, ...stored };
}

export async function saveAboutContent(next: AboutContent): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("about", next);
}
