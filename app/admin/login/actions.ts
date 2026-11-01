"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, adminLoginConfigured, createSessionToken, verifyAdminPassword } from "@/lib/admin/session";

export type LoginState = { error: string | null };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
	if (!adminLoginConfigured()) {
		return { error: "Admin login isn't configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." };
	}

	const password = String(formData.get("password") ?? "");
	if (!verifyAdminPassword(password)) {
		return { error: "That password isn't right." };
	}

	const token = createSessionToken();
	if (!token) {
		return { error: "Admin login isn't configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." };
	}

	(await cookies()).set(ADMIN_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/admin",
		maxAge: SESSION_MAX_AGE_SECONDS,
	});

	redirect("/admin");
}

export async function logoutAction(): Promise<void> {
	(await cookies()).delete({ name: ADMIN_COOKIE_NAME, path: "/admin" });
	redirect("/admin/login");
}
