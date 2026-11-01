"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/cn";
import type { Film } from "@/lib/content";

const badgeTones: Record<Film["badgeTone"], string> = {
	secondary: "bg-secondary-fixed text-on-secondary-fixed",
	primary: "bg-primary-fixed text-on-primary-fixed",
	warm: "bg-secondary-fixed-dim text-on-secondary-fixed dark:bg-secondary-fixed dark:text-on-secondary-fixed",
	neutral: "bg-surface-container-highest text-on-surface",
};

export function FilmCard({ film }: { film: Film }) {
	const [open, setOpen] = useState(false);
	const drawerId = useId();

	return (
		<TiltCard
			as="article"
			id={film.slug}
			strength={6}
			className="flex scroll-mt-24 flex-col gap-2 rounded-xl bg-surface-container-low p-4 shadow-card transition-all duration-200 dark:border dark:border-primary/10"
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex flex-col">
					<div className="mb-1 flex flex-wrap items-center gap-1.5">
						<span className={cn("rounded-full px-2 py-0.5 font-sans text-[10px] font-bold", badgeTones[film.badgeTone])}>{film.badge}</span>
						<span className={cn("font-mono text-[11px]", film.badgeTone === "primary" ? "text-primary" : "text-secondary")}>{film.stock}</span>
					</div>
					<h3 className="font-serif text-display-hero-mobile leading-tight text-on-surface">{film.title}</h3>
					<p className="font-sans text-body-dense font-medium text-on-surface-variant">{film.credit}</p>
				</div>
				<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-mono text-label-mono text-on-surface">
					{film.index}
				</span>
			</div>

			<div className="group relative h-44 w-full overflow-hidden rounded-lg shadow-sm md:h-56">
				<Image
					src={film.cover}
					alt={`${film.title} — production still`}
					fill
					sizes="(min-width: 1024px) 560px, 100vw"
					className="object-cover transition-transform duration-700 group-hover:scale-105"
				/>
				<span className="absolute bottom-2 left-2 rounded bg-black/70 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-md">{film.focal}</span>
			</div>

			<div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-container p-2.5">
				{film.specs.map((spec) => (
					<div key={spec.label} className="flex flex-col">
						<span className="font-mono text-[10px] uppercase text-on-surface-variant">{spec.label}</span>
						<span className="font-mono text-label-mono font-bold text-on-surface">{spec.value}</span>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				aria-controls={drawerId}
				className="flex w-full items-center justify-between pt-1 text-left font-sans text-label-pill font-bold text-secondary dark:text-primary-fixed-dim"
			>
				<span>View Stills, Lighting Diagram &amp; Optical Notes</span>
				<Icon name="expand_more" className={cn("text-[18px] transition-transform duration-300", open && "rotate-180")} />
			</button>

			<div
				id={drawerId}
				className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
				inert={!open}
			>
				<div className="overflow-hidden">
					<div className="flex flex-col gap-2 pt-2">
						<p className="font-serif text-body-editorial italic text-on-surface-variant">&ldquo;{film.note}&rdquo;</p>
						<div className="grid grid-cols-2 gap-2 pt-1">
							{film.stills.map((still) => (
								<div key={still.src} className="relative h-24 overflow-hidden rounded bg-surface-container-high md:h-32">
									<Image src={still.src} alt={still.alt} fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
								</div>
							))}
						</div>
						{film.studyHref ? (
							<Link
								href={film.studyHref}
								className="mt-1 inline-flex items-center gap-1 self-start rounded-full bg-secondary px-3.5 py-1.5 font-sans text-label-pill font-bold text-on-secondary transition-all hover:brightness-110 active:scale-95 dark:bg-primary dark:text-on-primary"
							>
								Open the reel study
								<Icon name="arrow_forward" className="text-[16px]" />
							</Link>
						) : null}
					</div>
				</div>
			</div>
		</TiltCard>
	);
}
