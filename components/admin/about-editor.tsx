"use client";

import { useActionState, useState } from "react";
import { Card, Field, SaveBar } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import type { AboutContent } from "@/lib/about";
import { saveAboutForm, type SaveState, type UploadItem } from "@/lib/admin/browser-store";

const initialState: SaveState = { error: null, saved: false };

export function AboutEditor({ initialContent, media }: { initialContent: AboutContent; media: UploadItem[] }) {
	const [about, setAbout] = useState<AboutContent>(initialContent);
	const [state, action, pending] = useActionState(saveAboutForm, initialState);

	function update(patch: Partial<AboutContent>) {
		setAbout((prev) => ({ ...prev, ...patch }));
	}

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="about" value={JSON.stringify(about)} />

			<Card>
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Hero</span>
				<MediaPicker label="Profile / hero image" value={about.heroImage} onChange={(value) => update({ heroImage: value })} media={media} />
				<Field label="Image alt text" value={about.heroImageAlt} onChange={(value) => update({ heroImageAlt: value })} />
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<Field label="Badge (top-left pill)" value={about.heroBadge} onChange={(value) => update({ heroBadge: value })} />
					<Field label="Chip (top-right tag)" value={about.heroChip} onChange={(value) => update({ heroChip: value })} />
					<Field label="Overlay tag (on the image)" value={about.heroOverlayTag} onChange={(value) => update({ heroOverlayTag: value })} />
					<Field label="Caption title (on the image)" value={about.heroCaptionTitle} onChange={(value) => update({ heroCaptionTitle: value })} />
					<Field label="Caption note (on the image)" value={about.heroCaptionNote} onChange={(value) => update({ heroCaptionNote: value })} />
				</div>
			</Card>

			<Card>
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Intro</span>
				<Field label="Eyebrow (small label above the headline)" value={about.eyebrow} onChange={(value) => update({ eyebrow: value })} />
				<Field label="Headline" value={about.headline} onChange={(value) => update({ headline: value })} as="textarea" />
				<Field label="Bio paragraph" value={about.bio} onChange={(value) => update({ bio: value })} as="textarea" />
			</Card>

			<Card>
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Home base</span>
				<MediaPicker label="Map / location image" value={about.homeBaseImage} onChange={(value) => update({ homeBaseImage: value })} media={media} />
				<Field label="Image alt text" value={about.homeBaseImageAlt} onChange={(value) => update({ homeBaseImageAlt: value })} />
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<Field label="Map tag" value={about.homeBaseMapTag} onChange={(value) => update({ homeBaseMapTag: value })} />
					<Field label="Title" value={about.homeBaseTitle} onChange={(value) => update({ homeBaseTitle: value })} />
				</div>
				<Field label="Body" value={about.homeBaseBody} onChange={(value) => update({ homeBaseBody: value })} as="textarea" />
			</Card>

			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
