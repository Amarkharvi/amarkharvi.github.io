"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Site-wide smooth scrolling. Root mode attaches Lenis to `window`/`<html>` (no wrapper divs),
 * so sticky headers, the bottom nav, and `<dialog>` keep working. Nested strips marked with
 * `data-lenis-prevent` keep their own native scroll. Honors `prefers-reduced-motion` on its own.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
	return (
		<ReactLenis
			root
			options={{
				autoRaf: true,
				// Slightly under the default so the glide is softer without feeling late.
				lerp: 0.085,
				wheelMultiplier: 0.9,
				touchMultiplier: 1.05,
				anchors: true,
				// Native touch inertia; only the wheel is smoothed. Syncing touch often feels laggy on phones.
				syncTouch: false,
			}}
		>
			{children}
		</ReactLenis>
	);
}
