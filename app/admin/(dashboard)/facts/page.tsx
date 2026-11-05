"use client";

import { useEffect, useState } from "react";
import { FactsEditor } from "@/components/admin/facts-editor";
import { AdminLoading } from "@/components/admin/fields";
import { loadJson } from "@/lib/admin/browser-store";
import { defaultFacts, factPageKeys, type Fact, type FactPages } from "@/lib/facts-data";

function withDefaults(stored: Partial<FactPages>): FactPages {
	const pages = { ...defaultFacts };
	for (const key of factPageKeys) {
		const list = stored[key];
		if (!Array.isArray(list)) continue;
		pages[key] = list.filter((item): item is Fact => Boolean(item) && typeof item.title === "string" && typeof item.body === "string");
	}
	return pages;
}

export default function AdminFactsPage() {
	const [facts, setFacts] = useState<FactPages | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		loadJson<Partial<FactPages>>("facts", defaultFacts)
			.then((stored) => {
				if (live) setFacts(withDefaults(stored));
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load the facts.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!facts) return <AdminLoading />;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Facts</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					The short cards on Dual Persona, Cinema, the reel study, Code &amp; Lab, Stack notes, the shop, and About. The first fact is the one visitors see. Order them with the arrows.
				</p>
			</div>
			<FactsEditor initialFacts={facts} />
		</div>
	);
}
