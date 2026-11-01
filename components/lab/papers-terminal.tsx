"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { downloadFile } from "@/lib/browser";
import { cn } from "@/lib/cn";
import { submitInquiry } from "@/lib/inquiry-client";
import { docs } from "@/lib/site";

type Line = { text: string; tone: "cmd" | "out" | "ok" | "err" };

export function PapersTerminal() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [lines, setLines] = useState<Line[]>([
		{ text: "$ whoami", tone: "cmd" },
		{ text: "> Amar Kharvi — Bengaluru", tone: "out" },
		{ text: "> ColdFusion, Django, Python, SQL, PostgreSQL, React, Next.js", tone: "out" },
		{ text: "> Edit: Lightroom, DaVinci Resolve, Premiere Pro", tone: "out" },
	]);
	const [pending, setPending] = useState(false);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const email = inputRef.current?.value.trim() ?? "";
		if (!email) {
			inputRef.current?.focus();
			return;
		}
		setPending(true);
		setLines((prev) => [...prev, { text: `$ read -p "Enter email for thesis draft:" ${email}`, tone: "cmd" }]);
		const result = await submitInquiry({ kind: "papers", email });
		setPending(false);
		if (result.ok) {
			downloadFile(docs.papers.href, docs.papers.file);
			setLines((prev) => [...prev, { text: `✓ ${result.message} Download started (${docs.papers.file}).`, tone: "ok" }]);
			if (inputRef.current) inputRef.current.value = "";
		} else {
			setLines((prev) => [...prev, { text: `✗ ${result.message}`, tone: "err" }]);
		}
	}

	return (
		<div className="flex flex-col gap-3 rounded-2xl bg-surface-container-high p-4 dark:border dark:border-primary/15 dark:bg-surface-container">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-full bg-red-500/80" />
					<span className="h-3 w-3 rounded-full bg-amber-400/80" />
					<span className="h-3 w-3 rounded-full bg-tertiary-fixed-dim" />
					<span className="ml-1 font-mono text-[11px] text-on-surface-variant">{"shell // zsh"}</span>
				</div>
				<span className="font-mono text-[10px] text-on-surface-variant">SSH: 2202.OPEN</span>
			</div>

			<form onSubmit={onSubmit} className="flex flex-col gap-1 overflow-x-auto rounded-xl bg-inverse-surface p-3 font-mono text-[12px] text-inverse-on-surface" aria-live="polite">
				{lines.map((line, i) => (
					<div
						key={i}
						className={cn(
							"whitespace-pre-wrap break-all",
							line.tone === "cmd" && "text-tertiary-fixed",
							line.tone === "out" && "text-inverse-on-surface/80",
							line.tone === "ok" && "text-primary-fixed-dim",
							line.tone === "err" && "text-red-300",
						)}
					>
						{line.text}
					</div>
				))}
				<label className="mt-1 flex items-center gap-2 text-primary-fixed-dim">
					<span className="shrink-0">$ email:</span>
					<input
						ref={inputRef}
						type="email"
						name="email"
						required
						autoComplete="email"
						placeholder="you@studio.com"
						disabled={pending}
						className="min-w-0 flex-1 bg-transparent text-inverse-on-surface caret-primary-fixed-dim outline-none placeholder:text-inverse-on-surface/35"
					/>
				</label>
				<button type="submit" className="sr-only">
					Request papers
				</button>
			</form>

			<div className="flex flex-wrap items-center justify-between gap-2 pt-1">
				<span className="font-sans text-[12px] font-medium text-on-surface-variant">Leave an email for a one-page brief</span>
				<button
					type="button"
					disabled={pending}
					onClick={() => inputRef.current?.form?.requestSubmit()}
					className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 font-sans text-label-pill font-bold text-on-primary shadow-md transition-all active:translate-y-0.5 disabled:opacity-60 dark:shadow-glow"
				>
					{pending ? "Sending..." : "Download PDFs"}
					<Icon name={pending ? "progress_activity" : "download"} className={cn("text-[15px]", pending && "animate-spin")} />
				</button>
			</div>
		</div>
	);
}
