import type { Metadata } from "next";
import Link from "next/link";
import { CinemaBrowser } from "@/components/cinema/cinema-browser";
import { ReelPlayer } from "@/components/cinema/reel-player";
import { FactDeck } from "@/components/ui/fact-deck";
import { Icon } from "@/components/ui/icon";
import { getFacts } from "@/lib/facts";
import { getFilms } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";
import { docs } from "@/lib/site";

export const metadata: Metadata = {
	title: "Cinema",
	description: "YouTube films and Instagram reels, product shoots, and portraits by Amar Kharvi.",
};

export default async function CinemaPage() {
	const [films, settings, facts] = await Promise.all([getFilms(), getSiteSettings(), getFacts()]);
	const persona = settings.persona1;
	return (
		<div className="flex flex-col gap-8 px-5 pb-12 pt-6 md:px-8">
			<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="flex max-w-2xl flex-col gap-2">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
						<span className="font-mono text-label-mono uppercase tracking-widest text-secondary dark:text-primary-fixed-dim">{persona.role}</span>
					</div>
					<h1 className="font-serif text-display-hero-mobile italic tracking-tight text-on-surface md:text-[56px] md:leading-[1.05]">{persona.headline}</h1>
					<p className="font-sans text-body-default text-on-surface-variant">{persona.body}</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<a
						href={settings.socials.youtube.href}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 font-sans text-label-pill font-bold text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
					>
						<Icon name="play_circle" className="text-[18px]" filled />
						YouTube
					</a>
					<a
						href={settings.socials.instagram.href}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 px-4 py-2 font-sans text-label-pill font-bold text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
					>
						<Icon name="photo_camera" className="text-[18px]" filled />
						Instagram
					</a>
					<span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-2 font-mono text-label-mono text-on-surface-variant">
						<Icon name="location_on" className="text-[16px] text-secondary dark:text-primary" />
						{settings.location}
					</span>
				</div>
			</header>

			<ReelPlayer video={settings.reel.video || undefined} poster={settings.reel.poster} />

			<FactDeck label="From the edit bay" facts={facts.cinema} />

			<div className="flex flex-col gap-1">
				<span className="font-mono text-label-mono uppercase tracking-widest text-secondary dark:text-primary-fixed-dim">Picture work</span>
				<h2 className="font-serif text-headline-lg text-on-surface">Pick a section, or browse them all</h2>
			</div>

			<CinemaBrowser films={films} youtubeHref={settings.socials.youtube.href} instagramHref={settings.socials.instagram.href} />

			<section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
				<Link
					href="/shop"
					className="group flex flex-col justify-between gap-6 rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-lg transition-all hover:brightness-110 active:scale-[0.99] dark:shadow-glow"
				>
					<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
						<Icon name="palette" className="text-[22px]" />
					</span>
					<div className="flex items-end justify-between gap-3">
						<div>
							<span className="font-mono text-label-mono uppercase text-tertiary-fixed">LUT Shop</span>
							<p className="font-headline text-headline-sm font-semibold text-white">Grade your footage like these reels</p>
						</div>
						<Icon name="arrow_forward" className="text-[22px] text-white transition-transform group-hover:translate-x-1" />
					</div>
				</Link>

				<div className="flex flex-col gap-2 rounded-2xl bg-surface-container-high p-6 shadow-md dark:border dark:border-primary/20 dark:bg-surface-container">
					<div className="flex items-center gap-2">
						<Icon name="calendar_today" className="text-[22px] text-secondary dark:text-primary" />
						<span className="font-mono text-label-mono uppercase text-secondary dark:text-primary-fixed-dim">Bookings</span>
					</div>
					<h3 className="font-headline text-headline-md font-bold text-on-surface">Book a shoot, an edit, or both</h3>
					<p className="font-sans text-body-default text-on-surface-variant">
						Based in {settings.location}. Reels and motion are cut in DaVinci Resolve and Premiere Pro; stills are finished in Lightroom.
					</p>
					<div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
						<Link
							href="/about#commission-cinema"
							className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-sans text-label-pill font-bold text-on-primary shadow-md transition-transform active:translate-y-0.5 dark:shadow-glow"
						>
							Request a shoot
							<Icon name="arrow_forward" className="text-[18px]" />
						</Link>
						<a
							href={docs.treatment.href}
							download={docs.treatment.file}
							className="flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-lowest px-4 py-3 font-sans text-label-pill font-bold text-on-surface shadow-sm transition-colors hover:bg-surface-container"
						>
							<Icon name="download" className="text-[18px]" />
							Shoot notes (PDF)
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
