"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { downloadFile } from "@/lib/browser";
import { docs } from "@/lib/site";
import { useFlash } from "@/lib/use-flash";

export function StudyActions() {
	const [busy, setBusy] = useState(false);
	const { active, trigger, flashClassName, onAnimationEnd } = useFlash();

	async function downloadPackage() {
		setBusy(true);
		try {
			for (const doc of [docs.lookbook, docs.lut]) {
				const res = await fetch(doc.href, { method: "HEAD" });
				if (!res.ok) throw new Error(`Missing ${doc.file}`);
			}
			downloadFile(docs.lookbook.href, docs.lookbook.file);
			downloadFile(docs.lut.href, docs.lut.file);
			trigger(true);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="flex flex-col gap-2.5">
			<button
				type="button"
				onClick={downloadPackage}
				disabled={busy}
				className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-label-mono font-semibold text-on-primary shadow-lg transition-all hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-70 dark:shadow-glow"
			>
				{busy ? (
					<>
						<Icon name="refresh" className="animate-spin text-[18px]" />
						GENERATING PACKAGE...
					</>
				) : active ? (
					<span className={`flex items-center gap-2 ${flashClassName}`} onAnimationEnd={onAnimationEnd}>
						<Icon name="check_circle" className="text-[18px] text-tertiary-fixed" />
						NOTES &amp; GRADE LUT DOWNLOADED
					</span>
				) : (
					<>
						<Icon name="description" className="text-[18px]" />
						DOWNLOAD NOTES &amp; GRADE LUT (.CUBE)
					</>
				)}
			</button>
			<Link
				href="/about#commission-cinema"
				className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container px-4 py-2.5 text-center font-mono text-label-mono text-on-surface transition-colors hover:bg-surface-container-high"
			>
				<Icon name="mail" className="text-[18px] text-primary" />
				BOOK A SHOOT OR AN EDIT
			</Link>
		</div>
	);
}
