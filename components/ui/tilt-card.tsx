"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ComponentPropsWithoutRef, PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/cn";

const spring = { stiffness: 280, damping: 28, mass: 0.45 };

// Motion redefines onDrag*/onAnimationStart with its own gesture signatures, which conflicts with
// React's native DOM event types for the same prop names — omit them since this wrapper doesn't
// forward drag/animation callbacks anyway.
type NativeDivProps = Omit<ComponentPropsWithoutRef<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">;

type TiltCardProps = NativeDivProps & {
	/** Render as a semantic `<article>` instead of `<div>` for card grids. */
	as?: "div" | "article";
	/** Max tilt in degrees-ish. Keep small — this reads as "premium", not a gimmick. */
	strength?: number;
};

/**
 * Wraps content in a subtle, pointer-tracked 3D tilt. Mouse/trackpad only: touch and
 * `prefers-reduced-motion` both fall back to a flat, static card. Driven entirely by the
 * element's own pointer events (no document/window listeners, no Observer, no timers) through
 * spring-smoothed motion values.
 */
export function TiltCard({ as = "div", strength = 8, className, children, onPointerMove, onPointerEnter, onPointerLeave, ...rest }: TiltCardProps) {
	const reduceMotion = useReducedMotion();
	const rotateX = useSpring(0, spring);
	const rotateY = useSpring(0, spring);
	const scale = useSpring(1, spring);

	function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
		if (!reduceMotion && event.pointerType === "mouse") {
			const rect = event.currentTarget.getBoundingClientRect();
			const px = (event.clientX - rect.left) / rect.width - 0.5;
			const py = (event.clientY - rect.top) / rect.height - 0.5;
			rotateY.set(px * strength * 2);
			rotateX.set(py * -strength * 2);
		}
		onPointerMove?.(event);
	}

	function handlePointerEnter(event: ReactPointerEvent<HTMLDivElement>) {
		if (!reduceMotion && event.pointerType === "mouse") scale.set(1.015);
		onPointerEnter?.(event);
	}

	function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
		rotateX.set(0);
		rotateY.set(0);
		scale.set(1);
		onPointerLeave?.(event);
	}

	const MotionTag = as === "article" ? motion.article : motion.div;

	return (
		<MotionTag
			{...rest}
			onPointerMove={handlePointerMove}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			style={{ rotateX, rotateY, scale, transformPerspective: 900 }}
			className={cn("will-change-transform [transform-style:preserve-3d]", className)}
		>
			{children}
		</MotionTag>
	);
}
