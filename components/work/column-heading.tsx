import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type ColumnHeadingProps = {
	icon: string;
	eyebrow: string;
	title: string;
	serif?: boolean;
	iconClassName: string;
};

export function ColumnHeading({ icon, eyebrow, title, serif, iconClassName }: ColumnHeadingProps) {
	return (
		<header className="flex items-center gap-3">
			<span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm", iconClassName)}>
				<Icon name={icon} className="text-[22px]" />
			</span>
			<div className="min-w-0">
				<p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">{eyebrow}</p>
				<h2 className={cn("leading-tight tracking-tight text-on-surface", serif ? "font-serif text-headline-lg italic" : "font-headline text-headline-lg font-bold")}>
					{title}
				</h2>
			</div>
			<span className="h-px flex-1 bg-outline-variant/70" />
		</header>
	);
}
