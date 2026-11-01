import { CopyButton } from "@/components/ui/copy-button";
import { Icon } from "@/components/ui/icon";
import { getSiteSettings } from "@/lib/site-settings";

export async function ContactCard() {
	const settings = await getSiteSettings();
	return (
		<article className="flex flex-col gap-4 rounded-xl bg-surface-container-low p-5 shadow-card dark:border dark:border-primary/15">
			<div className="flex items-start justify-between">
				<div className="flex flex-col">
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-primary-fixed-dim">
						Start a Conversation
					</span>
					<h3 className="mt-0.5 font-headline text-headline-sm font-semibold tracking-tight text-on-surface">Let&apos;s cut a reel or ship a build.</h3>
				</div>
				<span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-secondary dark:border dark:border-primary/40 dark:bg-primary-fixed dark:text-primary-fixed-dim dark:shadow-glow">
					<Icon name="send" className="text-[20px]" />
				</span>
			</div>
			<p className="font-sans text-body-default text-on-surface-variant">
				Open for reels and stills edited in Lightroom, DaVinci Resolve, and Premiere Pro, and for full-stack work in ColdFusion, Django, Python, SQL, and PostgreSQL.
			</p>
			<div className="flex flex-col gap-2 pt-1">
				<div className="flex items-center gap-2">
					<a
						href={settings.socials.github.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-center font-sans text-label-pill font-bold text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-[0.98] dark:shadow-glow"
					>
						<Icon name="code" className="text-[16px]" />
						GitHub
					</a>
					<CopyButton
						text={settings.socials.github.href}
						label="Copy link"
						className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2.5 font-sans text-label-pill font-bold text-on-surface hover:border-primary"
						activeClassName="border-primary bg-primary text-on-primary"
					/>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2">
					<a
						href={settings.socials.github.href}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant transition-colors hover:text-primary"
					>
						<Icon name="code" className="text-[15px]" />
						{settings.socials.github.handle}
					</a>
					<span className="text-outline">•</span>
					<a
						href={settings.socials.linkedin.href}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant transition-colors hover:text-primary"
					>
						<Icon name="hub" className="text-[15px]" />
						{settings.socials.linkedin.handle}
					</a>
				</div>
			</div>
		</article>
	);
}
