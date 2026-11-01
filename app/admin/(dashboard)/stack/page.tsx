"use client";

import { useEffect, useState } from "react";
import { CredentialsEditor } from "@/components/admin/credentials-editor";
import { TechStackEditor } from "@/components/admin/tech-stack-editor";
import { AdminLoading } from "@/components/admin/fields";
import { loadJson } from "@/lib/admin/browser-store";
import { defaultCredentials, defaultTechStack, type Credentials, type TechStackItem } from "@/lib/content-data";

export default function AdminStackPage() {
	const [techStack, setTechStack] = useState<TechStackItem[] | null>(null);
	const [credentials, setCredentials] = useState<Credentials | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([loadJson("tech-stack", defaultTechStack), loadJson("credentials", defaultCredentials)])
			.then(([nextStack, nextCredentials]) => {
				if (!live) return;
				setTechStack(nextStack);
				setCredentials(nextCredentials);
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load the stack.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!techStack || !credentials) return <AdminLoading />;

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
