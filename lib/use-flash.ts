"use client";

import { useCallback, useState, type AnimationEvent } from "react";

/**
 * Transient UI feedback ("Copied!", "Sent") whose lifetime is driven by the
 * `animate-flash-hold` CSS animation: put `flashClassName` and `onAnimationEnd`
 * on the element that shows the feedback; the state clears when it ends.
 */
export function useFlash<T = true>() {
	const [value, setValue] = useState<T | null>(null);

	const trigger = useCallback((next: T) => setValue(next), []);
	const clear = useCallback(() => setValue(null), []);

	const onAnimationEnd = useCallback((event: AnimationEvent<HTMLElement>) => {
		if (event.target === event.currentTarget && event.animationName === "flash-hold") {
			setValue(null);
		}
	}, []);

	return {
		value,
		active: value !== null,
		trigger,
		clear,
		flashClassName: value === null ? "" : "animate-flash-hold",
		onAnimationEnd,
	};
}
