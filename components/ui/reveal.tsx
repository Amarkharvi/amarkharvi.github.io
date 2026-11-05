"use client";

import { motion, type Transition } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

const transition: Transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

// Motion redefines onDrag*/onAnimationStart with its own gesture signatures, which conflicts with
// React's native DOM event types for the same prop names — omit them since this wrapper doesn't
// forward drag/animation callbacks anyway.
type NativeDivProps = Omit<ComponentPropsWithoutRef<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">;

type RevealProps = NativeDivProps & {
	/** Render as a semantic `<section>` instead of `<div>` when this wraps a whole page section. */
	as?: "div" | "section";
	/** Stagger multiple reveals by passing an increasing delay (seconds). */
	delay?: number;
	/** Starting vertical offset in px. Keep small — large offsets fight Lenis while scrolling. */
	y?: number;
};

/**
 * Fades + slides content in once it scrolls into view. Transform + opacity only (composited),
 * once per element, with a shallow start offset so the motion doesn't stutter under Lenis.
 */
export function Reveal({ as = "div", delay = 0, y = 12, className, children, ...rest }: RevealProps) {
	const MotionTag = as === "section" ? motion.section : motion.div;

	return (
		<MotionTag
			{...rest}
			className={className}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
			transition={{ ...transition, delay }}
		>
			{children}
		</MotionTag>
	);
}
