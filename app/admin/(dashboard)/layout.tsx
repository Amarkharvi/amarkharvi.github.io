import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";

// Every page below reads cookies() itself (see lib/admin/guard.ts), so this subtree always blocks
// on a request-time check and can't be part of the static shell.
export const instant = false;

// IMPORTANT: this layout does NOT gate `children` — a layout wrapping an opaque `children` prop in a
// cookie-reading guard does not stop the page's own data fetch from running, because Next renders the
// page segment independently of what the layout does with it. Real authorization lives in each page.tsx,
// which calls `requireAdmin()` as the first line of the exact component that fetches and renders its data.
export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-dvh flex-col bg-surface">
			<AdminNav />
			<main className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6">{children}</main>
		</div>
	);
}
