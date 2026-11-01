import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/fields";
import { FilmsEditor } from "@/components/admin/films-editor";
import { requireAdmin } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { getFilms } from "@/lib/content";

export const metadata: Metadata = { title: "Picture Work", robots: { index: false, follow: false } };

export default function AdminFilmsPage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<FilmsContent />
		</Suspense>
	);
}

async function FilmsContent() {
	await requireAdmin();
	const [films, media] = await Promise.all([getFilms(), listMedia()]);

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
