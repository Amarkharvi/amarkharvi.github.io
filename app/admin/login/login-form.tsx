"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { signIn } from "@/lib/admin/browser-store";
import { IS_STATIC_SITE } from "@/lib/is-static";

export function LoginForm() {
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const secret = String(new FormData(event.currentTarget).get("secret") ?? "");
		setPending(true);
		setError(null);
		const message = await signIn(secret);
		setPending(false);
		if (message) {
			setError(message);
			return;
		}
		router.push("/admin");
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<label className="flex flex-col gap-1.5">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
					{IS_STATIC_SITE ? "GitHub token" : "Admin password"}
				</span>
				<input
					type="password"
					name="secret"
					required
					autoFocus
					autoComplete="current-password"
					placeholder={IS_STATIC_SITE ? "github_pat_…" : undefined}
					className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-mono text-[14px] text-on-surface outline-none focus:border-primary"
				/>
			</label>
			{IS_STATIC_SITE ? (
				<p className="font-sans text-[12px] leading-relaxed text-on-surface-variant">
					This hosted admin has no server. A fine-grained GitHub token with Contents access to{" "}
					<code className="font-mono">Amarkharvi/amarkharvi.github.io</code> saves edits by committing them. It stays in this browser tab.
				</p>
			) : null}
			{error ? (
				<p role="alert" className="rounded-lg bg-secondary-fixed px-3 py-2 font-sans text-[13px] text-on-secondary-fixed">
					{error}
				</p>
			) : null}
			<button
				type="submit"
				disabled={pending}
				className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 font-sans text-label-pill font-bold text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 dark:shadow-glow"
			>
				{pending ? "Checking…" : "Sign in"}
				<Icon name="login" className="text-[16px]" />
			</button>
		</form>
	);
}
