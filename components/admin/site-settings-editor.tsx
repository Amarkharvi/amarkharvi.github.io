"use client";

import { useActionState, useState } from "react";
import { Card, Field } from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import type { ReelSettings, SiteSettings, SocialLink } from "@/lib/site-settings";
import { saveSiteForm, type SaveState, type UploadItem } from "@/lib/admin/browser-store";

const initialState: SaveState = { error: null, saved: false };

export function SiteSettingsEditor({ initialSettings, media }: { initialSettings: SiteSettings; media: UploadItem[] }) {
	const [settings, setSettings] = useState<SiteSettings>(initialSettings);
	const [state, action, pending] = useActionState(saveSiteForm, initialState);

	function updateSocial(key: keyof SiteSettings["socials"], patch: Partial<SocialLink>) {
		setSettings((prev) => ({ ...prev, socials: { ...prev.socials, [key]: { ...prev.socials[key], ...patch } } }));
	}

	function updateReel(patch: Partial<ReelSettings>) {
		setSettings((prev) => ({ ...prev, reel: { ...prev.reel, ...patch } }));
	}

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="settings" value={JSON.stringify(settings)} />

			<Card>
				<div className="grid gap-3 md:grid-cols-2">
					<Field label="Name" value={settings.name} onChange={(value) => setSettings((prev) => ({ ...prev, name: value }))} />
					<Field label="Role" value={settings.role} onChange={(value) => setSettings((prev) => ({ ...prev, role: value }))} />
					<Field label="Tagline (header)" value={settings.tagline} onChange={(value) => setSettings((prev) => ({ ...prev, tagline: value }))} />
					<Field label="Availability pill" value={settings.availability} onChange={(value) => setSettings((prev) => ({ ...prev, availability: value }))} />
					<Field label="Location" value={settings.location} onChange={(value) => setSettings((prev) => ({ ...prev, location: value }))} />
					<Field
						label="WhatsApp number"
						value={settings.whatsapp}
						placeholder="91XXXXXXXXXX"
						onChange={(value) => setSettings((prev) => ({ ...prev, whatsapp: value }))}
						className="md:col-span-2"
					/>
				</div>
				<p className="font-sans text-[12px] text-on-surface-variant">
					Country code plus number, no spaces. LUT orders on the shop open a WhatsApp chat to this number.
				</p>
			</Card>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Showreel</span>
					<p className="font-sans text-[12px] text-on-surface-variant">
						Plays behind the &quot;Behind the camera&quot; hero on the Dual Persona home page, and in the player at the top of Cinema. Upload it in
						the Media Library first, then pick it here. Leave it empty to keep the still image.
					</p>
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					<MediaPicker label="Showreel video" value={settings.reel.video} onChange={(value) => updateReel({ video: value })} media={media} />
					<MediaPicker label="Poster image (shown before/without video)" value={settings.reel.poster} onChange={(value) => updateReel({ poster: value })} media={media} />
				</div>
			</Card>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Watch &amp; follow</span>
					<p className="font-sans text-[12px] text-on-surface-variant">Highlighted with YouTube/Instagram colors on the Dual Persona and About pages.</p>
				</div>
				{(["youtube", "instagram"] as const).map((key) => (
					<div key={key} className="grid gap-2 rounded-lg bg-surface-container-low p-2.5 md:grid-cols-3">
						<Field label={`${key} label`} value={settings.socials[key].label} onChange={(value) => updateSocial(key, { label: value })} />
						<Field label={`${key} handle`} value={settings.socials[key].handle} onChange={(value) => updateSocial(key, { handle: value })} />
						<Field label={`${key} link`} value={settings.socials[key].href} onChange={(value) => updateSocial(key, { href: value })} />
					</div>
				))}
			</Card>

			<Card>
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Other social links</span>
				{(["github", "linkedin", "twitter"] as const).map((key) => (
					<div key={key} className="grid gap-2 rounded-lg bg-surface-container-low p-2.5 md:grid-cols-3">
						<Field label={`${key} label`} value={settings.socials[key].label} onChange={(value) => updateSocial(key, { label: value })} />
						<Field label={`${key} handle`} value={settings.socials[key].handle} onChange={(value) => updateSocial(key, { handle: value })} />
						<Field label={`${key} link`} value={settings.socials[key].href} onChange={(value) => updateSocial(key, { href: value })} />
					</div>
				))}
			</Card>

			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
