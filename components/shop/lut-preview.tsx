"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type LutPreviewProps = {
	src: string;
	alt: string;
	filter: string;
	name: string;
	/** Real ungraded / graded photos. Both are needed; otherwise `src` + `filter` is used. */
	before?: string;
	after?: string;
	className?: string;
};

export function LutPreview({ src, alt, filter, name, before, after, className }: LutPreviewProps) {
	const [split, setSplit] = useState(50);
	const sliderId = useId();
	const hasPair = Boolean(before?.trim() && after?.trim());
	const beforeSrc = hasPair ? before!.trim() : src;
	const afterSrc = hasPair ? after!.trim() : src;
	const sizes = "(min-width: 1024px) 560px, 100vw";

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-inverse-surface">
				<Image src={beforeSrc} alt={hasPair ? `${name} — before the LUT` : alt} fill sizes={sizes} className="object-cover" />
				<div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
					<Image
						src={afterSrc}
						alt={hasPair ? `${name} — after the LUT` : ""}
						fill
						sizes={sizes}
						className="object-cover"
						style={hasPair ? undefined : { filter }}
					/>
				</div>
				<span
					className="pointer-events-none absolute inset-y-0 flex w-0.5 -translate-x-1/2 items-center bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.4)]"
					style={{ left: `${split}%` }}
				>
					<span className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg">
						<Icon name="swap_horiz" className="text-[22px]" />
					</span>
				</span>
				<span className="absolute left-2 top-2 rounded bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">BEFORE</span>
				<span className="absolute right-2 top-2 rounded bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">{hasPair ? "AFTER" : name.toUpperCase()}</span>
				<input
					id={sliderId}
					type="range"
					min={0}
					max={100}
					value={split}
					onChange={(event) => setSplit(Number(event.target.value))}
					aria-label={`Before and after ${name}`}
					className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
				/>
			</div>
			<p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
				<span>Drag to compare</span>
				<span>{hasPair ? "Real before / after" : "Preview"}</span>
			</p>
		</div>
	);
}
