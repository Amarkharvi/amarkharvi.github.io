"use client";

import { useEffect, useState } from "react";
import { MediaGrid } from "@/components/admin/media-grid";
import { UploadForm } from "@/components/admin/upload-form";
import { AdminLoading } from "@/components/admin/fields";
import { loadUploads, type UploadItem } from "@/lib/admin/browser-store";

export default function AdminMediaPage() {
	const [items, setItems] = useState<UploadItem[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [tick, setTick] = useState(0);

	useEffect(() => {
		let live = true;
		loadUploads()
			.then((next) => {
				if (live) setItems(next);
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load uploads.");
			});
		return () => {
			live = false;
		};
	}, [tick]);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!items) return <AdminLoading />;

	return (
		<div className="flex flex-col gap-5">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Media Library</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Upload images and reels here, then pick them from Picture Work, the LUT Shop, or Site Basics. On Vercel they go to Blob storage; locally they land in{" "}
					<code className="font-mono">/api/media</code> (private Blob on Vercel, disk locally).
				</p>
			</div>
			<UploadForm onUploaded={() => setTick((value) => value + 1)} />
			<MediaGrid items={items} onDeleted={() => setTick((value) => value + 1)} />
		</div>
	);
}
