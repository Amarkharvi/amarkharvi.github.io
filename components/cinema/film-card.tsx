"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/cn";
import { mediaKindOf, type Film, type FilmMedia } from "@/lib/content-data";

const badgeTones: Record<Film["badgeTone"], string> = {
	secondary: "bg-secondary-fixed text-on-secondary-fixed",
	primary: "bg-primary-fixed text-on-primary-fixed",
	warm: "bg-secondary-fixed-dim text-on-secondary-fixed dark:bg-secondary-fixed dark:text-on-secondary-fixed",
	neutral: "bg-surface-container-highest text-on-surface",
};

/** Gallery without the padding duplicates `normalizeFilm` adds, cover first. */
export function filmFrames(film: Film): FilmMedia[] {
	const seen = new Set<string>();
	const frames: FilmMedia[] = [];
	for (const item of [{ src: film.cover, alt: `${film.title} cover frame`, kind: "image" as const }, ...film.gallery]) {
		if (!item.src || seen.has(item.src)) continue;
		seen.add(item.src);
		frames.push(item);
	}
	return frames;
}

function frameCounts(frames: FilmMedia[]) {
	const reels = frames.filter((item) => mediaKindOf(item.src, item.kind) === "video").length;
	return { stills: frames.length - reels, reels };
}

function CountChips({ frames }: { frames: FilmMedia[] }) {
	const { stills, reels } = frameCounts(frames);
	return (
		<div className="flex flex-wrap items-center gap-1.5">
			{stills > 0 ? (
				<span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant">
					<Icon name="photo" className="text-[12px]" />
					{stills} still{stills === 1 ? "" : "s"}
				</span>
			) : null}
			{reels > 0 ? (
				<span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant">
					<Icon name="movie" className="text-[12px]" />
					{reels} reel{reels === 1 ? "" : "s"}
				</span>
			) : null}
		</div>
	);
}

function FrameTile({ item, onOpen, sizes, className }: { item: FilmMedia; onOpen: () => void; sizes: string; className?: string }) {
	const kind = mediaKindOf(item.src, item.kind);
	return (
		<button
			type="button"
			onClick={onOpen}
			aria-label={`Open ${item.alt || (kind === "video" ? "reel" : "still")}`}
			className={cn("group/frame relative overflow-hidden rounded-xl bg-surface-container-high text-left shadow-sm", className)}
		>
			{kind === "video" ? (
				<>
					<video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
					<span className="absolute left-2 top-2 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">REEL</span>
				</>
			) : (
				<Image src={item.src} alt={item.alt || "Still"} fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover/frame:scale-105" />
			)}
			<span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover/frame:opacity-100">
				<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow">
					<Icon name={kind === "video" ? "play_arrow" : "zoom_in"} className="text-[22px]" filled />
				</span>
			</span>
		</button>
	);
}

