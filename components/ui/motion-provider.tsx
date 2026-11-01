"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide Motion config. `reducedMotion="user"` makes every `<Reveal>` / `<TiltCard>` below
 * automatically respect the OS-level "prefers-reduced-motion" setting, so individual components
 * don't each need their own check.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
	return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
