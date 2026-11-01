import type { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";

// Every page below is a client component that loads its own data after checking the session
// (see AdminGuard and each page.tsx), so there's nothing here for Next to statically validate for
// instant navigation — without this, Next drops the page segment from some client transitions
// instead of rendering it (https://nextjs.org/docs/messages/instant-unrendered-segment).
export const instant = false;

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-dvh flex-col bg-surface">
			<AdminNav />
			<main className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6">
				<AdminGuard>{children}</AdminGuard>
			</main>
		</div>
	);
}