function GalleryViewer({ items, index, onClose, onChange }: { items: FilmMedia[]; index: number; onClose: () => void; onChange: (next: number) => void }) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const item = items[index];
	const kind = item ? mediaKindOf(item.src, item.kind) : "image";

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (!dialog.open) dialog.showModal();
		const onCancel = (event: Event) => {
			event.preventDefault();
			onClose();
		};
		dialog.addEventListener("cancel", onCancel);
		return () => dialog.removeEventListener("cancel", onCancel);
	}, [onClose]);

	if (!item) return null;

	return (
		<dialog
			ref={dialogRef}
			className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-dvw max-w-none items-center justify-center border-0 bg-black/85 p-4 backdrop:bg-black/70"
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
			onKeyDown={(event) => {
				if (event.key === "ArrowLeft" && index > 0) onChange(index - 1);
				if (event.key === "ArrowRight" && index < items.length - 1) onChange(index + 1);
			}}
		>
			<div className="relative flex w-full max-w-5xl flex-col gap-3">
				<div className="flex items-center justify-between gap-2 text-white">
					<p className="truncate font-mono text-[11px] uppercase tracking-wider text-white/75">
						{index + 1} / {items.length}
						{item.alt ? ` · ${item.alt}` : ""}
					</p>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close gallery"
						className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
					>
						<Icon name="close" className="text-[20px]" />
					</button>
				</div>
				<div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-black">
					{kind === "video" ? (
						<video key={item.src} src={item.src} controls autoPlay playsInline className="h-full w-full object-contain" />
					) : (
						<Image key={item.src} src={item.src} alt={item.alt || "Still"} fill sizes="1000px" className="object-contain" />
					)}
					<button
						type="button"
						disabled={index === 0}
						onClick={() => onChange(index - 1)}
						aria-label="Previous frame"
						className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-opacity hover:bg-black/75 disabled:opacity-0"
					>
						<Icon name="chevron_left" className="text-[26px]" />
					</button>
					<button
						type="button"
						disabled={index >= items.length - 1}
						onClick={() => onChange(index + 1)}
						aria-label="Next frame"
						className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-opacity hover:bg-black/75 disabled:opacity-0"
					>
						<Icon name="chevron_right" className="text-[26px]" />
					</button>
				</div>
				<div data-lenis-prevent className="no-scrollbar flex gap-2 overflow-x-auto">
					{items.map((frame, frameIndex) => (
						<button
							key={`${frame.src}-${frameIndex}`}
							type="button"
							onClick={() => onChange(frameIndex)}
							aria-label={`Show frame ${frameIndex + 1}`}
							className={cn(
								"relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-opacity",
								frameIndex === index ? "opacity-100 ring-white" : "opacity-55 ring-transparent hover:opacity-90",
							)}
						>
							{mediaKindOf(frame.src, frame.kind) === "video" ? (
								<video src={frame.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
							) : (
								<Image src={frame.src} alt="" fill sizes="80px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			</div>
		</dialog>
	);
}

/** Compact card for the "All work" grid. Opening it switches the page to that section. */
export function FilmCard({ film, onOpen }: { film: Film; onOpen: () => void }) {
	const [viewerIndex, setViewerIndex] = useState<number | null>(null);
	const frames = filmFrames(film);
	const stripOffset = frames.length > 1 ? 1 : 0;
	const strip = frames.slice(stripOffset, stripOffset + 3);
	const stripCols = ["grid-cols-1", "grid-cols-2", "grid-cols-3"][strip.length - 1] ?? "grid-cols-3";

	return (
		<TiltCard
			as="article"
			strength={4}
			className="flex flex-col overflow-hidden rounded-2xl bg-surface-container-low shadow-card ring-1 ring-outline-variant/40 dark:ring-primary/15"
		>
			<button type="button" onClick={onOpen} className="group relative block aspect-16/10 overflow-hidden text-left">
				<Image
					src={film.cover}
					alt={`${film.title} — cover frame`}
					fill
					sizes="(min-width: 1024px) 560px, 100vw"
					className="object-cover transition-transform duration-700 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-black/10" />
				<div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
					<span className={cn("rounded-full px-2.5 py-0.5 font-sans text-[11px] font-bold", badgeTones[film.badgeTone])}>{film.badge}</span>
					<span className="rounded-full bg-black/45 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-md">{film.index}</span>
				</div>
				<div className="absolute inset-x-4 bottom-4 flex flex-col gap-0.5 text-white">
					<span className="font-mono text-[11px] uppercase tracking-wider text-white/70">{film.stock}</span>
					<h3 className="font-serif text-[30px] leading-tight md:text-[34px]">{film.title}</h3>
					<p className="font-sans text-body-dense text-white/80">{film.credit}</p>
				</div>
			</button>

			<div className="flex flex-1 flex-col gap-3 p-4">
				<div className={cn("grid gap-2", stripCols)}>
					{strip.map((item, index) => (
						<FrameTile
							key={`${item.src}-${index}`}
							item={item}
							sizes="(min-width: 1024px) 270px, 50vw"
							className={strip.length < 3 ? "aspect-video" : "aspect-4/3"}
							onOpen={() => setViewerIndex(index + stripOffset)}
						/>
					))}
				</div>
				<div className="mt-auto flex items-center justify-between gap-3">
					<CountChips frames={frames} />
					<button
						type="button"
						onClick={onOpen}
						className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 font-sans text-label-pill font-bold text-on-secondary transition-all hover:brightness-110 active:scale-95 dark:bg-primary dark:text-on-primary"
					>
						{film.expandLabel || `Explore ${film.title}`}
						<Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-0.5" />
					</button>
				</div>
			</div>

			{viewerIndex !== null ? <GalleryViewer items={frames} index={viewerIndex} onClose={() => setViewerIndex(null)} onChange={setViewerIndex} /> : null}
		</TiltCard>
	);
}

/** Full view of one section: hero cover, notes and links, then every frame. */
export function FilmSection({
	film,
	total,
	prev,
	next,
	onSelect,
	youtubeHref,
	instagramHref,
}: {
	film: Film;
	total: number;
	prev: Film | null;
	next: Film | null;
	onSelect: (slug: string | null) => void;
	youtubeHref?: string;
	instagramHref?: string;
}) {
	const [viewerIndex, setViewerIndex] = useState<number | null>(null);
	const frames = filmFrames(film);
	const gridOffset = frames.length > 1 ? 1 : 0;
	const gridFrames = frames.slice(gridOffset);
	const youtube = film.youtubeHref?.trim() || youtubeHref || "";
	const instagram = film.instagramHref?.trim() || instagramHref || "";

	return (
		<article aria-labelledby={`${film.slug}-title`} className="flex flex-col gap-5">
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
				<button
					type="button"
					onClick={() => setViewerIndex(0)}
					className="group relative aspect-video overflow-hidden rounded-2xl bg-inverse-surface text-left shadow-card"
				>
					<Image
						src={film.cover}
						alt={`${film.title} — cover frame`}
						fill
						preload
						sizes="(min-width: 1024px) 680px, 100vw"
						className="object-cover transition-transform duration-700 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
					<span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md">{film.focal}</span>
					<span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 font-sans text-label-pill font-bold text-black">
						<Icon name="zoom_in" className="text-[16px]" />
						View frames
					</span>
				</button>

				<div className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-5 shadow-card ring-1 ring-outline-variant/40 md:p-6 dark:ring-primary/15">
					<div className="flex items-center justify-between gap-2">
						<div className="flex flex-wrap items-center gap-1.5">
							<span className={cn("rounded-full px-2.5 py-0.5 font-sans text-[11px] font-bold", badgeTones[film.badgeTone])}>{film.badge}</span>
							<span className="font-mono text-[11px] text-secondary dark:text-primary-fixed-dim">{film.stock}</span>
						</div>
						<span className="font-mono text-[11px] text-on-surface-variant">
							{film.index} / {String(total).padStart(2, "0")}
						</span>
					</div>
					<div>
						<h3 id={`${film.slug}-title`} className="font-serif text-headline-lg leading-tight text-on-surface md:text-[44px]">
							{film.title}
						</h3>
						<p className="font-sans text-body-default font-medium text-on-surface-variant">{film.credit}</p>
					</div>
					<p className="border-l-2 border-secondary/60 pl-3 font-serif text-body-editorial italic text-on-surface-variant dark:border-primary/60">{film.note}</p>
					<dl className="grid grid-cols-2 gap-2">
						{film.specs.map((spec) => (
							<div key={spec.label} className="rounded-xl bg-surface-container p-3">
								<dt className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{spec.label}</dt>
								<dd className="font-mono text-label-mono font-bold text-on-surface">{spec.value}</dd>
							</div>
						))}
					</dl>
					<div className="mt-auto flex flex-wrap items-center gap-2">
						{film.studyHref ? (
							<Link
								href={film.studyHref}
								className="inline-flex items-center gap-1 rounded-full bg-secondary px-3.5 py-2 font-sans text-label-pill font-bold text-on-secondary transition-all hover:brightness-110 active:scale-95 dark:bg-primary dark:text-on-primary"
							>
								Open the reel study
								<Icon name="arrow_forward" className="text-[16px]" />
							</Link>
						) : null}
						{youtube ? (
							<a
								href={youtube}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3.5 py-2 font-sans text-label-pill font-bold text-white transition-all hover:brightness-110 active:scale-95"
							>
								<Icon name="play_circle" className="text-[16px]" filled />
								YouTube
							</a>
						) : null}
						{instagram ? (
							<a
								href={instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1 rounded-full bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 px-3.5 py-2 font-sans text-label-pill font-bold text-white transition-all hover:brightness-110 active:scale-95"
							>
								<Icon name="photo_camera" className="text-[16px]" filled />
								Instagram
							</a>
						) : null}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2">
				<h4 className="font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Frames</h4>
				<CountChips frames={frames} />
			</div>
			<div className={cn("grid grid-cols-2 gap-3", gridFrames.length % 3 === 0 || gridFrames.length > 4 ? "md:grid-cols-3" : "md:grid-cols-2")}>
				{gridFrames.map((item, index) => (
					<FrameTile
						key={`${item.src}-${index}`}
						item={item}
						sizes="(min-width: 768px) 480px, 50vw"
						className="aspect-4/3"
						onOpen={() => setViewerIndex(index + gridOffset)}
					/>
				))}
			</div>

			<nav aria-label="More sections" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{prev ? (
					<button
						type="button"
						onClick={() => onSelect(prev.slug)}
						className="group flex items-center gap-3 rounded-2xl bg-surface-container-low p-3 text-left shadow-card ring-1 ring-outline-variant/40 transition-colors hover:bg-surface-container dark:ring-primary/15"
					>
						<Icon name="arrow_back" className="text-[20px] text-on-surface-variant transition-transform group-hover:-translate-x-0.5" />
						<span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
							<Image src={prev.cover} alt="" fill sizes="64px" className="object-cover" />
						</span>
						<span className="min-w-0">
							<span className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Previous · {prev.index}</span>
							<span className="block truncate font-serif text-headline-sm text-on-surface">{prev.title}</span>
						</span>
					</button>
				) : (
					<span className="hidden sm:block" />
				)}
				{next ? (
					<button
						type="button"
						onClick={() => onSelect(next.slug)}
						className="group flex items-center justify-end gap-3 rounded-2xl bg-surface-container-low p-3 text-right shadow-card ring-1 ring-outline-variant/40 transition-colors hover:bg-surface-container dark:ring-primary/15"
					>
						<span className="min-w-0">
							<span className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Next · {next.index}</span>
							<span className="block truncate font-serif text-headline-sm text-on-surface">{next.title}</span>
						</span>
						<span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
							<Image src={next.cover} alt="" fill sizes="64px" className="object-cover" />
						</span>
						<Icon name="arrow_forward" className="text-[20px] text-on-surface-variant transition-transform group-hover:translate-x-0.5" />
					</button>
				) : null}
			</nav>

			{viewerIndex !== null ? <GalleryViewer items={frames} index={viewerIndex} onClose={() => setViewerIndex(null)} onChange={setViewerIndex} /> : null}
		</article>
	);
}
