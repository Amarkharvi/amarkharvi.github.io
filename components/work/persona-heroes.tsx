import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { SmartVideo } from "@/components/ui/smart-video";
import { TiltCard } from "@/components/ui/tilt-card";
import { getSiteSettings, parseToolChips } from "@/lib/site-settings";

export async function CinemaHero() {
	const settings = await getSiteSettings();
	const persona = settings.persona1;
	const poster = settings.reel.poster || "/media/work/quiet-moments-train.png";
	const tools = parseToolChips(persona.tools).slice(0, 5);

	return (
		<TiltCard strength={5} className="relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden bg-inverse-surface p-5 text-white md:p-7">
			{settings.reel.video ? (
				<SmartVideo
					src={settings.reel.video}
					poster={poster}
					alt="Window light on a seated figure, the cover frame for the cinematography side"
					autoPlay
					preloadImage
					sizes="(min-width: 768px) 60vw, 100vw"
					className="absolute inset-0 h-full w-full object-cover"
				/>
			) : (
				<Image
					src={poster}
					alt="Window light on a seated figure, the cover frame for the cinematography side"
					fill
					preload
					sizes="(min-width: 768px) 60vw, 100vw"
					className="object-cover"
				/>
			)}
			<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/45" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(53,5,200,0.4),transparent_60%)]" />

			<div className="relative flex items-center justify-between gap-2">
				<span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
					{persona.badge}
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
				<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-tertiary-fixed">{persona.role}</span>
				<h2 className="font-serif text-[40px] italic leading-[1.05] tracking-tight md:text-[52px]">{persona.headline}</h2>
				<p className="max-w-md font-sans text-body-default text-white/80">{persona.body}</p>
				{tools.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{tools.map((tool) => (
							<span key={tool} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
								{tool}
							</span>
						))}
					</div>
				) : null}
				<Link
					href={persona.ctaHref || "/cinema"}
					className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2.5 font-sans text-label-pill font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
				>
					{persona.ctaLabel || "Enter the cinema"}
					<Icon name="play_circle" className="text-[16px]" />
				</Link>
			</div>
		</TiltCard>
	);
}

export async function DevHero() {
	const settings = await getSiteSettings();
	const persona = settings.persona2;
	const tools = parseToolChips(persona.tools).slice(0, 5);
	const stackParts = (persona.terminalStack || "").split("·").map((part) => part.trim()).filter(Boolean);
	const stackTop = stackParts.slice(0, 4).join(" · ");
	const stackBottom = stackParts.slice(4).join(" · ");

	return (
		<TiltCard strength={5} className="relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden bg-inverse-surface p-5 text-white md:p-7">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(78,53,222,0.8),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgb(0,102,140,0.5),transparent_55%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[28px_28px]" />

			<div className="relative flex items-center justify-between gap-2">
				<span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
					<span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed" />
					{persona.badge}
				</span>
				<span className="truncate font-mono text-[11px] text-white/75">{persona.promptPath || "~/amar"}</span>
			</div>

			<div className="relative rounded-xl border border-white/15 bg-black/35 p-4 font-mono text-[12px] leading-relaxed backdrop-blur-md">
				<p>
					<span className="text-tertiary-fixed">$</span> whoami
				</p>
				<p className="text-white/70">{persona.terminalWhoami || "amar — full-stack, Bengaluru"}</p>
				<p className="mt-1">
					<span className="text-tertiary-fixed">$</span> cat stack.txt
				</p>
				<p className="text-white/70">{stackTop || "ColdFusion · jQuery · Django · Python"}</p>
				<p className="text-white/70">
					{stackBottom || "SQL · PostgreSQL · React · Next.js"}
					<span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-tertiary-fixed" />
				</p>
			</div>

			<div className="relative flex flex-col gap-3">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-tertiary-fixed">{persona.role}</span>
				<h2 className="font-headline text-[40px] font-bold leading-[1.05] tracking-tight md:text-[52px]">{persona.headline}</h2>
				{persona.body ? <p className="max-w-md font-sans text-body-default text-white/80">{persona.body}</p> : null}
				{tools.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{tools.map((tool) => (
							<span key={tool} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[11px]">
								{tool}
							</span>
						))}
					</div>
				) : null}
				<Link
					href={persona.ctaHref || "/lab"}
					className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-tertiary-fixed px-4 py-2.5 font-sans text-label-pill font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
				>
					{persona.ctaLabel || "Enter the lab"}
					<Icon name="arrow_forward" className="text-[16px]" />
				</Link>
			</div>
		</TiltCard>
	);
}
