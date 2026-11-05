import type { Metadata } from "next";
import Image from "next/image";
import { InquiryForms } from "@/components/about/inquiry-forms";
import { CopyButton } from "@/components/ui/copy-button";
import { FactDeck } from "@/components/ui/fact-deck";
import { Icon } from "@/components/ui/icon";
import { getFacts } from "@/lib/facts";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { getAboutContent } from "@/lib/about";
import { getCredentials } from "@/lib/content";
import { cn } from "@/lib/cn";
import { docs } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
	title: "About",
	description: "Amar Kharvi — full-stack developer in Bengaluru, and the person behind the reels, product shoots, and portraits.",
};

const portfolios = [
	{ icon: "movie", title: "Reel, product & portrait notes", doc: docs.reelDeck },
	{ icon: "description", title: "Full-stack notes", doc: docs.cv },
];

export default async function AboutPage() {
	const [credentials, settings, about, facts] = await Promise.all([getCredentials(), getSiteSettings(), getAboutContent(), getFacts()]);
	const pedigree = [
		{ key: "cinema", icon: "movie_filter", title: "Picture work", track: "REELS & STILLS", items: credentials.cinema, tone: "text-secondary", chip: "bg-secondary-fixed text-on-secondary-fixed" },
		{ key: "engineering", icon: "terminal", title: "Full stack", track: "PRODUCT TRACK", items: credentials.engineering, tone: "text-primary", chip: "bg-primary-fixed text-on-primary-fixed" },
	] as const;
	const socialTiles = [
		{ icon: "terminal", social: settings.socials.github },
		{ icon: "hub", social: settings.socials.linkedin },
		{ icon: "tag", social: settings.socials.twitter },
	];
	return (
		<div className="flex flex-col gap-10 px-4 py-4 md:px-8">
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
				<div className="flex flex-col gap-3">
					<div className="flex flex-wrap items-center gap-2">
						<span className="rounded-full bg-tertiary-fixed px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-on-tertiary-fixed">{about.heroBadge}</span>
						<span className="flex -rotate-2 items-center gap-1 rounded-md bg-secondary-fixed px-2.5 py-1 font-sans text-label-pill font-bold text-on-secondary-fixed shadow-sm">
							<Icon name="verified" className="text-[14px]" filled />
							{about.heroChip}
						</span>
					</div>
					<TiltCard strength={5} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-card">
						<Image src={about.heroImage} alt={about.heroImageAlt} fill preload sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
						<span className="absolute left-4 top-4 rounded bg-black/60 px-2 py-1 font-mono text-[10px] tracking-widest text-white backdrop-blur">{about.heroOverlayTag}</span>
						<div className="absolute bottom-4 left-4 flex items-baseline gap-3 text-white">
							<p className="font-serif text-headline-lg font-semibold italic md:text-display-hero-mobile">{about.heroCaptionTitle}</p>
							<span className="font-mono text-[13px] text-cyan-300">{about.heroCaptionNote}</span>
						</div>
					</TiltCard>
				</div>

				<Reveal className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-5 dark:border dark:border-primary/15">
					<span className="font-mono text-label-mono uppercase tracking-widest text-tertiary">{about.eyebrow}</span>
					<h1 className="font-headline text-headline-md font-semibold text-on-surface">{about.headline}</h1>
					<p className="font-serif text-body-editorial text-on-surface-variant">{about.bio}</p>
				</Reveal>
			</section>

			<FactDeck label="How I keep learning" facts={facts.about} />

			<section className="flex flex-col gap-4">
				<SectionHeading title="Two practices" aside={<span className="font-mono text-label-mono text-outline">BENGALURU</span>} />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{pedigree.map((track, index) => (
						<Reveal
							key={track.key}
							as="section"
							delay={index * 0.08}
							className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-card dark:border dark:border-primary/15 dark:bg-surface-container-low"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name={track.icon} className={cn("text-[22px]", track.tone)} />
									<h3 className="font-headline text-headline-sm font-semibold text-on-surface">{track.title}</h3>
								</div>
								<span className={cn("rounded px-2 py-0.5 font-mono text-[10px] font-bold", track.chip)}>{track.track}</span>
							</div>
							<ul className="flex flex-col gap-3">
								{track.items.map((item) => (
									<li key={item.title} className="flex gap-3">
										<Icon name={item.icon} className={cn("mt-0.5 text-[18px]", track.tone)} />
										<div className="flex flex-col">
											<span className="font-sans text-body-dense font-bold text-on-surface">{item.title}</span>
											<span className="font-sans text-[13px] text-on-surface-variant">{item.body}</span>
										</div>
									</li>
								))}
							</ul>
						</Reveal>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-4">
				<SectionHeading title="Notes you can download" />
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					{portfolios.map(({ icon, title, doc }) => (
						<a
							key={doc.href}
							href={doc.href}
							download={doc.file}
							className="group flex items-center gap-4 rounded-2xl bg-surface-container p-4 transition-all hover:bg-surface-container-high active:scale-[0.99] dark:border dark:border-primary/10"
						>
							<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
								<Icon name={icon} className="text-[22px]" />
							</span>
							<span className="flex flex-1 flex-col">
								<span className="font-sans text-body-dense font-bold text-on-surface">{title}</span>
								<span className="font-mono text-[11px] text-on-surface-variant">{doc.size}</span>
							</span>
							<Icon name="download" className="text-[20px] text-primary transition-transform group-hover:translate-y-0.5" />
						</a>
					))}
				</div>
			</section>

			<section id="commission" className="relative grid scroll-mt-20 gap-6 lg:grid-cols-[1.2fr_1fr]">
				<span id="commission-cinema" className="absolute -top-20" aria-hidden="true" />
				<span id="commission-advisory" className="absolute -top-20" aria-hidden="true" />
				<div className="flex flex-col gap-4">
					<div>
						<span className="font-mono text-label-mono uppercase tracking-widest text-tertiary">Inquiries</span>
						<h2 className="font-headline text-headline-md font-semibold text-on-surface">Work with Amar</h2>
						<p className="font-sans text-body-default text-on-surface-variant">
							A reel, a product shoot, a portrait session, or a full-stack build. Send the form and Amar replies from Bengaluru.
						</p>
					</div>
					<InquiryForms />
				</div>

				<div className="flex flex-col gap-4">
					<h3 className="font-headline text-headline-sm font-semibold text-on-surface">Find Amar</h3>

					<div className="grid grid-cols-2 gap-2">
						<a
							href={settings.socials.youtube.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex flex-col items-start gap-2 rounded-2xl bg-red-600 p-4 text-white shadow-card transition-all hover:brightness-110 active:scale-[0.98]"
						>
							<Icon name="play_circle" className="text-[26px]" filled />
							<span>
								<span className="block font-sans text-body-dense font-bold">YouTube</span>
								<span className="block font-mono text-[11px] text-white/80">{settings.socials.youtube.handle}</span>
							</span>
						</a>
						<a
							href={settings.socials.instagram.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex flex-col items-start gap-2 rounded-2xl bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 p-4 text-white shadow-card transition-all hover:brightness-110 active:scale-[0.98]"
						>
							<Icon name="photo_camera" className="text-[26px]" filled />
							<span>
								<span className="block font-sans text-body-dense font-bold">Instagram</span>
								<span className="block font-mono text-[11px] text-white/80">{settings.socials.instagram.handle}</span>
							</span>
						</a>
					</div>

					<div className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-5 dark:border dark:border-primary/15">
						<span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">GitHub</span>
						<div className="flex items-center justify-between gap-2">
							<a href={settings.socials.github.href} target="_blank" rel="noopener noreferrer" className="truncate font-mono text-[15px] font-semibold text-primary hover:underline">
								{settings.socials.github.handle}
							</a>
							<CopyButton
								text={settings.socials.github.href}
								label={null}
								ariaLabel="Copy GitHub link"
								className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
								activeClassName="text-tertiary"
								iconClassName="text-[18px]"
							/>
						</div>
						<span className="pt-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">LinkedIn</span>
						<div className="flex items-start justify-between gap-2">
							<a href={settings.socials.linkedin.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] leading-relaxed text-on-surface hover:text-primary">
								{settings.socials.linkedin.handle}
							</a>
							<CopyButton
								text={settings.socials.linkedin.href}
								label={null}
								ariaLabel="Copy LinkedIn link"
								className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
								activeClassName="text-tertiary"
								iconClassName="text-[18px]"
							/>
						</div>
					</div>

					<div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-card dark:border dark:border-primary/15 dark:bg-surface-container-low">
						<div className="relative aspect-[16/9] w-full">
							<Image src={about.homeBaseImage} alt={about.homeBaseImageAlt} fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
							<span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-black/65 px-2 py-1 font-mono text-[10px] text-white backdrop-blur">
								<Icon name="pin_drop" className="text-[13px] text-cyan-300" />
								{about.homeBaseMapTag}
							</span>
						</div>
						<div className="flex flex-col gap-1 p-4">
							<div className="flex items-center justify-between">
								<span className="font-sans text-body-dense font-bold text-on-surface">{about.homeBaseTitle}</span>
								<span className="font-mono text-[10px] text-tertiary">INDIA</span>
							</div>
							<p className="font-sans text-[13px] text-on-surface-variant">{about.homeBaseBody}</p>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-2">
						{socialTiles.map(({ icon, social }) => (
							<a
								key={social.label}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col items-center gap-1 rounded-xl bg-surface-container p-3 text-on-surface-variant transition-all hover:bg-primary hover:text-on-primary active:scale-95 dark:border dark:border-primary/10"
							>
								<Icon name={icon} className="text-[20px]" />
								<span className="font-sans text-[11px] font-bold">{social.label}</span>
							</a>
						))}
					</div>
				</div>
			</section>

			<footer className="flex flex-col items-center border-t border-outline-variant py-6 text-center">
				<span className="font-sans text-[11px] text-on-surface-variant">© 2026 Amar Kharvi. Code and pictures.</span>
			</footer>
		</div>
	);
}
