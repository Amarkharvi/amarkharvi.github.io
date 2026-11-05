"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { navItems, site, subPageTitles } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

export function resolveTitle(pathname: string | null) {
	if (!pathname) return { title: site.name, parent: null as string | null };
	const sub = subPageTitles[pathname];
	if (sub) return { title: sub.title, parent: sub.parent };
	const item = navItems.find((nav) => nav.href === pathname);
	return { title: item?.title ?? "Not Found", parent: null as string | null };
}

export function isActive(pathname: string | null, href: string) {
	if (!pathname) return false;
	return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

type SiteHeaderProps = { tagline?: string; availability?: string };

export function SiteHeader({ tagline, availability }: SiteHeaderProps) {
	return <SiteHeaderView pathname={usePathname()} tagline={tagline} availability={availability} />;
}

export function SiteHeaderView({ pathname, tagline = site.tagline, availability = site.availability }: SiteHeaderProps & { pathname: string | null }) {
	const { title, parent } = resolveTitle(pathname);

	if (pathname?.startsWith("/admin")) return null;

	return (
		<header className="pt-safe fixed inset-x-0 top-0 z-50 bg-surface/92 shadow-[0_1px_8px_rgba(40,30,160,0.06)] backdrop-blur-md dark:border-b dark:border-primary/10 dark:bg-surface/88 dark:shadow-[0_4px_20px_rgba(3,7,18,0.6)]">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
				<div className="flex min-w-0 items-center gap-2">
					{parent ? (
						<Link
							href={parent}
							aria-label="Back"
							className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface transition-all hover:bg-surface-container-high active:scale-95"
						>
							<Icon name="arrow_back" className="text-[20px]" />
						</Link>
					) : null}
					<Link href="/" className="flex min-w-0 flex-col">
						<span className="truncate font-mono text-label-mono text-on-surface dark:text-primary">{tagline}</span>
						<span className="truncate font-headline text-headline-sm font-semibold tracking-tight text-on-surface">{title}</span>
					</Link>
				</div>

				<nav aria-label="Primary" className="hidden items-center gap-1 rounded-full bg-surface-container-high p-1 md:flex dark:border dark:border-primary/15 dark:bg-surface-container-low">
					{navItems.map((item) => {
						const active = isActive(pathname, item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 font-sans text-label-pill font-bold transition-all",
									active
										? "bg-surface-container-lowest text-primary shadow-sm dark:bg-primary dark:text-on-primary dark:shadow-glow"
										: "text-on-surface-variant hover:text-on-surface",
								)}
							>
								<Icon name={item.icon} className="text-[16px]" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="flex shrink-0 items-center gap-2">
					<div className="hidden items-center gap-1.5 rounded-full sm:inline-flex md:hidden lg:inline-flex bg-surface-container-high px-2.5 py-1 dark:border dark:border-primary/20 dark:bg-surface-container">
						<span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed-dim dark:shadow-[0_0_8px_#38bdf8]" />
						<span className="font-mono text-[11px] text-on-surface-variant dark:text-tertiary-fixed">{availability}</span>
					</div>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
