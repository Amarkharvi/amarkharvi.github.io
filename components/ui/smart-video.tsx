"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type SmartVideoProps = {
	src: string;
	poster: string;
	alt?: string;
	className?: string;
	sizes?: string;
	/** When true, the clip plays as soon as it can (hero use). Otherwise it waits for hover. */
	autoPlay?: boolean;
	preloadImage?: boolean;
};

/**
 * Poster first for a fast first paint. Heroes keep the video visible and start it the moment
 * data arrives; cards leave the file unloaded until hover.
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
	const videoRef = useRef<HTMLVideoElement>(null);
	const [mountClip, setMountClip] = useState(autoPlay);

	function startPlayback(clip: HTMLVideoElement) {
		clip.muted = true;
		const attempt = clip.play();
		if (attempt) attempt.catch(() => {});
	}

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
					ref={videoRef}
					src={src}
					poster={poster}
					muted
					loop
					playsInline
					autoPlay={autoPlay}
					preload={autoPlay ? "auto" : "none"}
					onLoadedData={(event) => startPlayback(event.currentTarget)}
					onCanPlay={(event) => startPlayback(event.currentTarget)}
					onPointerLeave={(event) => {
						if (autoPlay) return;
						event.currentTarget.pause();
						event.currentTarget.currentTime = 0;
					}}
					className={cn(
						className,
						"object-cover",
						autoPlay ? "opacity-100" : "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
					)}
				/>
			) : null}
		</div>
	);
}
