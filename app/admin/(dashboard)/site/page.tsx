"use client";

import { useEffect, useState } from "react";
import { SiteSettingsEditor } from "@/components/admin/site-settings-editor";
import { AdminLoading } from "@/components/admin/fields";
import { loadJson, loadUploads, type UploadItem } from "@/lib/admin/browser-store";
import { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings-data";

export default function AdminSitePage() {
	const [settings, setSettings] = useState<SiteSettings | null>(null);
	const [media, setMedia] = useState<UploadItem[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([loadJson("site-settings", defaultSiteSettings), loadUploads()])
			.then(([stored, uploads]) => {
				if (!live) return;
				setSettings({
					...defaultSiteSettings,
					...stored,
					introHeading: stored.introHeading ?? defaultSiteSettings.introHeading,
					introSubheading: stored.introSubheading ?? defaultSiteSettings.introSubheading,
					introParagraph: stored.introParagraph ?? defaultSiteSettings.introParagraph,
					swipe: { ...defaultSiteSettings.swipe, ...stored.swipe },
					reel: { ...defaultSiteSettings.reel, ...stored.reel },
					persona1: { ...defaultSiteSettings.persona1, ...stored.persona1 },
					persona2: { ...defaultSiteSettings.persona2, ...stored.persona2 },
					socials: { ...defaultSiteSettings.socials, ...stored.socials },
				});
				setMedia(uploads);
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load site settings.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!settings || !media) return <AdminLoading />;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Site Basics</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Header basics, Dual Persona intro, Persona 01 / 02 heroes, showreel, swipe thumbs, and social links.
				</p>
			</div>
			<SiteSettingsEditor initialSettings={settings} media={media} />
		</div>
	);
}
