import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { CinemaColumn } from "@/components/work/cinema-column";
import { ContactCard } from "@/components/work/contact-card";
import { DevColumn } from "@/components/work/dev-column";
import { MeetBand } from "@/components/work/meet-band";
import { CinemaHero, DevHero } from "@/components/work/persona-heroes";
import { PersonaSplit } from "@/components/work/persona-split";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
	title: "Dual Persona",
	description: "Two sides of Amar Kharvi: cinematography on YouTube and Instagram, and full-stack development from ColdFusion to PostgreSQL and Next.js.",
};

export default async function WorkPage() {
	const settings = await getSiteSettings();
	return (
		<div className="flex flex-col gap-12 px-5 pb-8 pt-4 md:px-8">
			<Reveal as="section" y={14} className="flex flex-col gap-6">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5 shadow-sm dark:border dark:border-primary/20">
						<span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed-dim dark:shadow-[0_0_6px_#4fd1ff]" />
						<span className="font-mono text-label-mono text-on-surface-variant dark:text-primary-fixed-dim">{settings.availability}</span>
					</div>
					<div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-on-surface-variant dark:border dark:border-outline-variant">
						<Icon name="location_on" className="text-[16px] text-secondary dark:text-primary" />
						<span className="font-mono text-label-mono">{settings.location}</span>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-secondary dark:text-primary">Dual persona</span>
						<span className="h-px flex-1 bg-outline-variant/60" />
						<span className="font-mono text-[11px] text-outline">CINEMA × CODE</span>
					</div>
					<h1 className="max-w-4xl font-serif text-display-hero-mobile tracking-tight text-on-surface md:text-display-hero">
						{settings.introHeading} <br />
						<span className="bg-linear-to-r from-secondary via-secondary-container to-primary-container bg-clip-text font-headline font-bold not-italic text-transparent dark:from-primary dark:via-tertiary-fixed dark:to-primary-fixed-dim">
							{settings.introSubheading}
						</span>
					</h1>
					<p className="max-w-2xl font-serif text-body-editorial text-on-surface-variant">
						{settings.introParagraph}
					</p>
				</div>
			</Reveal>

			<PersonaSplit cinemaHero={<CinemaHero />} devHero={<DevHero />} cinemaColumn={<CinemaColumn />} devColumn={<DevColumn />} />

			<Reveal as="section" className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<MeetBand />
				</div>
				<ContactCard />
			</Reveal>
		</div>
	);
}
