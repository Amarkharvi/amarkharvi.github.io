"use client";

import type Lenis from "lenis";

/** Space under the fixed header so scrolled targets don't sit behind it. */
export const SCROLL_HEADER_OFFSET = -80;

/**
 * Scroll with Lenis when it is running, otherwise fall back to the browser.
 * Native `scrollIntoView({ behavior: "smooth" })` fights Lenis and feels stuttery.
 */
export function scrollToTarget(
	lenis: Lenis | undefined,
	target: string | number | HTMLElement,
	options: { offset?: number; immediate?: boolean; duration?: number } = {},
) {
	const { offset = SCROLL_HEADER_OFFSET, immediate = false, duration } = options;
	if (lenis) {
		lenis.scrollTo(target, { offset, immediate, duration, programmatic: true });
		return;
	}
	if (typeof target === "number") {
		window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
		return;
	}
	const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
	el?.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
}
