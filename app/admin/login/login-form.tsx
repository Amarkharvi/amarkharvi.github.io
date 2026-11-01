"use client";

import { useActionState } from "react";
import { Icon } from "@/components/ui/icon";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
	const [state, action, pending] = useActionState(loginAction, initialState);

	return (
		<form action={action} className="flex flex-col gap-4">
			<label className="flex flex-col gap-1.5">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Admin password</span>
				<input
					type="password"
					name="password"
					required
					autoFocus
					autoComplete="current-password"
					className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-mono text-[14px] text-on-surface outline-none focus:border-primary"
				/>
			</label>
			{state.error ? (
				<p role="alert" className="rounded-lg bg-secondary-fixed px-3 py-2 font-sans text-[13px] text-on-secondary-fixed">
					{state.error}
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
