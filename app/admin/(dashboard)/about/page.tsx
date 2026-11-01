import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutEditor } from "@/components/admin/about-editor";
import { AdminLoading } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { getAboutContent } from "@/lib/about";

export const metadata: Metadata = { title: "About Page", robots: { index: false, follow: false } };

export default function AdminAboutPage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<AboutContent />
		</Suspense>
	);
}

async function AboutContent() {
	await requireAdmin();
	const [about, media] = await Promise.all([getAboutContent(), listMedia()]);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">About Page</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Your profile picture, headline, bio, and the home-base card on <code className="font-mono">/about</code>. Upload a new photo in{" "}
					<code className="font-mono">Media Library</code> first, then pick it below.
				</p>
			</div>
			<AboutEditor initialContent={about} media={media} />
		</div>
	);
}
