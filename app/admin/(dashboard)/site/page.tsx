import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/fields";
import { SiteSettingsEditor } from "@/components/admin/site-settings-editor";
import { requireAdmin } from "@/lib/admin/guard";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Site Basics", robots: { index: false, follow: false } };

export default function AdminSitePage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<SiteContent />
		</Suspense>
	);
}

async function SiteContent() {
	await requireAdmin();
	const settings = await getSiteSettings();

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Site Basics</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">The tagline in the header, the availability pill, location, and your social links.</p>
			</div>
			<SiteSettingsEditor initialSettings={settings} />
		</div>
	);
}
