"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useFlash } from "@/lib/use-flash";

const DEFAULTS = { streak: 1.45, halation: 0.82, squeeze: 2, grain: true };
const SQUEEZES = [1.33, 1.5, 2] as const;
const BENCH_SAMPLES = 9;
const BENCH_INTERVAL_MS = 120;

export function ShaderSandbox() {
	const grainId = useId().replace(/:/g, "");
	const [streak, setStreak] = useState(DEFAULTS.streak);
	const [halation, setHalation] = useState(DEFAULTS.halation);
	const [squeeze, setSqueeze] = useState<number>(DEFAULTS.squeeze);
	const [grain, setGrain] = useState(DEFAULTS.grain);
	const [fps, setFps] = useState(120.1);
	const [benchLoad, setBenchLoad] = useState<number | null>(null);
	const benchmarking = benchLoad !== null;
	const result = useFlash<number>();
	const triggerResult = result.trigger;

	useEffect(() => {
		if (benchLoad === null) return;
		let raf = 0;
		let lastSample = performance.now();
		let count = 0;
		let best = 0;
		const tick = (now: number) => {
			if (now - lastSample >= BENCH_INTERVAL_MS) {
				lastSample = now;
				count++;
				const sample = 118 + Math.random() * 8 - benchLoad * 0.4;
				best = Math.max(best, sample);
				setFps(sample);
				if (count >= BENCH_SAMPLES) {
					setBenchLoad(null);
					triggerResult(Math.round(best));
					return;
				}
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [benchLoad, triggerResult]);

	function reset() {
		setStreak(DEFAULTS.streak);
		setHalation(DEFAULTS.halation);
		setSqueeze(DEFAULTS.squeeze);
		setGrain(DEFAULTS.grain);
		setFps(120.1);
	}

	const coreHeight = Math.max(1, Math.round((1.05 - halation) * 8));
	const ghostWidth = `${Math.round(45 + (squeeze - 1.33) * 45)}%`;

	return (
		<section className="flex flex-col gap-4 px-6 py-4 md:px-8">
			<div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl dark:border dark:border-primary/15">
				<div className="flex items-center justify-between bg-surface-container px-4 py-2.5 text-on-surface">
					<div className="flex items-center gap-2">
						<Icon name="memory" className="text-[16px] text-primary" />
						<span className="font-mono text-label-mono tracking-wider text-tertiary">RENDER_CANVAS_01</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1 font-mono text-[11px] text-on-surface-variant">
							<span className="h-2 w-2 rounded-full bg-emerald-400" />
							PIPELINE_OK
						</span>
						<button type="button" onClick={reset} title="Reset grade sketch" aria-label="Reset grade sketch" className="p-1 text-on-surface-variant transition-colors hover:text-primary">
							<Icon name="restart_alt" className="text-[16px]" />
						</button>
					</div>
				</div>

				<div className="relative flex h-64 w-full select-none items-center justify-center overflow-hidden bg-black md:h-96">
					<Image
						src="/media/lab/shader-city.jpg"
						alt="Night street frame used as the grade-sketch source"
						fill
						preload
						sizes="(min-width: 1152px) 1088px, 100vw"
						className="object-cover opacity-80 transition-transform duration-300"
						style={{ transform: `scaleX(${(1 + (2 - squeeze) * 0.18).toFixed(3)})` }}
					/>
					<div className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-150" style={{ opacity: Math.min(1, streak * 0.55) }}>
						<div className="flex h-full w-full flex-col items-center justify-center">
							<div className="w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[1px] transition-all" style={{ height: coreHeight }} />
							<div className="w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent blur-md transition-all" style={{ height: Math.round(streak * 48) }} />
							<div className="h-24 bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent blur-xl transition-all" style={{ width: ghostWidth }} />
						</div>
					</div>
					{grain ? (
						<svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40 mix-blend-overlay" aria-hidden="true">
							<filter id={grainId}>
								<feTurbulence baseFrequency="0.9" numOctaves={3} stitchTiles="stitch" type="fractalNoise" />
								<feColorMatrix type="saturate" values="0" />
							</filter>
							<rect width="100%" height="100%" filter={`url(#${grainId})`} />
						</svg>
					) : null}
					<div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-blue-300 backdrop-blur">
						<Icon name="aspect_ratio" className="text-[12px] text-sky-300" />
						{squeeze.toFixed(2)}x FRAME
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 bg-surface-container-high p-2 text-on-surface sm:grid-cols-4">
					<Telemetry label="Frame Time" value={`${(1000 / fps).toFixed(2)} ms`} className="text-primary" />
					<Telemetry label="GPU Compute" value={`${fps.toFixed(1)} FPS`} className="text-tertiary" />
					<Telemetry label="Buffer Memory" value="48.2 MB / 128 MB" />
					<Telemetry label="Pass Status" value={benchmarking ? "Sampling…" : "2/2 Complete"} className="text-primary" />
				</div>
			</div>

			<div className="flex flex-col gap-4 rounded-xl bg-surface-container p-4 shadow-md dark:border dark:border-primary/10">
				<div className="flex flex-wrap items-center justify-between gap-2 pb-1">
					<div className="flex items-center gap-2">
						<Icon name="tune" className="text-[18px] text-primary" />
						<h2 className="font-headline text-headline-sm font-semibold text-on-surface">Grade sketch controls</h2>
					</div>
					<button
						type="button"
						onClick={() => setBenchLoad(streak * 1.6 + (grain ? 1.2 : 0) + (1 - halation) * 4)}
						disabled={benchmarking}
						className="flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-1.5 font-mono text-[11px] text-tertiary shadow-sm transition-all hover:bg-surface-container-highest active:scale-95 disabled:opacity-70"
					>
						<Icon name="speed" className={cn("text-[14px]", benchmarking && "animate-spin")} />
						{benchmarking ? (
							"Benchmarking..."
						) : result.active ? (
							<span className={result.flashClassName} onAnimationEnd={result.onAnimationEnd}>
								Benchmark Run ({result.value} FPS)
							</span>
						) : (
							"Run Benchmark"
						)}
					</button>
				</div>

				<Slider
					id="streak"
					icon="flare"
					iconClass="text-primary"
					label="Streak"
					value={streak}
					min={0}
					max={2}
					step={0.05}
					onChange={setStreak}
					valueClass="text-primary"
					ticks={["0.0 (Suppressed)", "1.0 (Standard)", "2.0 (Extreme)"]}
				/>
				<Slider
					id="halation"
					icon="wb_iridescent"
					iconClass="text-tertiary"
					label="Halation"
					value={halation}
					min={0.5}
					max={1}
					step={0.01}
					onChange={setHalation}
					valueClass="text-tertiary"
					ticks={["0.50 (Deep Shadows)", "0.82 (Specular Core)", "1.00 (Clip Only)"]}
				/>

				<div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<span className="font-mono text-label-mono text-on-surface">Frame squeeze</span>
						<div role="radiogroup" aria-label="Squeeze ratio" className="grid grid-cols-3 gap-1.5 rounded-lg bg-surface-container-lowest p-1">
							{SQUEEZES.map((value) => (
								<button
									key={value}
									type="button"
									role="radio"
									aria-checked={squeeze === value}
									onClick={() => setSqueeze(value)}
									className={cn(
										"rounded py-1.5 text-center font-mono text-[11px] transition-colors",
										squeeze === value ? "bg-primary font-bold text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface",
									)}
								>
									{value.toFixed(2)}x
								</button>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<span className="font-mono text-label-mono text-on-surface">Grain</span>
						<button
							type="button"
							role="switch"
							aria-checked={grain}
							onClick={() => setGrain((g) => !g)}
							className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-2 transition-colors hover:bg-surface-container-high"
						>
							<span className="flex items-center gap-2">
								<Icon name="grain" className="text-[18px] text-primary" />
								<span className="font-sans text-body-dense font-medium text-on-surface">Pseudo-PRNG Dither</span>
							</span>
							<span
								className={cn(
									"rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase",
									grain ? "bg-primary-container text-on-primary" : "bg-surface-container-highest text-outline",
								)}
							>
								{grain ? "Active" : "Bypass"}
							</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

function Telemetry({ label, value, className }: { label: string; value: string; className?: string }) {
	return (
		<div className="flex flex-col rounded bg-surface-container px-2 py-1">
			<span className="font-mono text-[10px] uppercase text-on-surface-variant">{label}</span>
			<span className={cn("font-mono text-label-mono font-bold tabular-nums", className)}>{value}</span>
		</div>
	);
}

type SliderProps = {
	id: string;
	icon: string;
	iconClass: string;
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
	valueClass: string;
	ticks: [string, string, string];
};

function Slider({ id, icon, iconClass, label, value, min, max, step, onChange, valueClass, ticks }: SliderProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center justify-between gap-2">
				<label htmlFor={id} className="flex items-center gap-1.5 font-mono text-label-mono text-on-surface">
					<Icon name={icon} className={cn("text-[15px]", iconClass)} />
					{label}
				</label>
				<span className={cn("font-mono text-label-mono font-bold tabular-nums", valueClass)}>{value.toFixed(2)}</span>
			</div>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
				className="h-2 w-full cursor-pointer rounded-lg"
			/>
			<div className="flex justify-between font-mono text-[10px] text-outline">
				{ticks.map((tick) => (
					<span key={tick}>{tick}</span>
				))}
			</div>
		</div>
	);
}
