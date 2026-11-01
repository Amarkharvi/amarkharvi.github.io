import type { Metadata } from "next";
import Link from "next/link";
import { FilmCard } from "@/components/cinema/film-card";
import { ReelPlayer } from "@/components/cinema/reel-player";
import { Icon } from "@/components/ui/icon";
import { getFilms } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";
import { docs } from "@/lib/site";

export const metadata: Metadata = {
	title: "Cinema",
	description: "YouTube films and Instagram reels, product shoots, and portraits by Amar Kharvi.",
};

export default async function CinemaPage() {
	const [films, settings] = await Promise.all([getFilms(), getSiteSettings()]);
	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between gap-2 bg-surface-container-low px-5 py-2 md:mt-4 md:rounded-full md:px-6 dark:border-b dark:border-primary/10 md:dark:border">
				<div className="flex min-w-0 items-center gap-1.5">
					<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-secondary dark:bg-primary" />
					<span className="truncate font-mono text-label-mono text-secondary dark:text-primary-fixed-dim">REC [YOUTUBE / INSTAGRAM]</span>
				</div>
				<div className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container-high px-2 py-0.5">
					<Icon name="graphic_eq" className="text-[14px] text-on-surface-variant" />
					<span className="font-mono text-label-mono text-on-surface-variant">Bengaluru</span>
				</div>
			</div>

			<section className="flex flex-col gap-2 px-5 pt-4 md:px-8">
				<ReelPlayer video={settings.reel.video || undefined} poster={settings.reel.poster} />
				<div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container px-3.5 py-2.5 shadow-sm dark:border dark:border-primary/10">
					<div className="flex min-w-0 items-center gap-2">
						<Icon name="videocam" className="text-[20px] text-secondary dark:text-primary" />
						<p className="truncate font-mono text-label-mono text-on-surface">
							YouTube films &amp; Instagram reels{" "}
							<span className="font-normal text-on-surface-variant">{"// stills and short motion"}</span>
						</p>
					</div>
					<span className="shrink-0 font-mono text-[11px] font-bold text-secondary dark:text-tertiary">A-CAM</span>
				</div>
			</section>

			<div className="flex items-end justify-between px-5 pb-1 pt-6 md:px-8">
				<div>
					<span className="font-mono text-label-mono uppercase text-secondary dark:text-primary-fixed-dim">Selected Picture Work</span>
					<h2 className="font-serif text-headline-lg font-medium text-on-surface">YouTube, Reels &amp; Stills</h2>
				</div>
				<span className="font-mono text-label-mono text-on-surface-variant">{films.length} Case Studies</span>
			</div>

			<div className="grid gap-4 px-5 pb-6 pt-3 md:px-8 lg:grid-cols-2">
				{films.map((film) => (
					<FilmCard key={film.slug} film={film} />
				))}
			</div>

			<section className="px-5 pb-4 md:px-8">
				<Link
					href="/shop"
					className="group flex items-center justify-between gap-4 rounded-xl bg-primary-container p-5 text-on-primary-container shadow-lg transition-all hover:brightness-110 active:scale-[0.99] dark:shadow-glow"
				>
					<div className="flex items-center gap-3">
						<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
							<Icon name="palette" className="text-[22px]" />
						</span>
						<div>
							<span className="font-mono text-label-mono uppercase text-tertiary-fixed">LUT Shop</span>
							<p className="font-headline text-headline-sm font-semibold text-white">Grade your footage like these reels</p>
						</div>
					</div>
					<Icon name="arrow_forward" className="text-[22px] text-white transition-transform group-hover:translate-x-1" />
				</Link>
			</section>

			<section className="px-5 pb-12 md:px-8">
				<div className="flex flex-col gap-2 rounded-xl bg-surface-container-high p-6 shadow-md dark:border dark:border-primary/20 dark:bg-surface-container">
					<div className="flex items-center gap-2">
						<Icon name="calendar_today" className="text-[24px] text-secondary dark:text-primary" />
						<span className="font-mono text-label-mono uppercase text-secondary dark:text-primary-fixed-dim">Availability Calendar</span>
					</div>
					<h3 className="font-headline text-headline-md font-bold text-on-surface">Book a shoot, an edit, or both</h3>
					<p className="max-w-2xl font-sans text-body-default text-on-surface-variant">
						Based in Bengaluru, available on location and remote. Reels and motion are cut in DaVinci Resolve and Premiere Pro. Stills are
						finished in Lightroom.
					</p>
					<div className="flex flex-col gap-2 pt-2 sm:flex-row">
						<Link
							href="/about#commission-cinema"
							className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-sans text-label-pill font-bold text-on-primary shadow-md transition-transform active:translate-y-0.5 dark:shadow-glow"
						>
							Request a Shoot
							<Icon name="arrow_forward" className="text-[18px]" />
						</Link>
						<a
							href={docs.treatment.href}
							download={docs.treatment.file}
							className="flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-lowest px-4 py-3 font-sans text-label-pill font-bold text-on-surface shadow-sm transition-colors hover:bg-surface-container"
						>
							<Icon name="download" className="text-[18px]" />
							Download Shoot Notes (PDF)
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
