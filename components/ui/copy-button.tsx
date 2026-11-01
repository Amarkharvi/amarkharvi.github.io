"use client";

import type { ReactNode } from "react";
import { copyText } from "@/lib/browser";
import { cn } from "@/lib/cn";
import { useFlash } from "@/lib/use-flash";
import { Icon } from "./icon";

type CopyButtonProps = {
	text: string;
	label?: ReactNode;
	copiedLabel?: ReactNode;
	className?: string;
	activeClassName?: string;
	iconClassName?: string;
	ariaLabel?: string;
};

export function CopyButton({
	text,
	label = "Copy",
	copiedLabel = "Copied!",
	className,
	activeClassName,
	iconClassName = "text-[16px]",
	ariaLabel,
}: CopyButtonProps) {
	const { active, trigger, flashClassName, onAnimationEnd } = useFlash();

	return (
		<button
			type="button"
			aria-label={ariaLabel}
			onClick={async () => {
				if (await copyText(text)) trigger(true);
			}}
			className={cn("inline-flex items-center justify-center gap-1.5 transition-all active:scale-95", className, active && activeClassName)}
		>
			<Icon name={active ? "check" : "content_copy"} className={iconClassName} />
			{label !== null ? (
				<span aria-live="polite" className={flashClassName} onAnimationEnd={onAnimationEnd}>
					{active ? copiedLabel : label}
				</span>
			) : (
				<span aria-live="polite" className={cn("sr-only", flashClassName)} onAnimationEnd={onAnimationEnd}>
					{active ? "Copied" : ""}
				</span>
			)}
		</button>
	);
}
