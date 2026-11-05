import { cacheTag } from "next/cache";
import { defaultCredentials, defaultFilms, defaultTechStack, normalizeFilm } from "./content-data";

export type { Credential, Credentials, Film, FilmMedia, Repo, TechStackGroup, TechStackItem } from "./content-data";
export { defaultCredentials, defaultFilms, defaultTechStack, mediaKindOf, normalizeFilm, repos } from "./content-data";

export async function getFilms(): Promise<import("./content-data").Film[]> {
	"use cache";
	cacheTag("content:films");
	const { readContent } = await import("./content-store");
	const films = await readContent("films", defaultFilms);
	return films.map((film) => normalizeFilm(film));
}

export async function saveFilms(films: import("./content-data").Film[]): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("films", films);
}

export async function getTechStack(): Promise<import("./content-data").TechStackItem[]> {
	"use cache";
	cacheTag("content:tech-stack");
	const { readContent } = await import("./content-store");
	return readContent("tech-stack", defaultTechStack);
}

export async function saveTechStack(items: import("./content-data").TechStackItem[]): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("tech-stack", items);
}

export async function getCredentials(): Promise<import("./content-data").Credentials> {
	"use cache";
	cacheTag("content:credentials");
	const { readContent } = await import("./content-store");
	return readContent("credentials", defaultCredentials);
}

export async function saveCredentials(data: import("./content-data").Credentials): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("credentials", data);
}
