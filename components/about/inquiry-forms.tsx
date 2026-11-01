"use client";

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { InquiryKind, InquiryPayload } from "@/lib/inquiry";
import { submitInquiry } from "@/lib/inquiry-client";
import { useFlash } from "@/lib/use-flash";

type Tab = Exclude<InquiryKind, "papers">;

function subscribeHash(onChange: () => void) {
	window.addEventListener("hashchange", onChange);
	return () => window.removeEventListener("hashchange", onChange);
}

const readHash = () => window.location.hash;

const projectTypes = ["Instagram Reel", "Product Shoot", "Portrait Session"];
const gearOptions = [
	"Natural window light",
	"Softbox / LED key",
	"On-location available light",
	"Product tabletop",
	"Open to recommendation",
];
const focusAreas = ["ColdFusion application", "Django & Python", "SQL & PostgreSQL", "React / Next.js front end", "Full product build"];

export function InquiryForms() {
	const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
	const [picked, setPicked] = useState<Tab | null>(null);
	const tab: Tab = picked ?? (hash === "#commission-advisory" ? "advisory" : "cinema");

	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const toast = useFlash<string>();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const entries = Object.fromEntries(new FormData(form)) as Record<string, string>;
		setPending(true);
		setError(null);
		const result = await submitInquiry({ ...entries, kind: tab } as InquiryPayload);
		setPending(false);
		if (result.ok) {
			form.reset();
			toast.trigger(result.message);
		} else {
			setError(result.message);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div role="tablist" aria-label="Inquiry type" className="grid grid-cols-2 gap-1 rounded-full bg-surface-container-high p-1 dark:border dark:border-primary/15 dark:bg-surface-container-low">
				{(
					[
						["cinema", "Shoots & Reels", "movie"],
						["advisory", "Full-stack Build", "terminal"],
					] as const
				).map(([value, label, icon]) => (
					<button
						key={value}
						type="button"
						role="tab"
						aria-selected={tab === value}
						aria-controls="inquiry-panel"
						onClick={() => {
							setPicked(value);
							setError(null);
						}}
						className={cn(
							"flex items-center justify-center gap-1.5 rounded-full px-3 py-2 font-sans text-label-pill font-bold transition-all",
							tab === value ? "bg-primary text-on-primary shadow-sm dark:shadow-glow" : "text-on-surface-variant hover:text-on-surface",
						)}
					>
						<Icon name={icon} className="text-[15px]" />
						{label}
					</button>
				))}
			</div>

			<form
				key={tab}
				id="inquiry-panel"
				role="tabpanel"
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-card dark:border dark:border-primary/15 dark:bg-surface-container-low"
			>
				{tab === "cinema" ? (
					<>
						<Fieldset legend="Project Type">
							<PillGroup name="projectType" options={projectTypes} />
						</Fieldset>
						<Field label="Estimated Production Timeline" icon="calendar_today" name="timeline" placeholder="e.g. next week • one shoot day" />
						<Field label="Shooting Location(s)" icon="location_on" name="locations" placeholder="e.g. Bengaluru studio or on location" />
						<label className="flex flex-col gap-1.5">
							<span className="font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Camera &amp; Gear Preferences</span>
							<select
								name="gear"
								required
								defaultValue={gearOptions[0]}
								className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2.5 font-sans text-body-dense text-on-surface outline-none transition-colors focus:border-primary"
							>
								{gearOptions.map((option) => (
									<option key={option}>{option}</option>
								))}
							</select>
						</label>
						<Field label="Your Email" icon="mail" name="email" type="email" placeholder="you@studio.com" />
					</>
				) : (
					<>
						<Fieldset legend="What do you need built?">
							<PillGroup name="focusArea" options={focusAreas} />
						</Fieldset>
						<Field label="Engagement Duration & Commitment" icon="timelapse" name="duration" placeholder="e.g. 6 weeks • a feature and its pages" />
						<Field label="Tech Stack Constraints" icon="terminal" name="stack" placeholder="e.g. ColdFusion, Django, PostgreSQL, React" />
						<Field label="Your Email" icon="mail" name="email" type="email" placeholder="you@company.com" />
					</>
				)}

				{error ? (
					<p role="alert" className="flex items-center gap-1.5 rounded-lg bg-error/10 px-3 py-2 font-sans text-body-dense text-error">
						<Icon name="error" className="text-[16px]" />
						{error}
					</p>
				) : null}

				<button
					type="submit"
					disabled={pending}
					className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-sans font-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 dark:shadow-glow"
				>
						{pending ? "Transmitting…" : tab === "cinema" ? "Request a Shoot" : "Request a Build"}
					<Icon name={pending ? "progress_activity" : tab === "cinema" ? "send" : "terminal"} className={cn("text-[18px]", pending && "animate-spin")} />
				</button>

				<div aria-live="polite">
					{toast.active ? (
						<p
							className={cn(
								"flex items-center gap-2 rounded-xl bg-inverse-surface px-4 py-3 font-mono text-[12px] text-inverse-on-surface",
								toast.flashClassName,
							)}
							onAnimationEnd={toast.onAnimationEnd}
						>
							<Icon name="check_circle" className="text-[16px] text-tertiary-fixed-dim" />
							{toast.value}
						</p>
					) : null}
				</div>
			</form>
		</div>
	);
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
	return (
		<fieldset className="flex flex-col gap-2">
			<legend className="mb-1.5 font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">{legend}</legend>
			{children}
		</fieldset>
	);
}

function PillGroup({ name, options }: { name: string; options: string[] }) {
	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option, index) => (
				<label
					key={option}
					className="cursor-pointer rounded-full border border-outline-variant px-3 py-1.5 font-sans text-label-pill font-bold text-on-surface-variant transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
				>
					<input type="radio" name={name} value={option} defaultChecked={index === 0} className="sr-only" />
					{option}
				</label>
			))}
		</div>
	);
}

function Field({ label, icon, name, type = "text", placeholder }: { label: string; icon: string; name: string; type?: string; placeholder: string }) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">{label}</span>
			<span className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 py-2.5 transition-colors focus-within:border-primary">
				<Icon name={icon} className="text-[18px] text-outline" />
				<input
					name={name}
					type={type}
					required
					maxLength={300}
					placeholder={placeholder}
					autoComplete={type === "email" ? "email" : "off"}
					className="w-full bg-transparent font-sans text-body-dense text-on-surface outline-none placeholder:text-outline"
				/>
			</span>
		</label>
	);
}
