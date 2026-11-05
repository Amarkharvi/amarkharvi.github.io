"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type SmartVideoProps = {
	src: string;
	poster: string;
	alt?: string;
	className?: string;
	sizes?: string;
	/** When true, the clip starts after the poster paints (hero use). Otherwise it waits for hover. */
	autoPlay?: boolean;
	preloadImage?: boolean;
};

/**
 * Poster first, video second. Heroes fade the clip in once it can play; cards keep the
 * file unloaded (`preload="none"`) until hover so the page isn't fighting several reels.
 */
export function SmartVideo({
	src,
	poster,
	alt = "",
	className,
	sizes = "(min-width: 768px) 50vw, 100vw",
	autoPlay = false,
	preloadImage = false,
}: SmartVideoProps) {
	const [clipReady, setClipReady] = useState(false);
	const [mountClip, setMountClip] = useState(autoPlay);

	return (
		<div
			className="absolute inset-0"
			onPointerEnter={(event) => {
				if (autoPlay || event.pointerType !== "mouse") return;
				setMountClip(true);
			}}
		>
			<Image
				src={poster}
				alt={alt}
				fill
				preload={preloadImage || undefined}
				sizes={sizes}
				className={cn(className, "object-cover")}
			/>
			{mountClip ? (
				<video
					src={src}
					poster={poster}
					muted
					loop
					playsInline
					autoPlay={autoPlay}
					preload={autoPlay ? "auto" : "none"}
					onPlaying={() => setClipReady(true)}
					onLoadedData={(event) => {
						if (!autoPlay) event.currentTarget.play().catch(() => {});
					}}
					onPointerLeave={(event) => {
						if (autoPlay) return;
						event.currentTarget.pause();
						event.currentTarget.currentTime = 0;
						setClipReady(false);
					}}
					className={cn(
						className,
						"object-cover transition-opacity duration-500",
						autoPlay ? (clipReady ? "opacity-100" : "opacity-0") : "opacity-0 group-hover:opacity-100",
					)}
				/>
			) : null}
		</div>
	);
}
