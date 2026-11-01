import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Icon } from "@/components/ui/icon";
import { adminLoginStatus } from "@/lib/admin/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
	title: "Admin sign in",
	robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
	return (
		<div className="flex min-h-[70dvh] flex-col items-center justify-center px-5 py-10">
			<div className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-surface-container-low p-6 shadow-card dark:border dark:border-primary/15">
				<div className="flex items-center gap-2">
					<span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary dark:shadow-glow">
						<Icon name="lock" className="text-[20px]" />
					</span>
					<div>
						<p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Dual Persona</p>
						<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Admin sign in</h1>
					</div>
				</div>

				<Suspense fallback={<p className="font-sans text-[13px] text-on-surface-variant">Checking setup…</p>}>
					<LoginGate />
				</Suspense>
			</div>
		</div>
	);
}

async function LoginGate() {
	// Read env on each request. A static prerender would freeze "not configured" into the page
	// if the build ran before ADMIN_PASSWORD / ADMIN_SESSION_SECRET were set.
	await connection();
	const status = adminLoginStatus();

	if (status === "ready") return <LoginForm />;

	return (
		<p className="rounded-lg bg-secondary-fixed px-3 py-2.5 font-sans text-[13px] text-on-secondary-fixed">
			{status === "secret-too-short" ? (
				<>
					<code className="font-mono">ADMIN_SESSION_SECRET</code> is set, but it has to be at least 32 characters. Generate one with{" "}
					<code className="font-mono">openssl rand -base64 48</code>, put it in <code className="font-mono">.env</code>, then restart the server.
				</>
			) : (
				<>
					Admin login isn&apos;t set up yet. Set <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
					<code className="font-mono">ADMIN_SESSION_SECRET</code> in <code className="font-mono">.env</code>, then restart the server.
				</>
			)}
		</p>
	);
}
