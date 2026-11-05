"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { UploadItem } from "@/lib/admin/browser-store";
import { cn } from "@/lib/cn";

const VIDEO_PATTERN = /\.(mp4|webm|mov)$/i;

export function MediaPicker({
	label,
	value,
	onChange,
	media,
	className,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	media: UploadItem[];
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const isVideo = VIDEO_PATTERN.test(value);
	const selected = media.find((item) => item.url === value);
	const preview = selected?.previewUrl ?? value;

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</span>
			<div className="flex items-center gap-2">
				<input
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder="/api/media/your-file.jpg"
					className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-mono text-[12px] text-on-surface outline-none focus:border-primary"
				/>
				<button
					type="button"
					onClick={() => setOpen((prev) => !prev)}
					className="shrink-0 rounded-lg bg-surface-container px-3 py-2 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:text-on-surface"
				>
					Browse
				</button>
			</div>

			{value ? (
				<div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-surface-container">
					{isVideo ? (
						<video src={preview} muted className="h-full w-full object-cover" />
					) : (
						<Image src={preview} alt="" fill sizes="128px" className="object-cover" unoptimized />
					)}
				</div>
			) : null}

			{open ? (
				<div className="flex max-h-64 flex-col gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-2">
					<div className="flex items-center justify-between px-1">
						<span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Pick from Media Library</span>
						<a href="/admin/media" target="_blank" className="font-mono text-[10px] text-primary hover:underline">
							Upload more
						</a>
					</div>
					<div className="grid grid-cols-4 gap-2 overflow-y-auto">
						{media.length === 0 ? (
							<p className="col-span-4 py-3 text-center font-sans text-[12px] text-on-surface-variant">No uploads yet.</p>
						) : (
							media.map((item) => (
								<button
									key={item.name}
									type="button"
									onClick={() => {
										onChange(item.url);
										setOpen(false);
									}}
									className={cn(
										"relative aspect-square overflow-hidden rounded-md bg-surface-container transition-all hover:ring-2 hover:ring-primary",
										item.url === value && "ring-2 ring-primary",
									)}
								>
									{item.kind === "image" ? (
										<Image src={item.previewUrl ?? item.url} alt={item.name} fill sizes="80px" className="object-cover" unoptimized />
									) : (
										<span className="flex h-full w-full items-center justify-center bg-inverse-surface text-inverse-on-surface">
											<Icon name="movie" className="text-[20px]" />
										</span>
									)}
								</button>
							))
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}
