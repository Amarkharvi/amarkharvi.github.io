"use client";

import { motion, type Transition } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

const transition: Transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

// Motion redefines onDrag*/onAnimationStart with its own gesture signatures, which conflicts with
// React's native DOM event types for the same prop names — omit them since this wrapper doesn't
// forward drag/animation callbacks anyway.
type NativeDivProps = Omit<ComponentPropsWithoutRef<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">;

type RevealProps = NativeDivProps & {
	/** Render as a semantic `<section>` instead of `<div>` when this wraps a whole page section. */
	as?: "div" | "section";
	/** Stagger multiple reveals by passing an increasing delay (seconds). */
	delay?: number;
	/** Starting vertical offset in px. */
	y?: number;
};

/**
 * Fades + slides content in once it scrolls into view. Uses Motion's `whileInView`, which watches
 * the element itself against the real viewport (one IntersectionObserver per instance, default
 * root — never `document`), and animates once per element (`viewport={{ once: true }}`).
 */
export function Reveal({ as = "div", delay = 0, y = 20, className, children, ...rest }: RevealProps) {
	const MotionTag = as === "section" ? motion.section : motion.div;

	return (
		<MotionTag
			{...rest}
			className={className}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
			transition={{ ...transition, delay }}
		>
			{children}
		</MotionTag>
	);
}
