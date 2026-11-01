"use client";

import { useActionState, useState } from "react";
import { Card, Field, SaveBar, SelectField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { Icon } from "@/components/ui/icon";
import type { Film } from "@/lib/content";
import type { MediaItem } from "@/lib/admin/media";
import { saveFilmsAction, type FilmsFormState } from "@/app/admin/(dashboard)/films/actions";

const badgeToneOptions = [
	{ value: "secondary", label: "Secondary" },
	{ value: "primary", label: "Primary" },
	{ value: "warm", label: "Warm" },
	{ value: "neutral", label: "Neutral" },
];

function blankFilm(): Film {
	return {
		slug: `new-entry-${Date.now()}`,
		index: "0",
		title: "New picture work",
		badge: "Edits",
		badgeTone: "neutral",
		stock: "",
		credit: "",
		cover: "",
		focal: "",
		specs: [
			{ label: "", value: "" },
			{ label: "", value: "" },
		],
		note: "",
		stills: [
			{ src: "", alt: "" },
			{ src: "", alt: "" },
		],
		studyHref: "",
	};
}

const initialState: FilmsFormState = { error: null, saved: false };

export function FilmsEditor({ initialFilms, media }: { initialFilms: Film[]; media: MediaItem[] }) {
	const [films, setFilms] = useState<Film[]>(initialFilms);
	const [state, action, pending] = useActionState(saveFilmsAction, initialState);

	function update(index: number, patch: Partial<Film>) {
		setFilms((prev) => prev.map((film, i) => (i === index ? { ...film, ...patch } : film)));
	}

	function updateSpec(index: number, specIndex: 0 | 1, patch: Partial<{ label: string; value: string }>) {
		setFilms((prev) =>
			prev.map((film, i) => {
				if (i !== index) return film;
				const specs = [...film.specs] as Film["specs"];
				specs[specIndex] = { ...specs[specIndex], ...patch };
				return { ...film, specs };
			}),
		);
	}

	function updateStill(index: number, stillIndex: 0 | 1, patch: Partial<{ src: string; alt: string }>) {
		setFilms((prev) =>
			prev.map((film, i) => {
				if (i !== index) return film;
				const stills = [...film.stills] as Film["stills"];
				stills[stillIndex] = { ...stills[stillIndex], ...patch };
				return { ...film, stills };
			}),
		);
	}

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="films" value={JSON.stringify(films)} />

			{films.map((film, index) => (
				<Card key={index}>
					<div className="flex items-center justify-between gap-2">
						<span className="font-mono text-[11px] font-bold text-primary dark:text-primary-fixed-dim">
							#{film.index || index + 1} — {film.slug || "untitled"}
						</span>
						<button
							type="button"
							onClick={() => setFilms((prev) => prev.filter((_, i) => i !== index))}
							className="flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 font-sans text-[11px] font-bold text-on-surface-variant transition-colors hover:text-red-500"
						>
							<Icon name="delete" className="text-[14px]" />
							Remove
						</button>
					</div>

					<div className="grid gap-3 md:grid-cols-3">
						<Field label="Slug" value={film.slug} onChange={(value) => update(index, { slug: value })} />
						<Field label="Index" value={film.index} onChange={(value) => update(index, { index: value })} />
						<Field label="Title" value={film.title} onChange={(value) => update(index, { title: value })} />
						<Field label="Badge" value={film.badge} onChange={(value) => update(index, { badge: value })} />
						<SelectField label="Badge tone" value={film.badgeTone} onChange={(value) => update(index, { badgeTone: value as Film["badgeTone"] })} options={badgeToneOptions} />
						<Field label="Stock line" value={film.stock} onChange={(value) => update(index, { stock: value })} />
						<Field label="Credit line" value={film.credit} onChange={(value) => update(index, { credit: value })} />
						<Field label="Focal line" value={film.focal} onChange={(value) => update(index, { focal: value })} />
						<Field label="Study link (optional)" value={film.studyHref ?? ""} onChange={(value) => update(index, { studyHref: value })} placeholder="/cinema/quiet-moments" />
					</div>

					<MediaPicker label="Cover image" value={film.cover} onChange={(value) => update(index, { cover: value })} media={media} />

					<div className="grid gap-3 md:grid-cols-2">
						<div className="grid grid-cols-2 gap-2">
							<Field label="Spec 1 label" value={film.specs[0].label} onChange={(value) => updateSpec(index, 0, { label: value })} />
							<Field label="Spec 1 value" value={film.specs[0].value} onChange={(value) => updateSpec(index, 0, { value })} />
						</div>
						<div className="grid grid-cols-2 gap-2">
							<Field label="Spec 2 label" value={film.specs[1].label} onChange={(value) => updateSpec(index, 1, { label: value })} />
							<Field label="Spec 2 value" value={film.specs[1].value} onChange={(value) => updateSpec(index, 1, { value })} />
						</div>
					</div>

					<Field label="Note" value={film.note} onChange={(value) => update(index, { note: value })} as="textarea" />

					<div className="grid gap-3 md:grid-cols-2">
						<div className="flex flex-col gap-2 rounded-lg bg-surface-container p-3">
							<MediaPicker label="Still 1" value={film.stills[0].src} onChange={(value) => updateStill(index, 0, { src: value })} media={media} />
							<Field label="Still 1 alt text" value={film.stills[0].alt} onChange={(value) => updateStill(index, 0, { alt: value })} />
						</div>
						<div className="flex flex-col gap-2 rounded-lg bg-surface-container p-3">
							<MediaPicker label="Still 2" value={film.stills[1].src} onChange={(value) => updateStill(index, 1, { src: value })} media={media} />
							<Field label="Still 2 alt text" value={film.stills[1].alt} onChange={(value) => updateStill(index, 1, { alt: value })} />
						</div>
					</div>
				</Card>
			))}

			<button
				type="button"
				onClick={() => setFilms((prev) => [...prev, blankFilm()])}
				className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant py-3 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
			>
				<Icon name="add" className="text-[16px]" />
				Add picture work
			</button>

			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
