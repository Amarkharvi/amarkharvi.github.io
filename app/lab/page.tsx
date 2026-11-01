import type { Metadata } from "next";
import Link from "next/link";
import { LabHero } from "@/components/lab/lab-hero";
import { PalladiumCanvas } from "@/components/lab/palladium-canvas";
import { PapersTerminal } from "@/components/lab/papers-terminal";
import { RepoCard } from "@/components/lab/repo-card";
import { Icon } from "@/components/ui/icon";
import { getTechStack, repos } from "@/lib/content";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export const metadata: Metadata = {
	title: "Code & Lab",
	description: "Full-stack work by Amar Kharvi — ColdFusion, Django, Python, SQL, PostgreSQL, React, and Next.js.",
};

const metrics = [
	{ icon: "code", label: "SERVER", value: "CF", sub: "ColdFusion & jQuery", tone: "text-primary" },
	{ icon: "database", label: "DATA", value: "Postgres", sub: "SQL & PostgreSQL", tone: "text-tertiary" },
	{ icon: "devices", label: "FRONT END", value: "Next", sub: "React & Next.js", tone: "text-secondary" },
];

const CANVAS_ID = "compute-canvas";

export default async function LabPage() {
	const techStack = await getTechStack();
	return (
		<div className="flex flex-col gap-6 px-4 py-2 md:px-8 md:py-4">
			<div className="flex items-center justify-between rounded-full bg-surface-container-high p-1.5 shadow-inner md:max-w-xl dark:border dark:border-primary/20 dark:bg-surface-container-low">
				<div className="flex items-center gap-1">
					<span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-sans text-label-pill font-bold text-on-surface shadow-sm dark:bg-primary dark:text-on-primary dark:shadow-glow">
						<Icon name="terminal" className="text-[14px] text-primary dark:text-on-primary" />
						Developer Mode
					</span>
					<Link
						href="/cinema"
						className="flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:text-on-surface"
					>
						<Icon name="movie" className="text-[14px]" />
						Cinema Mode
					</Link>
				</div>
				<div className="flex items-center gap-1 pr-2 font-mono text-tertiary">
					<span className="h-2 w-2 animate-ping rounded-full bg-tertiary-fixed-dim" />
					<span className="text-[11px] font-bold">NODE_ONLINE</span>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
				<div className="flex flex-col gap-6">
					<LabHero canvasId={CANVAS_ID} />
					<div className="grid grid-cols-3 gap-2">
						{metrics.map((metric) => (
							<div key={metric.label} className="flex flex-col rounded-xl bg-surface-container-low p-3 shadow-sm dark:border dark:border-primary/10">
								<div className={cn("flex items-center gap-1", metric.tone)}>
									<Icon name={metric.icon} className="text-[15px]" />
									<span className="font-mono text-[10px]">{metric.label}</span>
								</div>
								<span className="mt-1 font-headline text-headline-sm font-semibold text-on-surface">{metric.value}</span>
								<span className="font-sans text-[11px] font-medium leading-tight text-on-surface-variant">{metric.sub}</span>
							</div>
						))}
					</div>

					<div className="flex flex-1 flex-col justify-center gap-3 rounded-xl bg-surface-container-low p-4 shadow-sm dark:border dark:border-primary/10">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
								<span className="font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface">{site.availability}</span>
							</div>
							<span className="font-mono text-[11px] text-on-surface-variant">{site.location}</span>
						</div>
						<p className="font-sans text-[12px] leading-relaxed text-on-surface-variant">
							Currently shipping this dual-persona portfolio in Next.js 16 — the same person writing the backend and grading the reel.
						</p>
						<div className="flex items-center gap-2 pt-1">
							<a
								href={site.socials.github.href}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-sans text-label-pill font-bold text-on-surface shadow-sm transition-transform active:scale-95"
							>
								<Icon name="code" className="text-[14px] text-primary" />
								GitHub
							</a>
							<a
								href={site.socials.linkedin.href}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-sans text-label-pill font-bold text-on-surface shadow-sm transition-transform active:scale-95"
							>
								<Icon name="badge" className="text-[14px] text-secondary" />
								LinkedIn
							</a>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 rounded-2xl bg-surface-container p-4 shadow-md dark:border dark:border-primary/15">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary-fixed-dim" />
						<span className="font-mono text-[13px] font-semibold text-on-surface">Fun fact</span>
					</div>
					<span className="rounded bg-primary px-2 py-0.5 font-mono text-[10px] text-on-primary">Browser</span>
					</div>
					<PalladiumCanvas id={CANVAS_ID} />
					<div className="flex items-center justify-between px-1 font-mono text-[11px] text-on-surface-variant">
						<span>Palladium · shells 2 · 8 · 18 · 18 · 0</span>
						<span>Bohr-style sketch, not real orbitals</span>
					</div>
					<p className="rounded-xl bg-surface-container-low px-3 py-2.5 font-sans text-[13px] leading-relaxed text-on-surface-variant dark:border dark:border-primary/10">
						<span className="font-semibold text-on-surface">Palladium (element 46) breaks a basic rule of atoms.</span> Electrons
						normally fill the outer shell before they finish the one inside it. Palladium does the reverse: the two electrons that
						belong in its outermost shell move inward instead, leaving that shell completely empty. A perfectly full inner shell is
						simply more stable. No other metal goes this far — the ones right next to it keep at least one electron outside.
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm dark:border dark:border-primary/10 dark:bg-surface-container-low">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Icon name="memory" className="text-[20px] text-primary" />
						<span className="font-headline text-[17px] font-semibold text-on-surface">Where the stack is used</span>
					</div>
					<span className="rounded-full bg-secondary-fixed px-2 py-0.5 font-sans text-label-pill font-bold text-on-secondary-fixed">Daily</span>
				</div>
				<p className="font-sans text-body-default text-on-surface-variant">
					ColdFusion and jQuery on products that already run that way. Django, Python, SQL, and PostgreSQL for apps and data. React and
					Next.js when the interface is new. Shell for the work around the app.
				</p>
				<div className="flex flex-col gap-2.5 pt-1">
					<div className="flex flex-col gap-1">
						<div className="flex justify-between font-mono text-[11px]">
							<span className="font-medium text-on-surface">ColdFusion, HTML, CSS, JS, jQuery</span>
							<span className="font-bold text-primary">Product UI</span>
						</div>
						<div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
							<div className="h-full w-[88%] rounded-full bg-primary dark:shadow-glow" />
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<div className="flex justify-between font-mono text-[11px]">
							<span className="text-on-surface-variant">Django, Python, SQL, PostgreSQL, React, Next.js</span>
							<span className="font-medium text-on-surface-variant">Apps &amp; new UI</span>
						</div>
						<div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
							<div className="h-full w-[72%] rounded-full bg-outline" />
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between pt-2">
					<div className="flex items-center gap-1.5 font-mono text-[11px] text-tertiary">
						<Icon name="check_circle" className="text-[15px]" />
						Same person, both sides
					</div>
						<Link href="/lab/spectra-wgsl" className="flex items-center gap-0.5 font-sans text-label-pill font-bold text-primary transition-colors hover:underline">
							Inspect Spec
							<Icon name="arrow_forward" className="text-[14px]" />
						</Link>
					</div>
				</div>

				<div className="flex flex-col gap-2.5">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface">Core Tech Matrix &amp; Toolchain</span>
						<span className="font-mono text-[11px] text-on-surface-variant">{techStack.length} Active Stacks</span>
					</div>
					<ul className="flex flex-wrap gap-1.5">
						{techStack.map((tech) => (
							<li
								key={tech.label}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-label-mono shadow-xs",
									tech.group === "focus"
										? "bg-primary-fixed font-semibold text-on-primary-fixed"
										: "bg-surface-container-high text-on-surface dark:border dark:border-primary/10",
								)}
							>
								<span className={cn("h-2 w-2 rounded-full", tech.dot)} />
								{tech.label}
							</li>
						))}
					</ul>
					<div className="mt-2">
						<PapersTerminal />
					</div>
				</div>
			</div>

			<section className="flex flex-col gap-3 pb-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Icon name="folder_code" className="text-[20px] text-primary" />
						<h2 className="font-headline text-[18px] font-semibold text-on-surface">Public repositories</h2>
					</div>
					<span className="font-mono text-[11px] text-on-surface-variant">{repos.length} on GitHub</span>
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					{repos.map((repo) => (
						<RepoCard key={repo.name} repo={repo} />
					))}
				</div>
			</section>
		</div>
	);
}
