"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

const stills = [
	{ src: "/media/study/still-platform.jpg", tc: "FRAME 01", title: "Window light", lens: "Wide", alt: "Figure and reflection in warm window light" },
	{ src: "/media/study/still-seat.jpg", tc: "FRAME 02", title: "Detail & texture", lens: "Close", alt: "Close detail of a bag on a seat, used as a cutaway" },
	{ src: "/media/study/still-twilight.jpg", tc: "FRAME 03", title: "Evening frame", lens: "Wide", alt: "A quiet platform at dusk, held as a closing frame" },
];

export function FrameArchive() {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [index, setIndex] = useState(0);
	const current = stills[index];

	function open(i: number) {
		setIndex(i);
		dialogRef.current?.showModal();
	}

	function step(delta: number) {
		setIndex((i) => (i + delta + stills.length) % stills.length);
	}

	return (
		<>
			<div data-lenis-prevent className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
				{stills.map((still, i) => (
					<button
						key={still.src}
						type="button"
						onClick={() => open(i)}
						className="group flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-surface-container text-left shadow-sm md:w-auto dark:border dark:border-primary/10"
					>
						<div className="relative aspect-video w-full overflow-hidden">
							<Image src={still.src} alt={still.alt} fill sizes="(min-width: 768px) 33vw, 240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
							<span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-primary-fixed-dim">{still.tc}</span>
							<span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
								<Icon name="open_in_full" className="text-[14px]" />
							</span>
						</div>
						<div className="flex items-center justify-between gap-2 p-2 font-mono text-[10px]">
							<span className="truncate font-medium text-on-surface">{still.title}</span>
							<span className="shrink-0 text-outline">{still.lens}</span>
						</div>
					</button>
				))}
			</div>

			<dialog
				ref={dialogRef}
				onClick={(event) => {
					if (event.target === event.currentTarget) dialogRef.current?.close();
				}}
				onKeyDown={(event) => {
					if (event.key === "ArrowRight") step(1);
					if (event.key === "ArrowLeft") step(-1);
				}}
				className="m-auto w-[min(100vw-2rem,960px)] overflow-hidden rounded-xl bg-inverse-surface p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
			>
				<div className="relative aspect-video w-full">
					<Image src={current.src} alt={current.alt} fill sizes="960px" className="object-cover" />
				</div>
				<div className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-[11px]">
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-semibold">{current.title}</span>
						<span className="text-white/60">
							{current.tc} • {current.lens}
						</span>
					</div>
					<div className="flex shrink-0 items-center gap-1">
						<button type="button" onClick={() => step(-1)} aria-label="Previous still" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
							<Icon name="chevron_left" className="text-[20px]" />
						</button>
						<button type="button" onClick={() => step(1)} aria-label="Next still" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
							<Icon name="chevron_right" className="text-[20px]" />
						</button>
						<button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
							<Icon name="close" className="text-[20px]" />
						</button>
					</div>
				</div>
			</dialog>
		</>
	);
}
