import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/fields";
import { Icon } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { getFilms, getTechStack } from "@/lib/content";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminDashboardPage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<DashboardContent />
		</Suspense>
	);
}

// Reads the session and uses its data in the same component — see app/admin/(dashboard)/layout.tsx
// for why the check and the fetch can't live in separate places.
async function DashboardContent() {
	await requireAdmin();

	const [films, techStack, products, media] = await Promise.all([getFilms(), getTechStack(), getProducts(), listMedia()]);
	const reels = media.filter((item) => item.kind === "video").length;
	const images = media.length - reels;

	const cards = [
		{ href: "/admin/media", icon: "perm_media", label: "Media Library", stat: `${images} images · ${reels} reels` },
		{ href: "/admin/films", icon: "movie", label: "Picture Work", stat: `${films.length} cards on Cinema` },
		{ href: "/admin/about", icon: "portrait", label: "About Page", stat: "Profile photo, headline, bio" },
		{ href: "/admin/products", icon: "storefront", label: "LUT Shop", stat: `${products.length} products` },
		{ href: "/admin/stack", icon: "terminal", label: "Stack & Credentials", stat: `${techStack.length} skill chips` },
		{ href: "/admin/site", icon: "tune", label: "Site Basics", stat: "Tagline, availability, socials" },
	];

	return (
		<div className="flex flex-col gap-5">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Dashboard</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">Edits here write to JSON files on this server and go live immediately — no redeploy needed.</p>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{cards.map((card) => (
					<Link
						key={card.href}
						href={card.href}
						className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-4 shadow-card transition-all hover:bg-surface-container active:scale-[0.99] dark:border dark:border-primary/10"
					>
						<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary dark:shadow-glow">
							<Icon name={card.icon} className="text-[20px]" />
						</span>
						<div className="min-w-0">
							<p className="font-headline text-[15px] font-semibold text-on-surface">{card.label}</p>
							<p className="truncate font-sans text-[12px] text-on-surface-variant">{card.stat}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
