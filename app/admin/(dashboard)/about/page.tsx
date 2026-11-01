"use client";

import { useEffect, useState } from "react";
import { AboutEditor } from "@/components/admin/about-editor";
import { AdminLoading } from "@/components/admin/fields";
import { loadJson, loadUploads, type UploadItem } from "@/lib/admin/browser-store";
import { defaultAboutContent, type AboutContent } from "@/lib/about-data";

export default function AdminAboutPage() {
	const [about, setAbout] = useState<AboutContent | null>(null);
	const [media, setMedia] = useState<UploadItem[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([loadJson("about", defaultAboutContent), loadUploads()])
			.then(([nextAbout, nextMedia]) => {
				if (!live) return;
				setAbout({ ...defaultAboutContent, ...nextAbout });
				setMedia(nextMedia);
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load the about page.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!about || !media) return <AdminLoading />;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">About Page</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Your profile picture, headline, bio, and the home-base card on <code className="font-mono">/about</code>. Upload a new photo in <code className="font-mono">Media Library</code> first, then pick it below.
				</p>
			</div>
			<AboutEditor initialContent={about} media={media} />
		</div>
	);
}
