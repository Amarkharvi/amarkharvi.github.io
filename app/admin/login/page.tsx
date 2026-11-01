import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
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
				<LoginForm />
			</div>
		</div>
	);
}
