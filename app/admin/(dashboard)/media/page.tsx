import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/fields";
import { MediaGrid } from "@/components/admin/media-grid";
import { UploadForm } from "@/components/admin/upload-form";
import { requireAdmin } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";

export const metadata: Metadata = { title: "Media Library", robots: { index: false, follow: false } };

export default function AdminMediaPage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<MediaContent />
		</Suspense>
	);
}

async function MediaContent() {
	await requireAdmin();
	const items = await listMedia();

	return (
		<div className="flex flex-col gap-5">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Media Library</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Upload images and reels here, then pick them from Picture Work, the LUT Shop, or Site Basics. Files land in{" "}
					<code className="font-mono">public/media/uploads</code>.
				</p>
			</div>
			<UploadForm />
			<MediaGrid items={items} />
		</div>
	);
}
