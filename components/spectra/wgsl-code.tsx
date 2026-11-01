import { Fragment } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Icon } from "@/components/ui/icon";

export const WGSL_SOURCE = `const stack = {
  server: ["ColdFusion", "Django", "Python", "SQL", "PostgreSQL", "shell"],
  browser: ["HTML", "CSS", "JavaScript", "jQuery", "React", "Next.js"],
  pictures: ["Lightroom", "DaVinci Resolve", "Premiere Pro"],
};

export function availableFor() {
  return "Builds, edits, and shoots — Bengaluru and remote.";
}`;

const TOKEN_PATTERN = /(\/\/[^\n]*)|("[^"]*")|\b(const|export|function|return)\b/g;

const tokenClasses = ["text-outline", "text-secondary", "text-tertiary"];

function highlight(source: string) {
	const parts: React.ReactNode[] = [];
	let last = 0;
	for (const match of source.matchAll(TOKEN_PATTERN)) {
		const index = match.index ?? 0;
		if (index > last) parts.push(source.slice(last, index));
		const group = match.slice(1).findIndex(Boolean);
		parts.push(
			<span key={index} className={tokenClasses[group]}>
				{match[0]}
			</span>,
		);
		last = index + match[0].length;
	}
	parts.push(source.slice(last));
	return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

export function WgslCode() {
	return (
		<div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl dark:border dark:border-primary/15">
			<div className="flex items-center justify-between bg-surface-container px-4 py-2.5 text-on-surface">
				<div className="flex items-center gap-2">
					<Icon name="code" className="text-[16px] text-primary" />
					<span className="font-mono text-[11px] font-medium text-on-surface-variant">stack.js</span>
				</div>
				<CopyButton
					text={WGSL_SOURCE}
					label="Copy"
					className="rounded bg-surface-container-high px-2 py-1 font-mono text-[10px] text-on-surface-variant hover:bg-primary hover:text-on-primary"
					iconClassName="text-[13px]"
				/>
			</div>
			<pre className="overflow-x-auto bg-surface-container-lowest p-4 font-mono text-[12px] leading-5 text-on-surface">
				<code>{highlight(WGSL_SOURCE)}</code>
			</pre>
		</div>
	);
}
