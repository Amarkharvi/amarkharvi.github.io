import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

type SectionHeadingProps = {
	title: string;
	eyebrow?: string;
	icon?: string;
	iconClassName?: string;
	aside?: ReactNode;
	className?: string;
};

export function SectionHeading({ title, eyebrow, icon, iconClassName, aside, className }: SectionHeadingProps) {
	return (
		<div className={cn("flex items-end justify-between gap-3", className)}>
			<div className="flex min-w-0 flex-col">
				{eyebrow ? (
					<span className="font-mono text-label-mono uppercase tracking-wider text-tertiary dark:text-tertiary">{eyebrow}</span>
				) : null}
				<div className="flex items-center gap-2">
					{icon ? <Icon name={icon} className={cn("text-[18px] text-primary", iconClassName)} /> : null}
					<h2 className="font-headline text-headline-sm font-semibold text-on-surface">{title}</h2>
				</div>
			</div>
			{aside ? <div className="shrink-0 font-mono text-[11px] text-on-surface-variant">{aside}</div> : null}
		</div>
	);
}
