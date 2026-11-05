"use client";

import { useActionState, useState } from "react";
import { Card, Field, SaveBar, SelectField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { Icon } from "@/components/ui/icon";
import { mediaKindOf, type Film, type FilmMedia } from "@/lib/content-data";
import { saveFilmsForm, type SaveState, type UploadItem } from "@/lib/admin/browser-store";

const badgeToneOptions = [
	{ value: "secondary", label: "Secondary" },
	{ value: "primary", label: "Primary" },
	{ value: "warm", label: "Warm" },
	{ value: "neutral", label: "Neutral" },
];

function blankMedia(): FilmMedia {
	return { src: "", alt: "", kind: "image" };
}

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
		gallery: [blankMedia(), blankMedia(), blankMedia()],
		expandLabel: "Explore this set",
		studyHref: "",
		youtubeHref: "",
		instagramHref: "",
	};
}

const initialState: SaveState = { error: null, saved: false };

export function FilmsEditor({ initialFilms, media }: { initialFilms: Film[]; media: UploadItem[] }) {
	const [films, setFilms] = useState<Film[]>(initialFilms);
	const [state, action, pending] = useActionState(saveFilmsForm, initialState);

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

	function updateGalleryItem(index: number, itemIndex: number, patch: Partial<FilmMedia>) {
		setFilms((prev) =>
			prev.map((film, i) => {
				if (i !== index) return film;
				const gallery = film.gallery.map((item, j) => {
					if (j !== itemIndex) return item;
					const next = { ...item, ...patch };
					if (patch.src !== undefined) next.kind = mediaKindOf(patch.src, patch.kind ?? item.kind);
					return next;
				});
				return { ...film, gallery };
			}),
		);
	}

	function addGalleryItem(index: number) {
		setFilms((prev) => prev.map((film, i) => (i === index ? { ...film, gallery: [...film.gallery, blankMedia()] } : film)));
	}

	function removeGalleryItem(index: number, itemIndex: number) {
		setFilms((prev) =>
			prev.map((film, i) => {
				if (i !== index) return film;
				if (film.gallery.length <= 3) return film;
				return { ...film, gallery: film.gallery.filter((_, j) => j !== itemIndex) };
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

					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						<Field label="Slug" value={film.slug} onChange={(value) => update(index, { slug: value })} />
						<Field label="Index" value={film.index} onChange={(value) => update(index, { index: value })} />
						<Field label="Title" value={film.title} onChange={(value) => update(index, { title: value })} />
						<Field label="Badge" value={film.badge} onChange={(value) => update(index, { badge: value })} />
						<SelectField label="Badge tone" value={film.badgeTone} onChange={(value) => update(index, { badgeTone: value as Film["badgeTone"] })} options={badgeToneOptions} />
						<Field label="Stock line" value={film.stock} onChange={(value) => update(index, { stock: value })} />
						<Field label="Credit line" value={film.credit} onChange={(value) => update(index, { credit: value })} />
						<Field label="Focal line" value={film.focal} onChange={(value) => update(index, { focal: value })} />
						<Field
							label="Open-section button label"
							value={film.expandLabel ?? ""}
							onChange={(value) => update(index, { expandLabel: value })}
							placeholder="Open the edit cut"
							className="md:col-span-2"
						/>
						<Field label="Study link (optional)" value={film.studyHref ?? ""} onChange={(value) => update(index, { studyHref: value })} placeholder="/cinema/quiet-moments" />
						<Field label="YouTube link (optional)" value={film.youtubeHref ?? ""} onChange={(value) => update(index, { youtubeHref: value })} placeholder="https://youtube.com/..." />
						<Field label="Instagram link (optional)" value={film.instagramHref ?? ""} onChange={(value) => update(index, { instagramHref: value })} placeholder="https://instagram.com/..." />
					</div>
					<p className="font-sans text-[12px] text-on-surface-variant">
						Give each card its own button label. On Cinema it opens this section on its own page view (e.g. /cinema#portraits) with notes, specs, every frame, and YouTube / Instagram. Empty social links fall back to Site Basics.
					</p>

					<MediaPicker label="Cover image" value={film.cover} onChange={(value) => update(index, { cover: value })} media={media} />

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Expanded gallery</span>
								<p className="font-sans text-[12px] text-on-surface-variant">At least three photos or short reels. Visitors can open them from the Cinema card.</p>
							</div>
							<button
								type="button"
								onClick={() => addGalleryItem(index)}
								className="flex shrink-0 items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 font-sans text-[11px] font-bold text-on-surface-variant transition-colors hover:text-primary"
							>
								<Icon name="add" className="text-[14px]" />
								Add media
							</button>
						</div>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
							{film.gallery.map((item, itemIndex) => (
								<div key={itemIndex} className="flex flex-col gap-2 rounded-lg bg-surface-container p-3">
									<div className="flex items-center justify-between gap-2">
										<span className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
											{mediaKindOf(item.src, item.kind) === "video" ? "Reel" : "Still"} {itemIndex + 1}
										</span>
										{film.gallery.length > 3 ? (
											<button
												type="button"
												onClick={() => removeGalleryItem(index, itemIndex)}
												className="rounded p-1 text-on-surface-variant transition-colors hover:text-red-500"
												aria-label={`Remove gallery item ${itemIndex + 1}`}
											>
												<Icon name="delete" className="text-[14px]" />
											</button>
										) : null}
									</div>
									<MediaPicker
										label="File"
										value={item.src}
										onChange={(value) => updateGalleryItem(index, itemIndex, { src: value })}
										media={media}
									/>
									<Field label="Alt / caption" value={item.alt} onChange={(value) => updateGalleryItem(index, itemIndex, { alt: value })} />
								</div>
							))}
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
