"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminLoading } from "@/components/admin/fields";
import { hasSession } from "@/lib/admin/browser-store";

export function AdminGuard({ children }: { children: ReactNode }) {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let live = true;
		hasSession().then((ok) => {
			if (!live) return;
			if (!ok) {
				router.replace("/admin/login");
				return;
			}
			setReady(true);
		});
		return () => {
			live = false;
		};
	}, [router]);

	if (!ready) return <AdminLoading />;
	return children;
}
