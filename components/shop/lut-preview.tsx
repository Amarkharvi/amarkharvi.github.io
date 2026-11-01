"use client";

import Image from "next/image";
import { useState } from "react";

export function LutPreview({ src, alt, filter, name }: { src: string; alt: string; filter: string; name: string }) {
	const [split, setSplit] = useState(50);

	return (
		<div className="flex flex-col gap-2">
			<div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-inverse-surface">
				<Image src={src} alt={alt} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
				<div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
					<Image src={src} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" style={{ filter }} />
				</div>
				<span className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.4)]" style={{ left: `${split}%` }} />
				<span className="absolute left-2 top-2 rounded bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">BEFORE</span>
				<span className="absolute right-2 top-2 rounded bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">{name.toUpperCase()}</span>
			</div>
			<input
				type="range"
				min={0}
				max={100}
				value={split}
				onChange={(event) => setSplit(Number(event.target.value))}
				aria-label={`Before and after ${name}`}
				className="h-2 w-full cursor-pointer"
			/>
		</div>
	);
}
