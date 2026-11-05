import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { SmartVideo } from "@/components/ui/smart-video";
import { mediaKindOf } from "@/lib/content-data";
import { repos } from "@/lib/content";
import { getSiteSettings, parseToolChips } from "@/lib/site-settings";
import { ColumnHeading, personaCard, personaColumn, personaFooterList } from "./column-heading";

const feedIndex = `CREATE INDEX CONCURRENTLY projects_feed_idx
	ON portfolio.projects (persona, shipped_at DESC);`;

function quoted(tools: string[], fallback: string) {
	return tools.length > 0 ? tools.map((tool) => `"${tool}"`).join(", ") : fallback;
}

export async function DevColumn() {
	const settings = await getSiteSettings();
	const persona = settings.persona2;
	const tools = parseToolChips(persona.tools);
	const featureSrc = persona.featureMedia.trim();
	const featurePoster = persona.featurePoster.trim();
	const featureVideo = featureSrc && mediaKindOf(featureSrc) === "video";
	const featureChips = parseToolChips(persona.featureChips);
	const featureHref = persona.featureHref.trim() || "/lab";
	const featureBody = persona.featureBody.trim() || persona.body;

	return (
		<section aria-label="Full-stack development" className={personaColumn}>
			<ColumnHeading
				icon="terminal"
				eyebrow={persona.columnEyebrow}
				title={persona.columnTitle}
				iconClassName="bg-primary text-on-primary dark:shadow-glow"
			/>

			<article className={`group ${personaCard}`}>
				{featureSrc || featurePoster ? (
					<Link href={featureHref} className="group relative block aspect-video overflow-hidden bg-inverse-surface">
						{featureVideo && featurePoster ? (
							<SmartVideo
								src={featureSrc}
								poster={featurePoster}
								alt={persona.featureTitle || "Persona 02 card"}
								sizes="(min-width: 1024px) 640px, 100vw"
								className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						) : featureVideo ? (
							<video
								src={featureSrc}
								muted
								loop
								playsInline
								preload="metadata"
								className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						) : (
							<Image
								src={featurePoster || featureSrc}
								alt={persona.featureTitle || "Persona 02 card"}
								fill
								sizes="(min-width: 1024px) 640px, 100vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						)}
						{featureVideo ? (
							<span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
								<Icon name="play_arrow" filled className="text-[30px]" />
							</span>
						) : null}
					</Link>
				) : (
					<>
						<div className="flex items-center justify-between bg-primary-container px-4 py-3">
							<div className="flex items-center gap-1.5">
								<span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
								<span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
								<span className="h-2.5 w-2.5 rounded-full bg-tertiary-fixed" />
								<span className="ml-1 font-mono text-[11px] text-on-primary-container">{persona.featureTitle || "stack.js"}</span>
							</div>
							<span className="font-mono text-[11px] text-tertiary-fixed">Product UI → data</span>
						</div>
						<div className="flex flex-1 flex-col justify-center gap-0.5 bg-inverse-surface p-5 font-mono text-[13px] leading-relaxed text-inverse-on-surface/85">
							<p>
								<span className="text-tertiary-fixed">export const</span> stack = {"{"}
							</p>
							<p className="pl-4">
								ui: [<span className="text-primary-fixed-dim">{quoted(tools.slice(0, 4), `"ColdFusion", "jQuery", "React", "Next.js"`)}</span>],
							</p>
							<p className="pl-4">
								server: [<span className="text-primary-fixed-dim">{quoted(tools.slice(4, 7), `"Django", "Python", "shell"`)}</span>],
							</p>
							<p className="pl-4">
								data: [<span className="text-primary-fixed-dim">{quoted(tools.slice(7), `"SQL", "PostgreSQL"`)}</span>],
							</p>
							<p>{"};"}</p>
							<p className="mt-3 text-inverse-on-surface/60">
								<span className="text-tertiary-fixed">$</span> npm run build
							</p>
							<p className="text-tertiary-fixed">
								✓ Compiled — routes prerendered, data on PostgreSQL
								<span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-tertiary-fixed" />
							</p>
						</div>
					</>
				)}
				<div className="flex flex-1 flex-col gap-3 p-5">
					{featureSrc || featurePoster ? (
						<div>
							{persona.featureTitle ? <h3 className="font-headline text-headline-sm font-bold text-on-surface">{persona.featureTitle}</h3> : null}
							{featureBody ? <p className="mt-1 font-sans text-body-default text-on-surface-variant">{featureBody}</p> : null}
						</div>
					) : (
						<p className="font-sans text-body-default text-on-surface-variant">{featureBody}</p>
					)}
					<div className="mt-auto flex flex-wrap items-center gap-1.5">
						{featureChips.map((chip) => (
							<span key={chip} className="rounded-full bg-primary-fixed px-2.5 py-1 font-mono text-[11px] text-on-primary-fixed">
								{chip}
							</span>
						))}
						<Link
							href={featureHref}
							className="group/link ml-auto inline-flex shrink-0 items-center gap-1 font-sans text-label-pill font-bold text-primary dark:text-primary-fixed-dim"
						>
							{persona.featureLinkLabel || "Stack notes"}
							<Icon name="arrow_forward" className="text-[16px] transition-transform group-hover/link:translate-x-0.5" />
						</Link>
					</div>
				</div>
			</article>

			<article className={`gap-3 p-5 ${personaCard}`}>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Icon name="database" className="text-[20px] text-primary dark:text-primary-fixed-dim" />
						<h3 className="font-headline text-[17px] font-semibold text-on-surface">SQL &amp; PostgreSQL</h3>
					</div>
					<span className="rounded-full bg-primary-fixed px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-on-primary-fixed">SKIP THE SORT</span>
				</div>
				<p className="font-sans text-body-default text-on-surface">A list that filters and sorts can ride one index. The sort step leaves the plan.</p>
				<pre className="overflow-x-auto rounded-xl bg-surface-container p-3 font-mono text-[12px] leading-relaxed text-on-surface tab-2">
					<code>{feedIndex}</code>
				</pre>
				<div className="rounded-xl border border-dashed border-outline-variant/70 p-3 font-mono text-[12px] leading-relaxed">
					<p className="text-on-surface-variant">EXPLAIN (ANALYZE, BUFFERS) …</p>
					<p className="text-on-surface">
						<span className="text-primary dark:text-tertiary-fixed">→</span> Index Scan using projects_feed_idx
					</p>
					<p className="text-on-surface-variant">Execution time: 0.21 ms · no Sort node</p>
				</div>
				<p className="mt-auto font-sans text-body-dense text-on-surface-variant">
					First column matches the <span className="font-mono text-[12px] text-on-surface">WHERE</span>, second matches the{" "}
					<span className="font-mono text-[12px] text-on-surface">ORDER BY</span> already descending. Confirm with{" "}
					<span className="font-mono text-[12px] text-on-surface">EXPLAIN (ANALYZE, BUFFERS)</span> — if the plan still says Sort, the index doesn&apos;t match the query.
				</p>
			</article>

			<article className={`col-span-full p-5 ${personaCard}`}>
				<div className="flex items-center justify-between gap-2">
					<h3 className="font-headline text-[17px] font-semibold text-on-surface">Public repositories</h3>
					<a href={settings.socials.github.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-primary dark:text-primary-fixed-dim">
						{settings.socials.github.handle}
					</a>
				</div>
				<ul className={personaFooterList}>
					{repos.slice(0, 3).map((repo) => (
						<li key={repo.name}>
							<a
								href={repo.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center gap-3 rounded-xl bg-surface-container px-3 py-2.5 transition-colors hover:bg-surface-container-high"
							>
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed dark:bg-primary/15 dark:text-primary-fixed-dim">
									<Icon name={repo.icon} className="text-[19px]" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="truncate font-mono text-[13px] font-semibold text-on-surface">{repo.name}</p>
									<p className="truncate font-sans text-body-dense text-on-surface-variant">
										{repo.subtitle} • {repo.meta}
									</p>
								</div>
								<Icon name="north_east" className="text-[16px] text-on-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</a>
						</li>
					))}
				</ul>
			</article>
		</section>
	);
}
