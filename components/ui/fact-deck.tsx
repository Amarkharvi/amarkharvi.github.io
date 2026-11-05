"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Fact } from "@/lib/facts-data";

/** How long one fact stays before the next one takes its place. */
const DWELL_MS = 9000;

/**
 * One fact at a time. It advances on its own, and the arrows still move it by hand.
 * The dwell is a Web Animation, so pausing freezes the same clock the advance uses.
 */
export function FactDeck({ label, note, facts }: { label: string; note?: string; facts: Fact[] }) {
	const [index, setIndex] = useState(0);
	const [userPaused, setUserPaused] = useState(false);
	const [motionOk, setMotionOk] = useState(true);
	const barRef = useRef<HTMLDivElement>(null);
	const animRef = useRef<Animation | null>(null);
	const holdRef = useRef({ user: false, pointer: false });
	const fact = facts[index] ?? facts[0];
	const cycling = motionOk && facts.length > 1;

	function pausedNow() {
		return holdRef.current.user || holdRef.current.pointer || document.hidden;
	}

	function sync() {
		const anim = animRef.current;
		if (!anim) return;
		if (pausedNow()) anim.pause();
		else anim.play();
	}

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => setMotionOk(!media.matches);
		apply();
		media.addEventListener("change", apply);
		return () => media.removeEventListener("change", apply);
	}, []);

	useEffect(() => {
		const bar = barRef.current;
		if (!bar || !cycling) return;

		const anim = bar.animate([{ width: "0%" }, { width: "100%" }], {
			duration: DWELL_MS,
			easing: "linear",
			fill: "forwards",
		});
		animRef.current = anim;
		if (pausedNow()) anim.pause();

		let stopped = false;
		const advance = () => {
			if (!stopped) setIndex((current) => (current + 1) % facts.length);
		};
		anim.addEventListener("finish", advance);

		const onVisibility = () => sync();
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			stopped = true;
			anim.removeEventListener("finish", advance);
			document.removeEventListener("visibilitychange", onVisibility);
			anim.cancel();
			if (animRef.current === anim) animRef.current = null;
		};
		// sync and pausedNow read refs, so they stay current without retriggering the dwell.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index, facts.length, cycling]);

	function step(direction: -1 | 1) {
		setIndex((current) => (current + direction + facts.length) % facts.length);
	}

	if (!fact) return null;

	return (
		<aside
			onPointerEnter={(event) => {
				if (event.pointerType !== "mouse") return;
				holdRef.current.pointer = true;
				sync();
			}}
			onPointerLeave={(event) => {
				if (event.pointerType !== "mouse") return;
				holdRef.current.pointer = false;
				sync();
			}}
			className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-5 shadow-card ring-1 ring-outline-variant/40 dark:bg-surface-container dark:ring-primary/15"
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed">
						<Icon name="psychology" className="text-[18px]" />
					</span>
					<span className="font-mono text-[11px] font-bold uppercase tracking-widest text-tertiary">{label}</span>
				</div>
				{facts.length > 1 ? (
					<span className="font-mono text-[11px] text-on-surface-variant">
						{String(index + 1).padStart(2, "0")} / {String(facts.length).padStart(2, "0")}
					</span>
				) : null}
			</div>
			{note ? <p className="font-sans text-[12px] leading-relaxed text-on-surface-variant">{note}</p> : null}
			<p className="font-sans text-body-default leading-relaxed text-on-surface-variant">
				<span className="font-semibold text-on-surface">{fact.title} </span>
				{fact.body}
			</p>
			{cycling ? (
				<div className="h-1 overflow-hidden rounded-full bg-surface-container-high">
					<div ref={barRef} className="h-full w-0 bg-tertiary" />
				</div>
			) : null}
			{facts.length > 1 ? (
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => step(-1)}
						aria-label="Previous fact"
						className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high"
					>
						<Icon name="arrow_back" className="text-[18px]" />
					</button>
					<button
						type="button"
						onClick={() => step(1)}
						aria-label="Next fact"
						className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-label-pill font-bold text-on-primary transition-all hover:brightness-110 active:scale-[0.98]"
					>
						Next fact
						<Icon name="arrow_forward" className="text-[16px]" />
					</button>
					{cycling ? (
						<button
							type="button"
							aria-pressed={userPaused}
							aria-label={userPaused ? "Resume facts" : "Pause facts"}
							onClick={() => {
								const next = !holdRef.current.user;
								holdRef.current.user = next;
								setUserPaused(next);
								sync();
							}}
							className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high"
						>
							<Icon name={userPaused ? "play_arrow" : "pause"} className="text-[18px]" />
						</button>
					) : null}
				</div>
			) : null}
		</aside>
	);
}
