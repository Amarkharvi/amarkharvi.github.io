import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Repo } from "@/lib/content";

const iconTones: Record<Repo["iconTone"], string> = {
	primary: "bg-primary-fixed text-on-primary-fixed",
	tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
	secondary: "bg-secondary-fixed text-on-secondary-fixed",
	neutral: "bg-surface-container-high text-on-surface",
};

const tagTones: Record<Repo["tagTone"], string> = {
	primary: "bg-primary-fixed text-on-primary-fixed",
	secondary: "bg-secondary-fixed text-on-secondary-fixed",
	tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
	"primary-dim": "bg-primary-fixed-dim text-on-primary-fixed dark:bg-primary-fixed",
};

export function RepoCard({ repo }: { repo: Repo }) {
	return (
		<article className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md dark:border dark:border-primary/10 dark:bg-surface-container-low dark:hover:border-primary/40 dark:hover:shadow-glow">
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconTones[repo.iconTone])}>
						<Icon name={repo.icon} className="text-[18px]" />
					</span>
					<div className="flex flex-col">
						<span className="font-mono text-[14px] font-bold text-on-surface">{repo.name}</span>
						<span className="font-sans text-[11px] font-medium text-on-surface-variant">{repo.subtitle}</span>
					</div>
				</div>
				<span className="flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5 font-mono text-[11px] text-on-surface">
					<Icon name="code" className="text-[13px] text-secondary" />
					<span className="font-semibold">{repo.meta}</span>
				</span>
			</div>
			<p className="font-sans text-[13px] leading-5 text-on-surface-variant">{repo.description}</p>
			<div className="mt-auto flex items-center justify-between pt-1">
				<div className="flex items-center gap-2">
					<span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] text-on-surface-variant">{repo.license}</span>
					<span className={cn("rounded px-2 py-0.5 font-mono text-[10px]", tagTones[repo.tagTone])}>{repo.tag}</span>
				</div>
				<a href={repo.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-sans text-label-pill font-bold text-primary hover:underline">
					{repo.cta}
					<Icon name="open_in_new" className="text-[14px]" />
				</a>
			</div>
		</article>
	);
}
