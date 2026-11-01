"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const FPS = 24;
const START_FRAME = (2 * 60 + 41) * FPS + 18;

function formatTimecode(totalFrames: number) {
	const frames = totalFrames % FPS;
	const totalSeconds = Math.floor(totalFrames / FPS);
	const seconds = totalSeconds % 60;
	const minutes = Math.floor(totalSeconds / 60) % 60;
	const hours = Math.floor(totalSeconds / 3600);
	return [hours, minutes, seconds, frames].map((n) => String(n).padStart(2, "0")).join(":");
}

function createRainAmbience(ctx: AudioContext) {
	const length = ctx.sampleRate * 4;
	const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
	for (let channel = 0; channel < 2; channel++) {
		const data = buffer.getChannelData(channel);
		let last = 0;
		for (let i = 0; i < length; i++) {
			const white = Math.random() * 2 - 1;
			last = (last + 0.02 * white) / 1.02;
			data[i] = last * 3.2 + white * 0.04;
		}
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	source.loop = true;
	const filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = 1400;
	const gain = ctx.createGain();
	gain.gain.value = 0.35;
	source.connect(filter).connect(gain).connect(ctx.destination);
	source.start();
	return { source, gain };
}

export function ReelPlayer() {
	const [playing, setPlaying] = useState(false);
	const [frame, setFrame] = useState(START_FRAME);
	const [soundOn, setSoundOn] = useState(false);
	const frameRef = useRef(START_FRAME);
	const audioRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);

	useEffect(() => {
		if (!playing) return;
		let raf = 0;
		let origin: number | null = null;
		const base = frameRef.current;
		const tick = (now: number) => {
			if (origin === null) origin = now;
			const next = base + Math.floor(((now - origin) / 1000) * FPS);
			if (next !== frameRef.current) {
				frameRef.current = next;
				setFrame(next);
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [playing]);

	useEffect(() => {
		return () => {
			audioRef.current?.ctx.close();
		};
	}, []);

	async function toggleSound() {
		if (!audioRef.current) {
			const ctx = new AudioContext();
			const { gain } = createRainAmbience(ctx);
			audioRef.current = { ctx, gain };
			setSoundOn(true);
			return;
		}
		const { ctx } = audioRef.current;
		if (ctx.state === "running") {
			await ctx.suspend();
			setSoundOn(false);
		} else {
			await ctx.resume();
			setSoundOn(true);
		}
	}

	return (
		<div id="reel" className="relative flex aspect-video w-full scroll-mt-24 flex-col justify-between overflow-hidden rounded-xl bg-inverse-surface p-2 shadow-xl">
			<Image
				src="/media/work/quiet-moments-train.png"
				alt="Showreel still — window light on a seated figure"
				fill
				preload
				sizes="(min-width: 1024px) 900px, 100vw"
				className={cn("object-cover opacity-90 transition-transform ease-linear", playing ? "scale-110 duration-[20s]" : "scale-100 duration-700")}
			/>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-black/80" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-black/80" />

			<div className="relative z-10 flex items-center justify-between px-1 pt-3">
				<div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-white backdrop-blur-md">
					<span className={cn("h-2 w-2 rounded-full", playing ? "animate-pulse bg-red-500" : "bg-secondary-container dark:bg-tertiary")} />
					<span className="font-mono text-label-mono tabular-nums">{formatTimecode(frame)}</span>
				</div>
				<span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-md">2.39:1 SCOPE</span>
			</div>

			<div className="relative z-10 my-auto flex items-center justify-center">
				<button
					type="button"
					onClick={() => setPlaying((p) => !p)}
					aria-label={playing ? "Pause showreel" : "Play showreel"}
					className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-lowest/90 text-primary shadow-lg backdrop-blur-md transition-all hover:bg-surface-container-lowest active:scale-95 dark:shadow-glow"
				>
					<Icon name={playing ? "pause" : "play_arrow"} className="text-[32px]" filled />
				</button>
			</div>

			<div className="relative z-10 mb-3 flex items-center justify-between rounded-lg bg-black/65 px-2.5 py-1.5 text-white backdrop-blur-md">
				<div className="flex min-w-0 items-center gap-1.5">
					<Icon name="headphones" className="text-[16px] text-secondary-container dark:text-tertiary" />
					<span className="truncate font-mono text-[11px]">Soft room tone</span>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<button
						type="button"
						onClick={toggleSound}
						aria-pressed={soundOn}
						aria-label={soundOn ? "Mute ambience" : "Play ambience"}
						className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:text-secondary-container dark:hover:text-tertiary"
					>
						<Icon name={soundOn ? "volume_up" : "volume_off"} className="text-[16px]" />
					</button>
					<span className="font-mono text-[10px] text-white/60">L/R STEREO</span>
				</div>
			</div>
		</div>
	);
}
