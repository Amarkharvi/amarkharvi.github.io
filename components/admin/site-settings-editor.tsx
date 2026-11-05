"use client";

import { useActionState, useState } from "react";
import { Card, Field } from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { Icon } from "@/components/ui/icon";
import type { PersonaSide, ReelSettings, SiteSettings, SocialLink, SwipeImages } from "@/lib/site-settings";
import { saveSiteForm, type SaveState, type UploadItem } from "@/lib/admin/browser-store";

const initialState: SaveState = { error: null, saved: false };

function PersonaFields({
	title,
	hint,
	cardHint,
	value,
	onChange,
	media,
	showTerminal,
}: {
	title: string;
	hint: string;
	cardHint: string;
	value: PersonaSide;
	onChange: (patch: Partial<PersonaSide>) => void;
	media: UploadItem[];
	showTerminal?: boolean;
}) {
	return (
		<Card>
			<div>
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{title}</span>
				<p className="font-sans text-[12px] text-on-surface-variant">{hint}</p>
			</div>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<Field label="Badge" value={value.badge} onChange={(next) => onChange({ badge: next })} />
				<Field label="Role line" value={value.role} onChange={(next) => onChange({ role: next })} />
				<Field label="Headline" value={value.headline} onChange={(next) => onChange({ headline: next })} className="md:col-span-2" />
				<Field label="Body" value={value.body} as="textarea" onChange={(next) => onChange({ body: next })} className="md:col-span-2" />
				<Field label="Tool chips (comma-separated)" value={value.tools} onChange={(next) => onChange({ tools: next })} className="md:col-span-2" />
				<Field label="CTA label" value={value.ctaLabel} onChange={(next) => onChange({ ctaLabel: next })} />
				<Field label="CTA link" value={value.ctaHref} onChange={(next) => onChange({ ctaHref: next })} />
				<Field label="Column eyebrow" value={value.columnEyebrow} onChange={(next) => onChange({ columnEyebrow: next })} />
				<Field label="Column title" value={value.columnTitle} onChange={(next) => onChange({ columnTitle: next })} />
				<div className="md:col-span-2">
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Column card</span>
					<p className="font-sans text-[12px] text-on-surface-variant">{cardHint}</p>
				</div>
				<Field label="Card title" value={value.featureTitle} onChange={(next) => onChange({ featureTitle: next })} />
				<Field label="Card link label" value={value.featureLinkLabel} onChange={(next) => onChange({ featureLinkLabel: next })} />
				<Field label="Card text" value={value.featureBody} as="textarea" onChange={(next) => onChange({ featureBody: next })} className="md:col-span-2" />
				<Field label="Card chips (comma-separated)" value={value.featureChips} onChange={(next) => onChange({ featureChips: next })} className="md:col-span-2" />
				<Field label="Card link" value={value.featureHref} onChange={(next) => onChange({ featureHref: next })} className="md:col-span-2" />
				<MediaPicker label="Card image or video" value={value.featureMedia} onChange={(next) => onChange({ featureMedia: next })} media={media} />
				<MediaPicker label="Poster (shown with a video, or instead of one)" value={value.featurePoster} onChange={(next) => onChange({ featurePoster: next })} media={media} />
				{showTerminal ? (
					<>
						<Field label="Terminal path" value={value.promptPath ?? ""} onChange={(next) => onChange({ promptPath: next })} />
						<Field label="whoami line" value={value.terminalWhoami ?? ""} onChange={(next) => onChange({ terminalWhoami: next })} />
						<Field
							label="stack.txt line (use · between tools)"
							value={value.terminalStack ?? ""}
							onChange={(next) => onChange({ terminalStack: next })}
							className="md:col-span-2"
						/>
					</>
				) : null}
			</div>
		</Card>
	);
}

