"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Film } from "@/lib/content-data";
import { scrollToTarget } from "@/lib/scroll-to";
import { FilmCard, FilmSection, filmFrames } from "./film-card";

function subscribe(onChange: () => void) {
	window.addEventListener("hashchange", onChange);
	window.addEventListener("popstate", onChange);
	return () => {
		window.removeEventListener("hashchange", onChange);
		window.removeEventListener("popstate", onChange);
	};
}

const readHash = () => decodeURIComponent(window.location.hash.slice(1));

/** Picture work with a sticky section bar. The active section lives in the URL hash
 * (`/cinema#portraits`), so links from other pages and the back button land on it. */
export function CinemaBrowser({ films, youtubeHref, instagramHref }: { films: Film[]; youtubeHref?: string; instagramHref?: string }) {
	const hash = useSyncExternalStore(subscribe, readHash, () => "");
	const topRef = useRef<HTMLDivElement>(null);
	const lenis = useLenis();
	const activeIndex = films.findIndex((film) => film.slug === hash);
	const active = activeIndex >= 0 ? films[activeIndex] : null;

	useEffect(() => {
		if (films.some((film) => film.slug === readHash()) && topRef.current) {
			scrollToTarget(lenis, topRef.current, { immediate: true });
		}
	}, [films, lenis]);

	function select(slug: string | null) {
		window.history.pushState(null, "", slug ? `#${slug}` : `${window.location.pathname}${window.location.search}`);
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		if (topRef.current) scrollToTarget(lenis, topRef.current);
	}

	const tabs = [{ slug: null as string | null, label: "All work", index: "", count: films.length, cover: "" }].concat(
		films.map((film) => ({ slug: film.slug, label: film.title, index: film.index, count: filmFrames(film).length, cover: film.cover })),
	);

	return (
		<section aria-label="Picture work" className="flex flex-col gap-4">
			<div ref={topRef} className="scroll-mt-16" />
			<div className="sticky top-16 z-30 -mx-5 bg-surface/94 px-5 py-2.5 backdrop-blur-md md:-mx-8 md:px-8 dark:bg-surface/90">
				<div role="tablist" aria-label="Cinema sections" data-lenis-prevent className="no-scrollbar flex gap-2 overflow-x-auto">
					{tabs.map((tab) => {
						const selected = (tab.slug ?? null) === (active?.slug ?? null);
						return (
							<button
								key={tab.slug ?? "all"}
								type="button"
								role="tab"
								aria-selected={selected}
								onClick={() => select(tab.slug)}
								className={cn(
									"flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-3.5 font-sans text-label-pill font-bold transition-all",
									selected
										? "bg-secondary text-on-secondary shadow-md dark:bg-primary dark:text-on-primary dark:shadow-glow"
										: "bg-surface-container text-on-surface-variant ring-1 ring-outline-variant/50 hover:bg-surface-container-high hover:text-on-surface dark:ring-primary/15",
								)}
							>
								{tab.cover ? (
									<span className="relative h-7 w-7 overflow-hidden rounded-full">
										<Image src={tab.cover} alt="" fill sizes="28px" className="object-cover" />
									</span>
								) : (
									<span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
										<Icon name="grid_view" className="text-[16px]" />
									</span>
								)}
								{tab.label}
								<span className={cn("font-mono text-[10px]", selected ? "opacity-80" : "text-outline")}>{tab.count}</span>
							</button>
						);
					})}
				</div>
			</div>

			{active ? (
				<FilmSection
					key={active.slug}
					film={active}
					total={films.length}
					prev={films.length > 1 ? films[(activeIndex - 1 + films.length) % films.length] : null}
					next={films.length > 2 ? films[(activeIndex + 1) % films.length] : null}
					onSelect={select}
					youtubeHref={youtubeHref}
					instagramHref={instagramHref}
				/>
			) : (
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					{films.map((film) => (
						<FilmCard key={film.slug} film={film} onOpen={() => select(film.slug)} />
					))}
				</div>
			)}
		</section>
	);
}
