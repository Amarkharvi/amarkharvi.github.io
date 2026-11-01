"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Grade = "logc" | "kodak";

const grades: Record<Grade, { label: string; profile: string; filter: string }> = {
	logc: {
		label: "Flat capture",
		profile: "PROFILE: FLAT // BEFORE THE GRADE",
		filter: "contrast(0.75) brightness(1.25) saturate(0.5)",
	},
	kodak: {
		label: "Finished reel grade",
		profile: "PROFILE: FEED GRADE // STILLS MATCHED TO MOTION",
		filter: "contrast(1.1) saturate(1.25) sepia(0.08)",
	},
};

export function GradeComparison() {
	const [grade, setGrade] = useState<Grade>("kodak");
	const [split, setSplit] = useState(100);

	return (
		<div className="flex w-full flex-col gap-3 rounded-lg bg-surface-container p-3 shadow-md dark:border dark:border-primary/10">
			<div role="tablist" aria-label="Color pipeline" className="flex items-center justify-between rounded-md bg-surface-container-lowest p-1">
				{(Object.keys(grades) as Grade[]).map((id) => (
					<button
						key={id}
						type="button"
						role="tab"
						aria-selected={grade === id}
						onClick={() => {
							setGrade(id);
							setSplit(100);
						}}
						className={cn(
							"flex-1 rounded px-3 py-1.5 text-center font-mono text-[11px] uppercase tracking-wider transition-all",
							grade === id ? "bg-primary-container font-bold text-on-primary shadow dark:bg-primary" : "text-on-surface-variant hover:text-on-surface",
						)}
					>
						{grades[id].label}
					</button>
				))}
			</div>

			<div className="relative aspect-video w-full overflow-hidden rounded bg-surface-container-lowest">
				<Image
					src="/media/study/quiet-moments-hero.png"
					alt="Grade comparison on a window-light reference frame"
					fill
					sizes="(min-width: 1024px) 900px, 100vw"
					className="object-cover transition-[filter] duration-500 ease-in-out"
					style={{ filter: grades[grade].filter }}
				/>
				{split < 100 ? (
					<div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
						<Image
							src="/media/study/quiet-moments-hero.png"
							alt=""
							fill
							sizes="(min-width: 1024px) 900px, 100vw"
							className="object-cover"
							style={{ filter: grades[grade === "kodak" ? "logc" : "kodak"].filter }}
						/>
						<span className="absolute inset-y-0 w-px bg-white/80" style={{ left: `${split}%` }} />
					</div>
				) : null}
				<span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-tertiary-fixed backdrop-blur-md">
					{grades[grade].profile}
				</span>
				<span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-md">
					HALATION: 1.4px RADIUS @ 650nm
				</span>
			</div>

			<label className="flex items-center gap-3 font-mono text-[10px] uppercase text-outline">
				<span className="shrink-0">Wipe compare</span>
				<input
					type="range"
					min={0}
					max={100}
					value={split}
					onChange={(event) => setSplit(Number(event.target.value))}
					className="h-2 w-full cursor-pointer"
					aria-label="Before/after wipe position"
				/>
			</label>

			<div className="grid grid-cols-2 gap-2">
				<div className="flex flex-col gap-1 rounded bg-surface-container-low p-2">
					<span className="font-mono text-[10px] uppercase text-outline">Halation Response</span>
					<span className="font-sans text-[12px] text-on-surface">Red fringe flare in rim hair reflections</span>
				</div>
				<div className="flex flex-col gap-1 rounded bg-surface-container-low p-2">
					<span className="font-mono text-[10px] uppercase text-outline">Toe &amp; Shoulder</span>
					<span className="font-sans text-[12px] text-on-surface">Soft density roll-off, lifted 3% blacks</span>
				</div>
			</div>
		</div>
	);
}
