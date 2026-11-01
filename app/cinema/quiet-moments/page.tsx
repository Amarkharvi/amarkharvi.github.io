import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FrameArchive } from "@/components/study/frame-archive";
import { GradeComparison } from "@/components/study/grade-comparison";
import { LightingDiagram } from "@/components/study/lighting-diagram";
import { StudyActions } from "@/components/study/study-actions";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
	title: "Reel Study",
	description: "How Amar Kharvi cuts Instagram reels, lights product and portraits, and finishes the grade.",
};

const laurels = [
	{ icon: "movie", iconClass: "text-tertiary-fixed-dim", title: "INSTAGRAM REELS", sub: "Edit, pace, sound, captions", subClass: "text-tertiary" },
	{ icon: "photo_camera", iconClass: "text-primary", title: "PRODUCT SHOOTS", sub: "Stills and short motion", subClass: "text-primary" },
	{ icon: "portrait", iconClass: "text-secondary", title: "PORTRAITS", sub: "Face, light, quiet background", subClass: "text-secondary" },
];

const kit = [
	{ label: "Reels", icon: "movie", iconClass: "text-primary", name: "Feed cuts", spec: "9:16 and a 16:9 master", note: "Hook first, then the beat of the track" },
	{ label: "Product", icon: "photo_camera", iconClass: "text-secondary", name: "Object first", spec: "Tabletop, lifestyle, location", note: "Edges, color, and a clip short enough for a page" },
	{ label: "Portraits", icon: "portrait", iconClass: "text-tertiary", name: "Face first", spec: "Window, soft key, open shade", note: "A readable face and a background that stays quiet" },
	{ label: "Edit bay", icon: "palette", iconClass: "text-primary", name: "Resolve & Premiere", spec: "Lightroom for stills", note: "Cuts and grade in DaVinci Resolve or Premiere Pro. Stills finished in Lightroom." },
];

