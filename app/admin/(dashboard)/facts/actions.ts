"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { revalidatePublicSite } from "@/lib/admin/revalidate-site";
import { factPageKeys, saveFacts, type FactPages } from "@/lib/facts";

export type FactsFormState = { error: string | null; saved: boolean };

function isFactList(value: unknown): boolean {
	if (!Array.isArray(value)) return false;
	return value.every((item) => {
		if (!item || typeof item !== "object") return false;
		const fact = item as Record<string, unknown>;
		return typeof fact.title === "string" && fact.title.trim().length > 0 && typeof fact.body === "string" && fact.body.trim().length > 0;
	});
}

export async function saveFactsAction(_prevState: FactsFormState, formData: FormData): Promise<FactsFormState> {
	await assertAdmin();

	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("facts") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!parsed || typeof parsed !== "object") return { error: "Couldn't read the facts.", saved: false };

	const record = parsed as Record<string, unknown>;
	for (const key of factPageKeys) {
		if (!isFactList(record[key])) return { error: "Every fact needs a title and a body. Remove a card instead of leaving it blank.", saved: false };
	}

	await saveFacts(parsed as FactPages);
	revalidatePublicSite(["content:facts"]);
	return { error: null, saved: true };
}
