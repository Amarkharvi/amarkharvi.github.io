import type { Metadata } from "next";
import { Suspense } from "react";
import { CredentialsEditor } from "@/components/admin/credentials-editor";
import { AdminLoading } from "@/components/admin/fields";
import { TechStackEditor } from "@/components/admin/tech-stack-editor";
import { requireAdmin } from "@/lib/admin/guard";
import { getCredentials, getTechStack } from "@/lib/content";

export const metadata: Metadata = { title: "Stack & Credentials", robots: { index: false, follow: false } };

export default function AdminStackPage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<StackContent />
		</Suspense>
	);
}

async function StackContent() {
	await requireAdmin();
	const [techStack, credentials] = await Promise.all([getTechStack(), getCredentials()]);

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">Stack & Credentials</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">The skill chips on Code &amp; Lab, and the two credential lists on About.</p>
			</div>

			<section className="flex flex-col gap-3">
				<h2 className="font-headline text-[15px] font-semibold text-on-surface">Skill chips</h2>
				<TechStackEditor initialItems={techStack} />
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-headline text-[15px] font-semibold text-on-surface">Credentials</h2>
				<CredentialsEditor initialCredentials={credentials} />
			</section>
		</div>
	);
}