export default function QuietMomentsStudyPage() {
	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between bg-surface-container-lowest px-5 py-3 md:mt-4 md:rounded-full md:px-6">
				<Link href="/cinema" className="inline-flex items-center gap-1.5 font-mono text-label-mono text-primary transition-colors hover:text-on-surface">
					<Icon name="arrow_left_alt" className="text-[16px]" />
					ALL PICTURE WORK
				</Link>
				<div className="inline-flex items-center gap-2">
					<span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-tertiary-fixed-dim" />
					<span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-on-secondary-container">
						Reel study
					</span>
				</div>
			</div>

			<section className="px-5 pb-4 pt-2 md:px-8">
				<div className="relative overflow-hidden rounded-lg bg-surface-container shadow-2xl">
					<div className="group relative aspect-[21/9] w-full overflow-hidden sm:aspect-[2.39/1]">
						<Image
							src="/media/study/quiet-moments-hero.png"
							alt="Reference frame — window light on a seated figure"
							fill
							preload
							sizes="(min-width: 1152px) 1088px, 100vw"
							className="scale-[1.01] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
						/>
						<div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-60" />
						<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
						<div className="pointer-events-none absolute inset-x-3 top-2.5 flex items-center justify-between font-mono text-[10px] sm:text-label-mono">
							<div className="flex items-center gap-2 rounded bg-black/70 px-2 py-0.5 backdrop-blur-md">
								<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
								<span className="font-bold tracking-widest text-red-300">REC</span>
								<span className="text-white">00:24:18:02</span>
							</div>
							<div className="flex items-center gap-2 rounded bg-black/70 px-2 py-0.5 text-sky-300 backdrop-blur-md">
								<Icon name="graphic_eq" className="text-[13px]" />
								<span>CH1: -18dB • CH2: -20dB</span>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-end justify-between font-mono text-[10px] sm:text-label-mono">
							<div className="flex max-w-[70%] flex-col gap-0.5 rounded bg-black/70 p-1.5 backdrop-blur-md">
								<span className="truncate font-semibold tracking-wide text-sky-200">Window light • seated frame</span>
								<span className="truncate text-[9px] text-white/70 sm:text-[11px]">Reel reference • grade still open</span>
							</div>
							<div className="rounded bg-black/70 px-2 py-1 text-right backdrop-blur-md">
								<span className="font-bold text-blue-300">2.39:1</span>
								<span className="block text-[9px] text-white/60">24.000 FPS</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 flex flex-col gap-2">
					<div className="flex flex-wrap items-baseline justify-between gap-2">
						<div>
							<span className="block font-mono text-label-mono uppercase tracking-wider text-tertiary">Picture notes</span>
							<h1 className="font-headline text-display-hero-mobile font-bold tracking-tight text-on-surface">Reel Study</h1>
						</div>
						<div className="flex items-center gap-2 font-mono text-label-mono text-on-surface-variant">
							<span>
								CUT: <strong className="text-on-surface">Amar Kharvi</strong>
							</span>
							<span>•</span>
							<span>
								BASE: <strong className="text-primary">Bengaluru</strong>
							</span>
						</div>
					</div>
					<div className="no-scrollbar mt-1 flex w-full items-center justify-between gap-2 overflow-x-auto rounded-lg bg-surface-container-low p-2.5 shadow-inner">
						{laurels.map((laurel, i) => (
							<div key={laurel.title} className="flex shrink-0 items-center gap-2">
								{i > 0 ? <span className="mr-2 h-6 w-px shrink-0 bg-outline-variant" /> : null}
								<Icon name={laurel.icon} className={`text-[18px] ${laurel.iconClass}`} />
								<div className="flex flex-col">
									<span className="font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface">{laurel.title}</span>
									<span className={`font-mono text-[10px] ${laurel.subClass}`}>{laurel.sub}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<div className="grid gap-x-8 lg:grid-cols-2">
				<section className="flex flex-col gap-3 px-5 py-3 md:px-8 lg:pr-0">
					<SectionHeading title="What the work covers" icon="memory" aside={<span className="text-tertiary">{"REEL // PRODUCT // FACE"}</span>} />
					<div className="grid grid-cols-2 gap-2.5">
						{kit.map((item) => (
							<div key={item.label} className="flex flex-col justify-between gap-2 rounded-lg bg-surface-container p-3 shadow-sm dark:border dark:border-primary/10">
								<div className="flex items-center justify-between">
									<span className="font-mono text-[10px] uppercase tracking-wider text-outline">{item.label}</span>
									<Icon name={item.icon} className={`text-[16px] ${item.iconClass}`} />
								</div>
								<div>
									<span className="block font-headline text-headline-sm font-semibold leading-tight text-on-surface">{item.name}</span>
									<span className="mt-0.5 block font-mono text-[11px] text-tertiary">{item.spec}</span>
								</div>
								<span className="font-sans text-[11px] text-on-surface-variant">{item.note}</span>
							</div>
						))}
					</div>
				</section>

				<section className="flex flex-col gap-3 px-5 py-3 md:px-8 lg:pl-0">
					<SectionHeading
						title="Lighting Architecture"
						icon="light_mode"
						iconClassName="text-tertiary"
						aside={<span className="rounded bg-surface-container-high px-2 py-0.5 text-[10px] text-tertiary">FACE FIRST</span>}
					/>
					<LightingDiagram />
				</section>

				<section className="flex flex-col gap-3 px-5 py-3 md:px-8 lg:pr-0">
					<SectionHeading title="Flat vs finished" icon="tune" aside={<span className="text-primary">GRADE</span>} />
					<GradeComparison />
				</section>

				<section className="flex flex-col gap-3 px-5 py-3 md:px-8 lg:pl-0">
					<SectionHeading title="Edit note" icon="history_edu" iconClassName="text-secondary" />
					<div className="flex w-full flex-col gap-3 rounded-lg bg-surface-container-low p-4 shadow-md dark:border dark:border-primary/10">
						<div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-outline">
							<span>BENGALURU • REEL PASS</span>
							<span>STILLS + MOTION</span>
						</div>
						<p className="font-serif text-body-editorial leading-relaxed text-on-surface">
							A reel starts with the shot that stops the swipe. Product frames stay on the object. Portraits stay on the face. The cut and
							grade happen in DaVinci Resolve or Premiere Pro, and the stills are finished in Lightroom.
						</p>
						<div className="flex items-center justify-between pt-2 font-mono">
							<div className="flex items-center gap-2">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">AK</span>
								<div className="flex flex-col">
									<span className="text-xs font-semibold text-on-surface">Amar Kharvi</span>
									<span className="text-[10px] text-on-surface-variant">Edit, product, portraits</span>
								</div>
							</div>
							<span className="text-[11px] text-tertiary">BENGALURU</span>
						</div>
					</div>
				</section>
			</div>

			<section className="flex flex-col gap-3 px-5 py-3 md:px-8">
				<SectionHeading title="Reference frames" icon="photo_library" iconClassName="text-tertiary" aside={<span className="text-tertiary">3 FRAMES</span>} />
				<FrameArchive />
			</section>

			<section className="px-5 pb-10 pt-2 md:px-8">
				<StudyActions />
			</section>
		</div>
	);
}
