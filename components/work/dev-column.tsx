import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { repos } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";
import { ColumnHeading } from "./column-heading";

const feedIndex = `CREATE INDEX CONCURRENTLY projects_feed_idx
	ON portfolio.projects (persona, shipped_at DESC);`;

const card = "overflow-hidden rounded-xl bg-surface-container-lowest shadow-card dark:border dark:border-primary/15 dark:bg-surface-container-low";

export async function DevColumn() {
	const settings = await getSiteSettings();
	return (
		<section aria-label="Full-stack development" className="flex flex-col gap-5">
			<ColumnHeading icon="terminal" eyebrow="Persona 02 // Full-stack developer" title="The stack" iconClassName="bg-primary text-on-primary dark:shadow-glow" />

			<div className="grid gap-4 lg:group-data-[persona=dev]/stage:grid-cols-2">
				<article className={card}>
					<div className="flex items-center justify-between bg-primary-container px-4 py-3">
						<div className="flex items-center gap-1.5">
							<span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
							<span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
							<span className="h-2.5 w-2.5 rounded-full bg-tertiary-fixed" />
							<span className="ml-1 font-mono text-[11px] text-on-primary-container">stack.js</span>
						</div>
						<span className="font-mono text-[11px] text-tertiary-fixed">Product UI → data</span>
					</div>
					<div className="bg-inverse-surface p-4 font-mono text-[12px] leading-relaxed text-inverse-on-surface/85">
						<p>
							<span className="text-tertiary-fixed">export const</span> stack = {"{"}
						</p>
						<p className="pl-4">
							ui: [<span className="text-primary-fixed-dim">&quot;ColdFusion&quot;, &quot;jQuery&quot;, &quot;React&quot;, &quot;Next.js&quot;</span>],
						</p>
						<p className="pl-4">
							server: [<span className="text-primary-fixed-dim">&quot;Django&quot;, &quot;Python&quot;, &quot;shell&quot;</span>],
						</p>
						<p className="pl-4">
							data: [<span className="text-primary-fixed-dim">&quot;SQL&quot;, &quot;PostgreSQL&quot;</span>],
						</p>
						<p>{"};"}</p>
					</div>
					<div className="flex items-center justify-between gap-3 p-4">
						<p className="font-sans text-body-dense text-on-surface-variant">ColdFusion where the app already lives. Next.js when it&apos;s new.</p>
						<Link href="/lab/spectra-wgsl" className="shrink-0 font-sans text-label-pill font-bold text-primary dark:text-primary-fixed-dim">
							Stack notes
						</Link>
					</div>
				</article>

				<article className={card}>
					<div className="flex items-center justify-between gap-2 px-4 pt-4">
						<div className="flex items-center gap-2">
							<Icon name="database" className="text-[20px] text-primary dark:text-primary-fixed-dim" />
							<h3 className="font-headline text-[17px] font-semibold text-on-surface">SQL &amp; PostgreSQL</h3>
						</div>
						<span className="rounded-full bg-primary-fixed px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-on-primary-fixed">SKIP THE SORT</span>
					</div>
					<p className="px-4 pt-3 font-sans text-body-dense text-on-surface">
						A list that filters and sorts can ride one index. The sort step leaves the plan.
					</p>
					<pre className="mx-4 mt-3 overflow-x-auto rounded-lg bg-surface-container p-3 font-mono text-[12px] leading-relaxed text-on-surface [tab-size:2]">
						<code>{feedIndex}</code>
					</pre>
					<p className="px-4 pb-4 pt-3 font-sans text-body-dense text-on-surface-variant">
						First column matches the <span className="font-mono text-[12px] text-on-surface">WHERE</span>, second matches the{" "}
						<span className="font-mono text-[12px] text-on-surface">ORDER BY</span> already descending. Confirm it with{" "}
						<span className="font-mono text-[12px] text-on-surface">EXPLAIN (ANALYZE, BUFFERS)</span> — if the plan still says Sort, the index doesn&apos;t match the query. Same shape for orders, feeds, and logs.
					</p>
				</article>

				<article className={`p-5 lg:group-data-[persona=dev]/stage:col-span-2 ${card}`}>
					<div className="flex items-center justify-between gap-2">
						<h3 className="font-headline text-[17px] font-semibold text-on-surface">Public repositories</h3>
						<a href={settings.socials.github.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-primary dark:text-primary-fixed-dim">
							{settings.socials.github.handle}
						</a>
					</div>
					<ul className="mt-3 grid gap-2 lg:group-data-[persona=dev]/stage:grid-cols-3">
						{repos.slice(0, 3).map((repo) => (
							<li key={repo.name}>
								<a
									href={repo.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center gap-3 rounded-lg bg-surface-container px-3 py-2.5 transition-colors hover:bg-surface-container-high"
								>
									<Icon name={repo.icon} className="text-[20px] text-primary dark:text-primary-fixed-dim" />
									<div className="min-w-0 flex-1">
										<p className="truncate font-mono text-[13px] font-semibold text-on-surface">{repo.name}</p>
										<p className="font-sans text-body-dense text-on-surface-variant">
											{repo.subtitle} • {repo.meta}
										</p>
									</div>
									<Icon name="north_east" className="text-[16px] text-on-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
								</a>
							</li>
						))}
					</ul>
				</article>
			</div>
		</section>
	);
}
