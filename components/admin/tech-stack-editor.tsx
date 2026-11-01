"use client";

import { useActionState, useState } from "react";
import { Field, SaveBar, SelectField } from "@/components/admin/fields";
import { Icon } from "@/components/ui/icon";
import type { TechStackItem } from "@/lib/content";
import { saveTechStackForm, type SaveState } from "@/lib/admin/browser-store";

const dotOptions = [
	"bg-primary",
	"bg-primary-container",
	"bg-primary-fixed-dim",
	"bg-secondary",
	"bg-secondary-container",
	"bg-tertiary",
	"bg-tertiary-fixed-dim",
	"bg-outline",
].map((value) => ({ value, label: value.replace("bg-", "") }));

const groupOptions = [
	{ value: "focus", label: "Focus (highlighted)" },
	{ value: "web", label: "Web" },
	{ value: "server", label: "Server" },
];

const initialState: SaveState = { error: null, saved: false };

export function TechStackEditor({ initialItems }: { initialItems: TechStackItem[] }) {
	const [items, setItems] = useState<TechStackItem[]>(initialItems);
	const [state, action, pending] = useActionState(saveTechStackForm, initialState);

	function update(index: number, patch: Partial<TechStackItem>) {
		setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
	}

	return (
		<form action={action} className="flex flex-col gap-3 pb-24">
			<input type="hidden" name="techStack" value={JSON.stringify(items)} />
			<div className="flex flex-col gap-2">
				{items.map((item, index) => (
					<div key={index} className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2 rounded-lg bg-surface-container-low p-2.5">
						<Field label="Skill" value={item.label} onChange={(value) => update(index, { label: value })} />
						<SelectField label="Dot color" value={item.dot} onChange={(value) => update(index, { dot: value })} options={dotOptions} className="w-32" />
						<SelectField label="Group" value={item.group} onChange={(value) => update(index, { group: value as TechStackItem["group"] })} options={groupOptions} className="w-40" />
						<button
							type="button"
							onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
							className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:text-red-500"
						>
							<Icon name="delete" className="text-[16px]" />
						</button>
					</div>
				))}
			</div>
			<button
				type="button"
				onClick={() => setItems((prev) => [...prev, { label: "New skill", dot: "bg-outline", group: "web" }])}
				className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant py-2.5 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
			>
				<Icon name="add" className="text-[16px]" />
				Add skill
			</button>
			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
