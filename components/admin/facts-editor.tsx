"use client";

import { useActionState, useState } from "react";
import { Card, Field, SaveBar } from "@/components/admin/fields";
import { Icon } from "@/components/ui/icon";
import { saveFactsForm, type SaveState } from "@/lib/admin/browser-store";
import { factPageKeys, factPageLabels, type Fact, type FactPages } from "@/lib/facts-data";

const initialState: SaveState = { error: null, saved: false };

function move(items: Fact[], index: number, direction: -1 | 1) {
	const next = index + direction;
	if (next < 0 || next >= items.length) return items;
	const copy = [...items];
	const [item] = copy.splice(index, 1);
	copy.splice(next, 0, item);
	return copy;
}

export function FactsEditor({ initialFacts }: { initialFacts: FactPages }) {
	const [facts, setFacts] = useState<FactPages>(initialFacts);
	const [state, action, pending] = useActionState(saveFactsForm, initialState);

	function updatePage(key: (typeof factPageKeys)[number], items: Fact[]) {
		setFacts((prev) => ({ ...prev, [key]: items }));
	}

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="facts" value={JSON.stringify(facts)} />
			{factPageKeys.map((key) => {
				const items = facts[key];
				const meta = factPageLabels[key];
				return (
					<Card key={key}>
						<div className="flex items-baseline justify-between gap-2">
							<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{meta.label}</span>
							<span className="font-sans text-[12px] text-on-surface-variant">{meta.where}</span>
						</div>
						{items.map((fact, index) => (
							<div key={`${key}-${index}`} className="flex flex-col gap-2 rounded-xl bg-surface-container p-3">
								<div className="flex items-center justify-between gap-2">
									<span className="font-mono text-[10px] text-on-surface-variant">
										{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
									</span>
									<div className="flex items-center gap-1">
										<button
											type="button"
											aria-label="Move fact up"
											disabled={index === 0}
											onClick={() => updatePage(key, move(items, index, -1))}
											className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface disabled:opacity-30"
										>
											<Icon name="arrow_upward" className="text-[16px]" />
										</button>
										<button
											type="button"
											aria-label="Move fact down"
											disabled={index === items.length - 1}
											onClick={() => updatePage(key, move(items, index, 1))}
											className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface disabled:opacity-30"
										>
											<Icon name="arrow_downward" className="text-[16px]" />
										</button>
										<button
											type="button"
											aria-label="Remove fact"
											onClick={() => updatePage(key, items.filter((_, itemIndex) => itemIndex !== index))}
											className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:text-red-500"
										>
											<Icon name="delete" className="text-[16px]" />
										</button>
									</div>
								</div>
								<Field
									label="Title"
									value={fact.title}
									onChange={(value) => updatePage(key, items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, title: value } : entry)))}
								/>
								<Field
									label="Body"
									as="textarea"
									value={fact.body}
									onChange={(value) => updatePage(key, items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, body: value } : entry)))}
								/>
							</div>
						))}
						<button
							type="button"
							onClick={() => updatePage(key, [...items, { title: "New fact", body: "" }])}
							className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant py-2 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
						>
							<Icon name="add" className="text-[16px]" />
							Add a fact
						</button>
					</Card>
				);
			})}
			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
