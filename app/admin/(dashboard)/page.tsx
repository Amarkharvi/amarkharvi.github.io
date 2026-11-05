"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLoading } from "@/components/admin/fields";
import { Icon } from "@/components/ui/icon";
import { loadJson, loadUploads } from "@/lib/admin/browser-store";
import { IS_STATIC_SITE } from "@/lib/is-static";
import { defaultFilms, defaultTechStack, type Film, type TechStackItem } from "@/lib/content-data";
import { defaultProducts, type Product } from "@/lib/products-data";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<{ films: number; products: number; skills: number; images: number; reels: number } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([loadJson<Film[]>("films", defaultFilms), loadJson<TechStackItem[]>("tech-stack", defaultTechStack), loadJson<Product[]>("products", defaultProducts), loadUploads()])
			.then(([films, techStack, products, media]) => {
				if (!live) return;
				const reels = media.filter((item) => item.kind === "video").length;
				setStats({ films: films.length, products: products.length, skills: techStack.length, images: media.length - reels, reels });
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load the dashboard.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!stats) return <AdminLoading />;

	const cards = [
		{ href: "/admin/media", icon: "perm_media", label: "Media Library", stat: `${stats.images} images · ${stats.reels} reels` },
		{ href: "/admin/films", icon: "movie", label: "Picture Work", stat: `${stats.films} cards on Cinema` },
		{ href: "/admin/about", icon: "portrait", label: "About Page", stat: "Profile photo, headline, bio" },
		{ href: "/admin/products", icon: "storefront", label: "LUT Shop", stat: `${stats.products} products` },
		{ href: "/admin/stack", icon: "terminal", label: "Stack & Credentials", stat: `${stats.skills} skill chips` },
		{ href: "/admin/site", icon: "tune", label: "Site Basics", stat: "Personas, showreel, socials" },
		{ href: "/admin/facts", icon: "psychology", label: "Facts", stat: "The short cards on every page" },
	];

	return (
		<div className="flex flex-col gap-5">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Dashboard</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					{IS_STATIC_SITE
						? "Saves commit to GitHub and the public site rebuilds from that commit."
						: "Edits here write to JSON files on this server and go live immediately — no redeploy needed."}
				</p>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
