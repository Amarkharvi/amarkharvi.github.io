"use client";

import Image from "next/image";
import { CopyButton } from "@/components/ui/copy-button";
import { Icon } from "@/components/ui/icon";
import { site } from "@/lib/site";

export function LabHero({ canvasId }: { canvasId: string }) {
	return (
		<div className="relative w-full overflow-hidden rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-xl dark:border dark:border-primary/30 dark:bg-[linear-gradient(135deg,#2a1f8f,#4e35de_120%)]">
			<div className="absolute -right-4 -top-3 z-20 flex rotate-6 items-center gap-1.5 rounded-full bg-tertiary-fixed px-3 py-1.5 text-on-tertiary-fixed shadow-lg">
				<Icon name="bolt" className="text-[16px]" />
				<span className="font-sans text-label-pill font-bold uppercase tracking-wider">Django • React</span>
			</div>
			<div className="absolute -left-3 bottom-14 z-20 -rotate-12 rounded-lg bg-secondary-fixed px-2.5 py-1 font-mono text-[11px] text-on-secondary-fixed shadow-md">
				ColdFusion
			</div>
			<div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full border-[10px] border-primary/40 opacity-40" />
			<div className="pointer-events-none absolute right-4 top-8 h-24 w-24 rounded-full bg-primary-fixed-dim/20 blur-xl" />

			<div className="relative z-10 flex flex-col gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<span className="rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] uppercase text-on-primary">Full-stack developer</span>
					<span className="font-mono text-[11px] text-on-primary-container/70">Bengaluru</span>
				</div>
				<div className="mt-1 flex items-center justify-between gap-3">
					<div className="flex min-w-0 flex-col">
						<h1 className="font-headline text-headline-code-mobile font-extrabold tracking-tight text-white md:text-headline-code">
							ColdFusion to Next.js.
						</h1>
						<p className="mt-1 max-w-xl font-sans text-body-dense font-medium text-on-primary-container">
							Product interfaces, Django and Python apps, SQL and PostgreSQL, React and Next.js, and shell for the work around them.
						</p>
					</div>
					<div className="flex w-16 shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md md:w-[4.75rem]">
						<div className="relative aspect-square">
							<Image src="/media/lab/luffy.png" alt="Luffy smiling" fill sizes="76px" className="object-cover object-center" />
						</div>
						<p
							lang="ja"
							className="px-0.5 py-1 text-center text-[8px] font-bold leading-tight text-on-surface md:text-[9px]"
							style={{ fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans CJK JP", sans-serif' }}
						>
							フルスタックコーダー
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2 pt-2">
					<button
						type="button"
						onClick={() => document.getElementById(canvasId)?.scrollIntoView({ behavior: "smooth", block: "center" })}
						className="flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-3.5 py-2 font-sans text-label-pill font-bold text-on-tertiary-fixed shadow-md transition-all active:translate-y-0.5"
					>
						<Icon name="play_arrow" className="text-[16px]" />
						Atom sketch
					</button>
					<CopyButton
						text={site.cloneCommand}
						label="git clone"
						copiedLabel="Copied to Clipboard!"
						className="rounded-full bg-surface px-3 py-2 font-mono text-label-pill text-on-surface shadow-sm active:translate-y-0.5"
						iconClassName="text-[16px] text-primary"
					/>
				</div>
			</div>
		</div>
	);
}