export function SiteSettingsEditor({ initialSettings, media }: { initialSettings: SiteSettings; media: UploadItem[] }) {
	const [settings, setSettings] = useState<SiteSettings>(initialSettings);
	const [state, action, pending] = useActionState(saveSiteForm, initialState);

	function updateSocial(key: keyof SiteSettings["socials"], patch: Partial<SocialLink>) {
		setSettings((prev) => ({ ...prev, socials: { ...prev.socials, [key]: { ...prev.socials[key], ...patch } } }));
	}

	function updateReel(patch: Partial<ReelSettings>) {
		setSettings((prev) => ({ ...prev, reel: { ...prev.reel, ...patch } }));
	}

	function updateSwipe(patch: Partial<SwipeImages>) {
		setSettings((prev) => ({ ...prev, swipe: { ...prev.swipe, ...patch } }));
	}

	function updatePersona(side: "persona1" | "persona2", patch: Partial<PersonaSide>) {
		setSettings((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }));
	}

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="settings" value={JSON.stringify(settings)} />

			<Card>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
				<p className="font-sans text-[12px] text-on-surface-variant">Country code plus number, no spaces. Used when LUT orders are set to WhatsApp below.</p>
			</Card>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Shop orders</span>
					<p className="font-sans text-[12px] text-on-surface-variant">Where the LUT Shop &ldquo;Order&rdquo; buttons send people. Flip it any time; the shop updates on save.</p>
				</div>
				<div role="radiogroup" aria-label="Order channel" className="grid grid-cols-2 gap-2 rounded-xl bg-surface-container p-1 md:max-w-md">
					{(
						[
							{ id: "instagram", label: "Instagram chat", icon: "photo_camera" },
							{ id: "whatsapp", label: "WhatsApp", icon: "chat" },
						] as const
					).map((option) => {
						const active = settings.orderChannel === option.id;
						return (
							<button
								key={option.id}
								type="button"
								role="radio"
								aria-checked={active}
								onClick={() => setSettings((prev) => ({ ...prev, orderChannel: option.id }))}
								className={
									active
										? "flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 font-sans text-label-pill font-bold text-on-primary shadow-sm"
										: "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 font-sans text-label-pill font-bold text-on-surface-variant hover:text-on-surface"
								}
							>
								<Icon name={option.icon} className="text-[16px]" filled={active} />
								{option.label}
							</button>
						);
					})}
				</div>
				<p className="font-sans text-[12px] text-on-surface-variant">
					{settings.orderChannel === "instagram"
						? "Instagram opens a DM with your Instagram account (from Watch & follow below). Instagram can't prefill messages, so the order text is copied for the buyer to paste."
						: settings.whatsapp.replace(/\D/g, "").length >= 8
							? "WhatsApp opens a chat to the number above with the order already filled in."
							: "WhatsApp needs a number above. Until you add one, buyers see an error instead of a chat."}
				</p>
			</Card>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Intro phrase</span>
					<p className="font-sans text-[12px] text-on-surface-variant">The hero heading and sub-copy on the Dual Persona home page.</p>
				</div>
				<div className="grid grid-cols-1 gap-3">
					<Field
						label="Heading — line 1 (plain serif)"
						value={settings.introHeading}
						onChange={(value) => setSettings((prev) => ({ ...prev, introHeading: value }))}
					/>
					<Field
						label="Heading — line 2 (gradient style)"
						value={settings.introSubheading}
						onChange={(value) => setSettings((prev) => ({ ...prev, introSubheading: value }))}
					/>
					<Field
						label="Paragraph"
						value={settings.introParagraph}
						as="textarea"
						onChange={(value) => setSettings((prev) => ({ ...prev, introParagraph: value }))}
					/>
				</div>
			</Card>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">The swipe — Instagram grid</span>
					<p className="font-sans text-[12px] text-on-surface-variant">
						Fallback thumbs for Dual Persona. When you save Picture Work, those card covers sync here automatically (YouTube &amp; Reels → Reel, Product Shoots → Product, Portraits → Portrait).
					</p>
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<MediaPicker label="Reel thumbnail" value={settings.swipe.reel} onChange={(value) => updateSwipe({ reel: value })} media={media} />
					<MediaPicker label="Product thumbnail" value={settings.swipe.product} onChange={(value) => updateSwipe({ product: value })} media={media} />
					<MediaPicker label="Portrait thumbnail" value={settings.swipe.portrait} onChange={(value) => updateSwipe({ portrait: value })} media={media} />
				</div>
			</Card>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Showreel</span>
					<p className="font-sans text-[12px] text-on-surface-variant">
						Plays behind Persona 01 on the Dual Persona home page, and in the player at the top of Cinema. Upload it in the Media Library
						first, then pick it here. Leave video empty to keep the still image.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<MediaPicker label="Showreel video" value={settings.reel.video} onChange={(value) => updateReel({ video: value })} media={media} />
					<MediaPicker label="Poster image (shown before/without video)" value={settings.reel.poster} onChange={(value) => updateReel({ poster: value })} media={media} />
				</div>
			</Card>

			<PersonaFields
				title="Persona 01 — Cinema"
				hint="Hero copy and column heading on the Dual Persona home page."
				cardHint="The first card under “The frame”. Leave the image and video empty to keep using the showreel above."
				value={settings.persona1}
				media={media}
				onChange={(patch) => updatePersona("persona1", patch)}
			/>

			<PersonaFields
				title="Persona 02 — Developer"
				hint="Hero copy, terminal strip, and column heading for the developer side."
				cardHint="The first card under “The stack”. Leave the image and video empty to keep the stack.js code window. Card text falls back to the body above."
				value={settings.persona2}
				media={media}
				onChange={(patch) => updatePersona("persona2", patch)}
				showTerminal
			/>

			<Card>
				<div>
					<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Watch &amp; follow</span>
					<p className="font-sans text-[12px] text-on-surface-variant">Highlighted with YouTube/Instagram colors on the Dual Persona and About pages.</p>
				</div>
				{(["youtube", "instagram"] as const).map((key) => (
					<div key={key} className="grid grid-cols-1 gap-2 rounded-lg bg-surface-container-low p-2.5 md:grid-cols-3">
						<Field label={`${key} label`} value={settings.socials[key].label} onChange={(value) => updateSocial(key, { label: value })} />
						<Field label={`${key} handle`} value={settings.socials[key].handle} onChange={(value) => updateSocial(key, { handle: value })} />
						<Field label={`${key} link`} value={settings.socials[key].href} onChange={(value) => updateSocial(key, { href: value })} />
					</div>
				))}
			</Card>

			<Card>
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Other social links</span>
				{(["github", "linkedin", "twitter"] as const).map((key) => (
					<div key={key} className="grid grid-cols-1 gap-2 rounded-lg bg-surface-container-low p-2.5 md:grid-cols-3">
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

