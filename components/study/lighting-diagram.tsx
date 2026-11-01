"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type LightId = "key" | "rim" | "fill";

const lights: { id: LightId; dot: string; name: string; detail: string; detailClass: string }[] = [
	{ id: "key", dot: "bg-tertiary-fixed-dim", name: "Key: window or soft LED", detail: "Face or product first • daylight or a soft box", detailClass: "text-tertiary" },
	{ id: "rim", dot: "bg-secondary", name: "Rim: edge light", detail: "A thin line so the subject separates from the wall", detailClass: "text-secondary" },
	{ id: "fill", dot: "bg-outline", name: "Fill: bounce", detail: "Open the shadows without flattening the face", detailClass: "text-on-surface-variant" },
];

export function LightingDiagram() {
	const [focus, setFocus] = useState<LightId | null>(null);
	const dim = (id: LightId) => (focus && focus !== id ? "opacity-20" : "opacity-100");

	return (
		<div className="flex w-full flex-col gap-3 rounded-lg bg-surface-container-low p-3 shadow-md dark:border dark:border-primary/10">
			<div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded bg-surface-container-lowest p-2">
				<svg className="h-full w-full font-mono" fill="none" viewBox="0 0 360 220" role="img" aria-label="Top-down lighting plan for a portrait or product">
					<rect height="180" rx="8" className="stroke-outline-variant" strokeDasharray="4 4" strokeWidth="1.5" width="320" x="20" y="20" />
					<line className="stroke-tertiary" strokeLinecap="round" strokeWidth="3" x1="20" x2="20" y1="40" y2="180" />
					<text className="fill-tertiary" fontSize="8" x="28" y="34">
						WINDOW
					</text>

					<circle cx="160" cy="110" className="fill-surface-container stroke-primary" r="16" strokeWidth="2" />
					<text className="fill-on-surface font-headline" fontSize="8" fontWeight="600" x="140" y="113">
						SUBJECT
					</text>
					<path d="M148 100 L70 80" className="stroke-primary" strokeDasharray="2 2" strokeWidth="1.5" />
					<polygon className="fill-primary" points="70,80 78,81 76,85" />

					<rect className="fill-surface-container-high stroke-primary-container" height="24" rx="3" strokeWidth="1.5" width="28" x="270" y="140" />
					<text className="fill-primary" fontSize="8" fontWeight="bold" x="274" y="155">
						CAM
					</text>
					<path d="M270 148 L178 116" className="stroke-primary-container" strokeDasharray="3 3" strokeWidth="1" />

					<g className={cn("cursor-pointer transition-opacity duration-300", dim("key"))} onClick={() => setFocus(focus === "key" ? null : "key")}>
						<circle cx="10" cy="90" className="fill-tertiary/30 stroke-tertiary" r="12" strokeWidth="1.5" />
						<path d="M10 90 L140 105" className="stroke-tertiary" strokeOpacity="0.7" strokeWidth="1.2" />
						<polygon className="fill-tertiary-fixed" opacity="0.6" points="14,60 14,120 18,120 18,60" />
						<text className="fill-tertiary" fontSize="8" x="2" y="134">
							KEY LIGHT
						</text>
					</g>
					<g className={cn("cursor-pointer transition-opacity duration-300", dim("rim"))} onClick={() => setFocus(focus === "rim" ? null : "rim")}>
						<circle cx="120" cy="175" className="fill-secondary/30 stroke-secondary" r="9" strokeWidth="1.5" />
						<path d="M125 170 L152 124" className="stroke-secondary" strokeDasharray="2 2" strokeWidth="1" />
						<text className="fill-secondary" fontSize="8" x="80" y="196">
							RIM LIGHT
						</text>
					</g>
					<g className={cn("cursor-pointer transition-opacity duration-300", dim("fill"))} onClick={() => setFocus(focus === "fill" ? null : "fill")}>
						<rect className="fill-surface-container-highest stroke-outline" height="10" rx="2" strokeWidth="1" width="60" x="180" y="32" />
						<path d="M210 42 L170 95" className="stroke-outline" strokeDasharray="2 2" strokeWidth="0.8" />
						<text className="fill-on-surface-variant" fontSize="7" x="182" y="54">
							BOUNCE FILL
						</text>
					</g>
				</svg>
				<span className="absolute bottom-2 right-2 rounded bg-surface-container-high/90 px-2 py-0.5 font-mono text-[9px] text-tertiary">
					{focus ? `Isolated: ${focus.toUpperCase()} • tap again to reset` : "Top-down Rig Coordinate: Block 04"}
				</span>
			</div>

			<div className="flex flex-col gap-2 pt-1">
				{lights.map((light) => (
					<button
						key={light.id}
						type="button"
						aria-pressed={focus === light.id}
						onClick={() => setFocus(focus === light.id ? null : light.id)}
						className={cn(
							"flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded p-2 text-left transition-colors",
							focus === light.id ? "bg-surface-container-high ring-1 ring-primary/50" : "bg-surface-container hover:bg-surface-container-high",
						)}
					>
						<span className="flex items-center gap-2">
							<span className={cn("h-2.5 w-2.5 rounded-full", light.dot)} />
							<span className="font-mono text-[11px] text-on-surface">{light.name}</span>
						</span>
						<span className={cn("font-mono text-[11px] font-medium", light.detailClass)}>{light.detail}</span>
					</button>
				))}
			</div>
		</div>
	);
}
