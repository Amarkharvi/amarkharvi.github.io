import type { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";

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
