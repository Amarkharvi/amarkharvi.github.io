"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { navItems } from "@/lib/site";
import { isActive } from "./site-header";

export function BottomNav() {
	return <BottomNavView pathname={usePathname()} />;
}

export function BottomNavView({ pathname }: { pathname: string | null }) {
	if (pathname?.startsWith("/admin")) return null;

	return (
		<nav
			aria-label="Primary"
			className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface/94 shadow-[0_-1px_12px_rgba(40,30,160,0.06)] backdrop-blur-md md:hidden dark:border-t dark:border-primary/10 dark:bg-surface/90 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
		>
			<div className="flex h-16 items-center justify-around px-1">
				{navItems.map((item) => {
					const active = isActive(pathname, item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 transition-colors",
								active ? "font-bold text-primary" : "text-on-surface-variant hover:text-on-surface",
							)}
						>
							<Icon
								name={item.icon}
								filled={active}
								className={cn("text-[22px]", active && "dark:drop-shadow-[0_0_6px_rgba(123,108,255,0.6)]")}
							/>
							<span className="whitespace-nowrap font-sans text-[10px] font-bold leading-none">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
