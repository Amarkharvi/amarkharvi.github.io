import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/** Column grid: 2-up when one persona fills the stage; in "both" mode on desktop the column becomes a
 * 4-row subgrid so each cinema card shares a row (and height) with its developer counterpart. */
export const personaColumn =
	"grid content-start gap-4 sm:grid-cols-2 lg:group-data-[persona=both]/stage:row-span-4 lg:group-data-[persona=both]/stage:grid-cols-1 lg:group-data-[persona=both]/stage:grid-rows-subgrid";

export const personaCard =
	"flex min-w-0 flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-card ring-1 ring-outline-variant/40 transition-shadow duration-300 hover:shadow-lg dark:bg-surface-container-low dark:ring-primary/15";

/** Lists inside the full-width footer cards: 3-up when there's room, stacked in the half-width "both" view. */
export const personaFooterList = "mt-3 grid gap-2 sm:grid-cols-3 lg:group-data-[persona=both]/stage:grid-cols-1";

type ColumnHeadingProps = {
	icon: string;
	eyebrow: string;
	title: string;
	serif?: boolean;
	iconClassName: string;
};

export function ColumnHeading({ icon, eyebrow, title, serif, iconClassName }: ColumnHeadingProps) {
	return (
		<header className="col-span-full flex items-center gap-3 pb-1">
			<span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm", iconClassName)}>
				<Icon name={icon} className="text-[22px]" />
			</span>
			<div className="min-w-0">
				<p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">{eyebrow}</p>
				<h2 className={cn("leading-tight tracking-tight text-on-surface", serif ? "font-serif text-headline-lg italic" : "font-headline text-headline-lg font-bold")}>
					{title}
				</h2>
			</div>
			<span className="h-px flex-1 bg-linear-to-r from-outline-variant/80 to-transparent" />
		</header>
	);
}
