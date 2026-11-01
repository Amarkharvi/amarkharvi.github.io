import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { TiltCard } from "@/components/ui/tilt-card";
import { getSiteSettings } from "@/lib/site-settings";

const editTools = ["Lightroom", "DaVinci Resolve", "Premiere Pro"];
const stackTools = ["ColdFusion", "Django", "PostgreSQL", "Next.js"];

export async function CinemaHero() {
	const settings = await getSiteSettings();
	return (
		<TiltCard strength={5} className="relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden bg-inverse-surface p-5 text-white md:p-7">
			<Image
				src="/media/work/quiet-moments-train.png"
				alt="Window light on a seated figure, the cover frame for the cinematography side"
				fill
				preload
				sizes="(min-width: 768px) 60vw, 100vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/45" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(53,5,200,0.4),transparent_60%)]" />

			<div className="relative flex items-center justify-between gap-2">
				<span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
					PERSONA 01 • REC
				</span>
				<div className="flex flex-wrap items-center gap-1.5">
					<a
						href={settings.socials.youtube.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:brightness-110 active:scale-95"
					>
						<Icon name="play_circle" className="text-[13px]" filled />
						YouTube
					</a>
					<a
						href={settings.socials.instagram.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 rounded-full bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:brightness-110 active:scale-95"
					>
						<Icon name="photo_camera" className="text-[13px]" filled />
						Instagram
					</a>
				</div>
			</div>

			<div className="relative flex flex-col gap-3">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-tertiary-fixed">Cinematographer &amp; editor</span>
				<h2 className="font-serif text-[40px] italic leading-[1.05] tracking-tight md:text-[52px]">Behind the camera.</h2>
				<p className="max-w-md font-sans text-body-default text-white/80">
					Product films and portraits on YouTube. Reels, product stills, and portraits on Instagram.
				</p>
				<div className="flex flex-wrap gap-1.5">
					{editTools.map((tool) => (
						<span key={tool} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
							{tool}
						</span>
					))}
				</div>
				<Link
					href="/cinema"
					className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2.5 font-sans text-label-pill font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
				>
					Enter the cinema
					<Icon name="play_circle" className="text-[16px]" />
				</Link>
			</div>
		</TiltCard>
	);
}

export function DevHero() {
	return (
		<TiltCard strength={5} className="relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden bg-inverse-surface p-5 text-white md:p-7">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(78,53,222,0.8),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(0,102,140,0.5),transparent_55%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[28px_28px]" />

			<div className="relative flex items-center justify-between gap-2">
				<span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
					<span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed" />
					PERSONA 02 • BUILD
				</span>
				<span className="truncate font-mono text-[11px] text-white/75">~/amar</span>
			</div>

			<div className="relative rounded-xl border border-white/15 bg-black/35 p-4 font-mono text-[12px] leading-relaxed backdrop-blur-md">
				<p>
					<span className="text-tertiary-fixed">$</span> whoami
				</p>
				<p className="text-white/70">amar — full-stack, Bengaluru</p>
				<p className="mt-1">
					<span className="text-tertiary-fixed">$</span> cat stack.txt
				</p>
				<p className="text-white/70">ColdFusion · jQuery · Django · Python</p>
				<p className="text-white/70">
					SQL · PostgreSQL · React · Next.js
					<span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-tertiary-fixed" />
				</p>
			</div>

			<div className="relative flex flex-col gap-3">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-tertiary-fixed">Full-stack developer</span>
				<h2 className="font-headline text-[40px] font-bold leading-[1.05] tracking-tight md:text-[52px]">Behind the keyboard.</h2>
				<div className="flex flex-wrap gap-1.5">
					{stackTools.map((tool) => (
						<span key={tool} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[11px]">
							{tool}
						</span>
					))}
				</div>
				<Link
					href="/lab"
					className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-tertiary-fixed px-4 py-2.5 font-sans text-label-pill font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
				>
					Enter the lab
					<Icon name="arrow_forward" className="text-[16px]" />
				</Link>
			</div>
		</TiltCard>
	);
}
