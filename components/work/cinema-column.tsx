import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { SmartVideo } from "@/components/ui/smart-video";
import { mediaKindOf } from "@/lib/content-data";
import { getFilms } from "@/lib/content";
import { getSiteSettings, parseToolChips } from "@/lib/site-settings";
import { ColumnHeading, personaCard, personaColumn, personaFooterList } from "./column-heading";

const editBay = [
	{ tool: "Lightroom", use: "Stills: product and portraits", icon: "photo_camera" },
	{ tool: "DaVinci Resolve", use: "Cut, color, and finish", icon: "palette" },
	{ tool: "Premiere Pro", use: "Cut, sound, and captions", icon: "movie_edit" },
];

export async function CinemaColumn() {
	const [settings, films] = await Promise.all([getSiteSettings(), getFilms()]);
	const bySlug = Object.fromEntries(films.map((film) => [film.slug, film]));
	// Same sources as Cinema / Site Basics: showreel poster, then Picture Work covers, then swipe overrides.
	const persona = settings.persona1;
	const fallbackStill = settings.reel.poster || bySlug["grade-and-cut"]?.cover || "/media/cinema/threshold-cover.jpg";
	const featureSrc = persona.featureMedia.trim() || settings.reel.video;
	const featurePoster = persona.featurePoster.trim() || fallbackStill;
	const featureVideo = featureSrc && mediaKindOf(featureSrc) === "video";
	const featureImage = featureVideo ? featurePoster : featureSrc || featurePoster;
	const featureChips = parseToolChips(persona.featureChips);
	const featureHref = persona.featureHref.trim() || "/cinema";
	const feed = [
		{
			label: "Reel",
			href: bySlug["instagram-reels"]?.studyHref || "/cinema/quiet-moments",
			src: bySlug["instagram-reels"]?.cover || settings.swipe.reel,
			alt: bySlug["instagram-reels"]?.title || "Reel cover",
		},
		{
			label: "Product",
			href: "/cinema#product-shoots",
			src: bySlug["product-shoots"]?.cover || settings.swipe.product,
			alt: bySlug["product-shoots"]?.title || "Product frame",
		},
		{
			label: "Portrait",
			href: "/cinema#portraits",
			src: bySlug["portraits"]?.cover || settings.swipe.portrait,
			alt: bySlug["portraits"]?.title || "Portrait frame",
		},
	];

	return (
		<section aria-label="Cinematography" className={personaColumn}>
			<ColumnHeading
				icon="movie"
				eyebrow={persona.columnEyebrow}
				title={persona.columnTitle}
				serif
				iconClassName="bg-secondary text-on-secondary"
			/>

			<article className={`group relative ${personaCard}`}>
				<a
					href={settings.socials.youtube.href}
					target="_blank"
					rel="noopener noreferrer"
					className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:brightness-110 active:scale-95"
				>
					<Icon name="play_circle" className="text-[13px]" filled />
					YouTube • 16:9
				</a>
				<Link href={featureHref} className="flex flex-1 flex-col">
					<div className="relative aspect-video overflow-hidden bg-inverse-surface">
						{featureVideo ? (
							<SmartVideo
								src={featureSrc}
								poster={featurePoster}
								alt={persona.featureTitle || "Persona 01 card"}
								sizes="(min-width: 1024px) 640px, 100vw"
								className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						) : (
							<Image
								src={featureImage}
								alt={persona.featureTitle || "Persona 01 card"}
								fill
								sizes="(min-width: 1024px) 640px, 100vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						)}
						<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
						<span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
							<Icon name="play_arrow" filled className="text-[30px]" />
						</span>
					</div>
					<div className="flex flex-1 flex-col gap-3 p-5">
						<div>
							<h3 className="font-serif text-headline-sm text-on-surface">{persona.featureTitle || "The long watch"}</h3>
							{persona.featureBody ? <p className="mt-1 font-sans text-body-default text-on-surface-variant">{persona.featureBody}</p> : null}
						</div>
						<div className="mt-auto flex flex-wrap items-center gap-1.5">
							{featureChips.map((chapter) => (
								<span key={chapter} className="rounded-full bg-secondary-fixed px-2.5 py-1 font-mono text-[11px] text-on-secondary-fixed">
									{chapter}
								</span>
							))}
							<span className="ml-auto inline-flex items-center gap-1 font-sans text-label-pill font-bold text-secondary dark:text-primary-fixed-dim">
								{persona.featureLinkLabel || "Watch"}
								<Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-0.5" />
							</span>
						</div>
					</div>
				</Link>
			</article>

			<article className={`gap-4 p-5 ${personaCard}`}>
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="min-w-0">
						<h3 className="font-serif text-headline-sm text-on-surface">The swipe</h3>
						<p className="mt-1 font-sans text-body-default text-on-surface-variant">Reels, product stills, and portraits that read on a phone.</p>
					</div>
					<a
						href={settings.socials.instagram.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex shrink-0 items-center gap-1 rounded-full bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:brightness-110 active:scale-95"
					>
						<Icon name="photo_camera" className="text-[13px]" filled />
						Instagram • 9:16
					</a>
				</div>
				<div className="mt-auto grid grid-cols-3 gap-2">
					{feed.map((item) => (
						<Link key={item.label} href={item.href} className="group relative aspect-9/16 overflow-hidden rounded-xl bg-inverse-surface lg:group-data-[persona=both]/stage:aspect-3/4">
							<Image src={item.src} alt={item.alt} fill sizes="220px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
							<div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
							<span className="absolute inset-x-2 bottom-2 font-mono text-[11px] font-semibold text-white">{item.label}</span>
						</Link>
					))}
				</div>
			</article>

			<article className={`col-span-full p-5 ${personaCard}`}>
				<div className="flex items-center justify-between gap-2">
					<h3 className="font-serif text-headline-sm text-on-surface">The edit bay</h3>
					<span className="font-mono text-[11px] uppercase tracking-wider text-secondary dark:text-primary">Post</span>
				</div>
				<ul className={personaFooterList}>
					{editBay.map((item) => (
						<li key={item.tool} className="flex items-center gap-3 rounded-xl bg-surface-container px-3 py-2.5">
							<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed dark:bg-primary/15 dark:text-primary">
								<Icon name={item.icon} className="text-[19px]" />
							</span>
							<div className="min-w-0">
								<p className="font-headline text-[15px] font-semibold text-on-surface">{item.tool}</p>
								<p className="font-sans text-body-dense text-on-surface-variant">{item.use}</p>
							</div>
						</li>
					))}
				</ul>
			</article>
		</section>
	);
}
