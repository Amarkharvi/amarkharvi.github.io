"use client";

import { ReactLenis } from "lenis/react";

/**
 * Site-wide smooth scrolling. Renders no DOM of its own (`root` mode attaches Lenis straight to
 * `window`/`<html>`, no wrapper divs), so sticky headers, the bottom nav, and `<dialog>` all keep
 * working untouched. Lenis drives itself on `requestAnimationFrame` (no timers) and, by default,
 * honors `prefers-reduced-motion` on its own — smoothing drops out and scroll tracks 1:1 input.
 */
export function SmoothScroll() {
	return <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1 }} />;
}
