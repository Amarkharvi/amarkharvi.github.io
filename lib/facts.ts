import { cacheTag } from "next/cache";
import { defaultFacts, factPageKeys, type Fact, type FactPageKey, type FactPages } from "./facts-data";

export type { Fact, FactPageKey, FactPages } from "./facts-data";
export { defaultFacts, factPageKeys, factPageLabels } from "./facts-data";

function isFact(value: unknown): value is Fact {
	if (!value || typeof value !== "object") return false;
	const fact = value as Record<string, unknown>;
	return typeof fact.title === "string" && typeof fact.body === "string";
}

export async function getFacts(): Promise<FactPages> {
	"use cache";
	cacheTag("content:facts");
	const { readContent } = await import("./content-store");
	const stored = await readContent<Partial<Record<FactPageKey, unknown>>>("facts", {});
	const pages = { ...defaultFacts };
	for (const key of factPageKeys) {
		const list = stored[key];
		if (!Array.isArray(list)) continue;
		pages[key] = list.filter(isFact).map((fact) => ({ title: fact.title, body: fact.body }));
	}
	return pages;
}

export async function saveFacts(next: FactPages): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("facts", next);
}
