import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const inputClass = "rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-mono text-[12px] text-on-surface outline-none focus:border-primary";

export function Field({
	label,
	value,
	onChange,
	placeholder,
	className,
	as = "input",
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	as?: "input" | "textarea";
}) {
	return (
		<label className={cn("flex flex-col gap-1", className)}>
			<span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</span>
			{as === "textarea" ? (
				<textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cn(inputClass, "resize-y")} />
			) : (
				<input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
			)}
		</label>
	);
}

export function SelectField({
	label,
	value,
	onChange,
	options,
	className,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	className?: string;
}) {
	return (
		<label className={cn("flex flex-col gap-1", className)}>
			<span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</span>
			<select value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "bg-surface-container-lowest")}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</label>
	);
}

/** Fallback shown while a page's own auth check + data fetch resolves. Never render real data here —
 * it ships in the static shell for anyone, authenticated or not. */
export function AdminLoading() {
	return <div className="p-6 font-mono text-[12px] text-on-surface-variant">Checking session…</div>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("flex flex-col gap-3 rounded-2xl bg-surface-container-low p-4 shadow-card dark:border dark:border-primary/10", className)}>{children}</div>;
}

export function SaveBar({ pending, saved, error }: { pending: boolean; saved: boolean; error: string | null }) {
	return (
		<div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-full bg-surface-container-high px-4 py-2 shadow-lg dark:border dark:border-primary/20">
			<span className="font-sans text-[12px] text-on-surface-variant">
				{error ? <span className="text-red-500">{error}</span> : saved ? "Saved — live on the site." : "Edit, then save."}
			</span>
			<button
				type="submit"
				disabled={pending}
				className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-label-pill font-bold text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 dark:shadow-glow"
			>
				{pending ? "Saving…" : "Save changes"}
			</button>
		</div>
	);
}
