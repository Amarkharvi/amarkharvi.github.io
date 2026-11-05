import type { Metadata } from "next";
import Link from "next/link";
import { ShaderSandbox } from "@/components/spectra/shader-sandbox";
import { WgslCode } from "@/components/spectra/wgsl-code";
import { CopyButton } from "@/components/ui/copy-button";
import { FactDeck } from "@/components/ui/fact-deck";
import { Icon } from "@/components/ui/icon";
import { getFacts } from "@/lib/facts";
import { cn } from "@/lib/cn";
import { docs, site } from "@/lib/site";

export const metadata: Metadata = {
	title: "Stack Notes",
	description: "Amar Kharvi's full-stack practice — ColdFusion, Django, Python, SQL, PostgreSQL, React, Next.js — and a browser grade sketch.",
};

const topology = [
	{ step: "01", title: "ColdFusion & jQuery", tag: "Product UI", body: "Pages and behavior on apps that already run ColdFusion" },
	{ step: "02", title: "Django, SQL & PostgreSQL", tag: "Apps & data", body: "Server-side apps in Django and Python, with SQL and PostgreSQL underneath" },
	{ step: "03", title: "React & Next.js", tag: "New interfaces", body: "Component UI, including this portfolio" },
	{ step: "04", title: "Shell", tag: "Local workflow", body: "The commands around the build, the edit, and the export", live: true },
];

const installCommands = ["git clone https://github.com/Amarkharvi/React-Django-Fullstack-.git", "cd React-Django-Fullstack-"];

const targets = [
	{ icon: "code", title: "ColdFusion", sub: "HTML, CSS, JS, jQuery" },
	{ icon: "database", title: "PostgreSQL", sub: "SQL & Django" },
	{ icon: "devices", title: "React", sub: "Next.js" },
];

