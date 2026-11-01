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
					reel: { ...defaultSiteSettings.reel, ...stored.reel },
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
				<p className="font-sans text-[13px] text-on-surface-variant">The tagline in the header, the availability pill, location, and your social links.</p>
			</div>
			<SiteSettingsEditor initialSettings={settings} media={media} />
		</div>
	);
}
