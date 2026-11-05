"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { signOut } from "@/lib/admin/browser-store";

const sections = [
	{ href: "/admin", label: "Dashboard", icon: "dashboard" },
	{ href: "/admin/media", label: "Media Library", icon: "perm_media" },
	{ href: "/admin/films", label: "Picture Work", icon: "movie" },
	{ href: "/admin/about", label: "About Page", icon: "portrait" },
	{ href: "/admin/products", label: "LUT Shop", icon: "storefront" },
	{ href: "/admin/stack", label: "Stack & Credentials", icon: "terminal" },
	{ href: "/admin/site", label: "Site Basics", icon: "tune" },
	{ href: "/admin/facts", label: "Facts", icon: "psychology" },
];

export function AdminNav() {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<header className="sticky top-0 z-40 flex flex-col gap-2 border-b border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur-xl md:px-6">
			<div className="flex items-center justify-between gap-3">
				<Link href="/admin" className="flex min-w-0 items-center gap-2">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary dark:shadow-glow">
						<Icon name="admin_panel_settings" className="text-[18px]" />
					</span>
					<span className="truncate font-headline text-[15px] font-semibold text-on-surface">Dual Persona Admin</span>
				</Link>
				<div className="flex shrink-0 items-center gap-2">
					<Link
						href="/"
						target="_blank"
						aria-label="View site"
						className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:text-on-surface"
					>
						<Icon name="open_in_new" className="text-[14px]" />
						<span className="hidden min-[400px]:inline">View site</span>
					</Link>
					<button
						type="button"
						onClick={async () => {
							await signOut();
							router.push("/admin/login");
						}}
						aria-label="Sign out"
						className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:text-on-surface"
					>
						<Icon name="logout" className="text-[14px]" />
						<span className="hidden min-[400px]:inline">Sign out</span>
					</button>
				</div>
			</div>
			<nav aria-label="Admin sections" className="-mx-1 flex gap-1 overflow-x-auto pb-1">
				{sections.map((section) => {
					const active = pathname === section.href;
					return (
						<Link
							key={section.href}
							href={section.href}
							className={cn(
								"flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-label-pill font-bold transition-colors",
								active ? "bg-primary text-on-primary dark:shadow-glow" : "bg-surface-container text-on-surface-variant hover:text-on-surface",
							)}
						>
							<Icon name={section.icon} className="text-[15px]" />
							{section.label}
						</Link>
					);
				})}
			</nav>
		</header>
	);
}