export default async function SpectraPage() {
	const facts = await getFacts();
	return (
		<div className="flex flex-col pb-8">
			<div className="flex items-center justify-between bg-surface-container-low px-6 py-2.5 font-mono text-label-mono md:px-8 dark:border-b dark:border-primary/10">
				<Link href="/lab" className="flex items-center gap-1.5 text-primary transition-colors hover:text-primary-container dark:hover:text-primary-fixed-dim">
					<Icon name="arrow_left_alt" className="text-[16px]" />
					Code &amp; Lab
				</Link>
				<span className="text-on-surface-variant">Bengaluru • full stack</span>
			</div>

			<section className="flex flex-col gap-3 px-6 pb-2 pt-6 md:px-8">
				<div className="flex items-center gap-2">
					<span className="rounded-full bg-primary-fixed px-3 py-1 font-sans text-label-pill font-bold uppercase tracking-wider text-on-primary-fixed">Daily stack</span>
					<span className="font-mono text-label-mono text-outline">AMAR KHARVI</span>
				</div>
				<h1 className="font-headline text-headline-code-mobile font-bold tracking-tight text-on-surface md:text-headline-code">Stack Notes</h1>
				<p className="max-w-3xl font-sans text-body-default text-on-surface-variant">
					ColdFusion, HTML, CSS, JavaScript, and jQuery. Django, Python, SQL, and PostgreSQL. React and Next.js. Edits in Lightroom,
					DaVinci Resolve, and Premiere Pro. The canvas below is a browser grade sketch, not a published graphics engine.
				</p>
			</section>

			<div className="px-6 pb-2 md:px-8">
				<FactDeck label="Under the sketch" facts={facts.spectra} />
			</div>

			<ShaderSandbox />

			<section className="grid grid-cols-1 gap-6 px-6 py-4 md:px-8 lg:grid-cols-[1.4fr_1fr]">
				<WgslCode />

				<div className="flex flex-col gap-3">
					<div>
						<span className="font-mono text-label-mono uppercase tracking-widest text-tertiary">How the work splits</span>
						<h2 className="font-headline text-headline-sm font-semibold text-on-surface">The stack, in order</h2>
					</div>
					<ol className="flex flex-col gap-2">
						{topology.map((node, index) => (
							<li key={node.step} className="flex flex-col items-center gap-2">
								<div
									className={cn(
										"flex w-full items-start gap-3 rounded-xl p-3 shadow-sm",
										node.live ? "bg-primary-fixed text-on-primary-fixed dark:shadow-glow" : "bg-surface-container dark:border dark:border-primary/10",
									)}
								>
									<span className={cn("font-mono text-[18px] font-bold", node.live ? "text-on-primary-fixed" : "text-primary")}>{node.step}</span>
									<div className="flex min-w-0 flex-col gap-0.5">
										<div className="flex flex-wrap items-center gap-2">
											<span className={cn("font-sans text-body-dense font-bold", node.live ? "text-on-primary-fixed" : "text-on-surface")}>{node.title}</span>
											<span
												className={cn(
													"rounded px-1.5 py-0.5 font-mono text-[10px]",
													node.live ? "bg-on-primary-fixed text-primary-fixed" : "bg-surface-container-highest text-tertiary",
												)}
											>
												{node.tag}
											</span>
										</div>
										<span className={cn("font-sans text-[12px]", node.live ? "text-on-primary-fixed/80" : "text-on-surface-variant")}>{node.body}</span>
									</div>
								</div>
								{index < topology.length - 1 ? <Icon name="keyboard_double_arrow_down" className="text-[18px] text-outline" /> : null}
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className="px-6 py-4 md:px-8">
				<div className="flex flex-col gap-4 rounded-xl bg-surface-container p-4 shadow-md dark:border dark:border-primary/10">
					<div className="flex items-center gap-2">
						<Icon name="insights" className="text-[18px] text-primary" />
						<h2 className="font-headline text-headline-sm font-semibold text-on-surface">Picture work beside the code</h2>
					</div>
					<Bar label="Instagram reels & edits" value="Pace, sound, captions" width="w-full" barClass="bg-primary dark:shadow-glow" valueClass="text-primary" />
					<Bar label="Product shoots & portraits" value="Stills and short motion" width="w-[70%]" barClass="bg-outline" valueClass="text-on-surface-variant" />
					<div className="grid grid-cols-2 gap-2">
						<div className="rounded-lg bg-surface-container-lowest p-3">
							<span className="font-mono text-[10px] uppercase text-on-surface-variant">Base</span>
							<p className="font-headline text-headline-sm font-bold text-tertiary">Bengaluru</p>
						</div>
						<div className="rounded-lg bg-surface-container-lowest p-3">
							<span className="font-mono text-[10px] uppercase text-on-surface-variant">Also</span>
							<p className="font-headline text-headline-sm font-bold text-primary">Remote builds</p>
						</div>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 gap-6 px-6 py-4 md:px-8 lg:grid-cols-2">
				<div className="flex flex-col gap-3">
					<div>
						<span className="font-mono text-label-mono uppercase tracking-widest text-tertiary">Public code</span>
						<h2 className="font-headline text-headline-sm font-semibold text-on-surface">Clone a real repo</h2>
					</div>
					<div className="overflow-hidden rounded-xl bg-inverse-surface shadow-lg">
						<div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
							<span className="font-mono text-[11px] text-white/60">bash — quick install</span>
							<CopyButton
								text={installCommands.join("\n")}
								className="rounded px-2 py-1 font-mono text-[10px] text-white/70 hover:bg-white/10 hover:text-white"
								iconClassName="text-[13px]"
							/>
						</div>
						<div className="flex flex-col gap-1 overflow-x-auto p-4 font-mono text-[13px] whitespace-nowrap">
							{installCommands.map((command) => (
								<p key={command}>
									<span className="select-none text-cyan-300">$ </span>
									<span className="text-white">{command}</span>
								</p>
							))}
						</div>
					</div>
					<div className="grid grid-cols-3 gap-2">
						{targets.map((target) => (
							<div key={target.title} className="flex min-w-0 flex-col items-center gap-1 rounded-xl bg-surface-container p-2 text-center wrap-anywhere sm:p-3 dark:border dark:border-primary/10">
								<Icon name={target.icon} className="text-[20px] text-primary" />
								<span className="font-sans text-[12px] font-bold text-on-surface">{target.title}</span>
								<span className="font-mono text-[10px] text-on-surface-variant">{target.sub}</span>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col justify-end gap-3">
					<a
						href={docs.spectraPaper.href}
						download={docs.spectraPaper.file}
						className="flex items-center justify-between rounded-xl bg-primary px-5 py-4 font-sans font-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-[0.98] dark:shadow-glow"
					>
						<span className="flex items-center gap-2">
							<Icon name="description" className="text-[20px]" />
							Download stack notes (PDF)
						</span>
						<Icon name="download" className="text-[20px]" />
					</a>
					<a
						href={site.socials.github.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between rounded-xl bg-surface-container-high px-5 py-4 font-sans font-bold text-on-surface transition-all hover:bg-surface-container-highest active:scale-[0.98] dark:border dark:border-primary/15"
					>
						<span className="flex items-center gap-2">
							<Icon name="star" className="text-[20px] text-tertiary" />
							GitHub — Amarkharvi
						</span>
						<span className="font-mono text-[12px] text-on-surface-variant">26 repos</span>
					</a>
					<p className="pt-4 text-center font-mono text-[10px] tracking-widest text-outline">AMAR KHARVI • FULL STACK &amp; CINEMA</p>
				</div>
			</section>
		</div>
	);
}

function Bar({ label, value, width, barClass, valueClass }: { label: string; value: string; width: string; barClass: string; valueClass: string }) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex justify-between gap-2 font-mono text-[11px]">
				<span className="text-on-surface">{label}</span>
				<span className={cn("font-bold", valueClass)}>{value}</span>
			</div>
			<div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
				<div className={cn("h-full rounded-full", width, barClass)} />
			</div>
		</div>
	);
}
