"use client";

import { useActionState, useState } from "react";
import { Card, Field, SaveBar } from "@/components/admin/fields";
import { Icon } from "@/components/ui/icon";
import type { Credential, Credentials } from "@/lib/content";
import { saveCredentialsForm, type SaveState } from "@/lib/admin/browser-store";

const initialState: SaveState = { error: null, saved: false };

function blankCredential(): Credential {
	return { icon: "star", title: "New credential", body: "" };
}

function Group({
	title,
	items,
	onChange,
}: {
	title: string;
	items: Credential[];
	onChange: (items: Credential[]) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{title}</span>
			{items.map((item, index) => (
				<div key={index} className="grid grid-cols-[6rem_1fr_auto] gap-2 rounded-lg bg-surface-container-low p-2.5">
					<Field label="Icon" value={item.icon} onChange={(value) => onChange(items.map((entry, i) => (i === index ? { ...entry, icon: value } : entry)))} />
					<div className="flex flex-col gap-2">
						<Field label="Title" value={item.title} onChange={(value) => onChange(items.map((entry, i) => (i === index ? { ...entry, title: value } : entry)))} />
						<Field label="Body" value={item.body} onChange={(value) => onChange(items.map((entry, i) => (i === index ? { ...entry, body: value } : entry)))} as="textarea" />
					</div>
					<button
						type="button"
						onClick={() => onChange(items.filter((_, i) => i !== index))}
						className="flex h-9 w-9 items-center justify-center self-start rounded-lg text-on-surface-variant transition-colors hover:text-red-500"
					>
						<Icon name="delete" className="text-[16px]" />
					</button>
				</div>
			))}
			<button
				type="button"
				onClick={() => onChange([...items, blankCredential()])}
				className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant py-2 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
			>
				<Icon name="add" className="text-[16px]" />
				Add
			</button>
		</div>
	);
}

export function CredentialsEditor({ initialCredentials }: { initialCredentials: Credentials }) {
	const [data, setData] = useState<Credentials>(initialCredentials);
	const [state, action, pending] = useActionState(saveCredentialsForm, initialState);

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="credentials" value={JSON.stringify(data)} />
			<Card>
				<Group title="Picture work (About page)" items={data.cinema} onChange={(items) => setData((prev) => ({ ...prev, cinema: items }))} />
			</Card>
			<Card>
				<Group title="Full stack (About page)" items={data.engineering} onChange={(items) => setData((prev) => ({ ...prev, engineering: items }))} />
			</Card>
			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
