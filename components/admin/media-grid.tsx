"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import type { UploadItem } from "@/lib/admin/browser-store";
import { removeUpload } from "@/lib/admin/browser-store";

function formatSize(bytes: number) {
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function MediaGrid({ items, onDeleted }: { items: UploadItem[]; onDeleted: () => void }) {
	const [pendingName, setPendingName] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	if (items.length === 0) {
		return <p className="rounded-2xl bg-surface-container-low p-6 text-center font-sans text-[13px] text-on-surface-variant">No uploads yet. Add an image or reel above.</p>;
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
			{items.map((item) => (
				<div key={item.name} className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-card dark:border dark:border-primary/10">
					<div className="relative aspect-square bg-inverse-surface">
						{item.kind === "image" ? (
							<Image src={item.previewUrl ?? item.url} alt={item.name} fill sizes="160px" className="object-cover" unoptimized />
						) : (
							<video src={item.previewUrl ?? item.url} muted className="h-full w-full object-cover" />
						)}
						{item.kind === "video" ? (
							<span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white">REEL</span>
						) : null}
					</div>
					<div className="flex flex-col gap-1 p-2">
						<p className="truncate font-mono text-[10px] text-on-surface-variant" title={item.name}>
							{item.name}
						</p>
						<div className="flex items-center justify-between">
							<span className="font-mono text-[10px] text-outline">{formatSize(item.size)}</span>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => navigator.clipboard?.writeText(item.url)}
									title="Copy path"
									className="rounded p-1 text-on-surface-variant transition-colors hover:text-primary"
								>
									<Icon name="content_copy" className="text-[14px]" />
								</button>
								<button
									type="button"
									disabled={isPending && pendingName === item.name}
									onClick={() => {
										if (!window.confirm(`Delete ${item.name}? This can't be undone.`)) return;
										setPendingName(item.name);
										startTransition(async () => {
											await removeUpload(item.name);
											onDeleted();
										});
									}}
									title="Delete"
									className="rounded p-1 text-on-surface-variant transition-colors hover:text-red-500 disabled:opacity-50"
								>
									<Icon name="delete" className="text-[14px]" />
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
