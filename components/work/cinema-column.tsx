import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { getSiteSettings } from "@/lib/site-settings";
import { ColumnHeading } from "./column-heading";

const chapters = ["Product films", "Portraits", "Grade & cut"];

const feed = [
	{ label: "Reel", href: "/cinema/quiet-moments", src: "/media/work/quiet-moments-train.png", alt: "Window-light reel cover" },
	{ label: "Product", href: "/cinema#product-shoots", src: "/media/cinema/neon-monolith-cover.jpg", alt: "Reflective product-light frame" },
	{ label: "Portrait", href: "/cinema#portraits", src: "/media/cinema/symphony-of-rust-cover.jpg", alt: "Evening portrait frame" },
];

const editBay = [
	{ tool: "Lightroom", use: "Stills: product and portraits", icon: "photo_camera" },
	{ tool: "DaVinci Resolve", use: "Cut, color, and finish", icon: "palette" },
	{ tool: "Premiere Pro", use: "Cut, sound, and captions", icon: "movie_edit" },
];

const card = "overflow-hidden rounded-xl bg-surface-container-lowest shadow-card dark:border dark:border-primary/15 dark:bg-surface-container-low";

export async function CinemaColumn() {
	const settings = await getSiteSettings();
	return (
		<section aria-label="Cinematography" className="flex flex-col gap-5">
			<ColumnHeading icon="movie" eyebrow="Persona 01 // Cinematographer" title="The frame" serif iconClassName="bg-secondary text-on-secondary" />

			<div className="grid gap-4 lg:group-data-[persona=cinema]/stage:grid-cols-2">
				<div className={`group relative ${card}`}>
					<a
						href={settings.socials.youtube.href}
						target="_blank"
						rel="noopener noreferrer"
						className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:brightness-110 active:scale-95"
					>
						<Icon name="play_circle" className="text-[13px]" filled />
						YouTube • 16:9
					</a>
					<Link href="/cinema" className="block">
						<div className="relative aspect-video bg-inverse-surface">
							<Image
								src="/media/cinema/threshold-cover.jpg"
								alt="Low-key frame used as the YouTube cover"
								fill
								sizes="(min-width: 1024px) 560px, 100vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
							<span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
								<Icon name="play_arrow" filled className="text-[30px]" />
							</span>
						</div>
						<div className="flex flex-col gap-3 p-5">
							<div>
								<h3 className="font-serif text-headline-sm text-on-surface">The long watch</h3>
								<p className="mt-1 font-sans text-body-default text-on-surface-variant">
									Product films, portraits, and the grade, cut to be watched all the way through.
								</p>
							</div>
							<div className="flex flex-wrap gap-1.5">
								{chapters.map((chapter) => (
									<span key={chapter} className="rounded-full bg-secondary-fixed px-2.5 py-1 font-mono text-[11px] text-on-secondary-fixed">
										{chapter}
									</span>
								))}
							</div>
						</div>
					</Link>
				</div>

				<article className={`flex flex-col gap-4 p-5 ${card}`}>
					<div className="flex items-start justify-between gap-2">
						<div>
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
					<div className="grid grid-cols-3 gap-2">
						{feed.map((item) => (
							<Link key={item.label} href={item.href} className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-inverse-surface">
								<Image src={item.src} alt={item.alt} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
								<div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
								<span className="absolute inset-x-2 bottom-2 font-mono text-[11px] font-semibold text-white">{item.label}</span>
							</Link>
						))}
					</div>
				</article>

				<article className={`p-5 lg:group-data-[persona=cinema]/stage:col-span-2 ${card}`}>
					<div className="flex items-center justify-between gap-2">
						<h3 className="font-serif text-headline-sm text-on-surface">The edit bay</h3>
						<span className="font-mono text-[11px] uppercase tracking-wider text-secondary dark:text-primary">Post</span>
					</div>
					<ul className="mt-3 grid gap-2 lg:group-data-[persona=cinema]/stage:grid-cols-3">
						{editBay.map((item) => (
							<li key={item.tool} className="flex items-center gap-3 rounded-lg bg-surface-container px-3 py-2.5">
								<Icon name={item.icon} className="text-[20px] text-secondary dark:text-primary" />
								<div className="min-w-0">
									<p className="font-headline text-[15px] font-semibold text-on-surface">{item.tool}</p>
									<p className="font-sans text-body-dense text-on-surface-variant">{item.use}</p>
								</div>
							</li>
						))}
					</ul>
				</article>
			</div>
		</section>
	);
}
