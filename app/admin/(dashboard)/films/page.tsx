"use client";

import { useEffect, useState } from "react";
import { FilmsEditor } from "@/components/admin/films-editor";
import { AdminLoading } from "@/components/admin/fields";
import { loadJson, loadUploads, type UploadItem } from "@/lib/admin/browser-store";
import { defaultFilms, type Film } from "@/lib/content-data";

export default function AdminFilmsPage() {
	const [films, setFilms] = useState<Film[] | null>(null);
	const [media, setMedia] = useState<UploadItem[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([loadJson("films", defaultFilms), loadUploads()])
			.then(([nextFilms, nextMedia]) => {
				if (!live) return;
				setFilms(nextFilms);
				setMedia(nextMedia);
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load picture work.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!films || !media) return <AdminLoading />;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Picture Work</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">The cards on Cinema. Add images from the Media Library, edit copy, then save.</p>
			</div>
			<FilmsEditor initialFilms={films} media={media} />
		</div>
	);
}
