import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "./session";

export async function isAdminAuthenticated(): Promise<boolean> {
	// Session expiry uses Date.now(). That has to run at request time — Cache Components rejects it during prerender.
	await connection();
	const store = await cookies();
	return isValidSessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

/** Redirects to /admin/login when there's no valid admin session. Call from inside a Suspense boundary. */
export async function requireAdmin(): Promise<void> {
	if (!(await isAdminAuthenticated())) {
		redirect("/admin/login");
	}
}

/** Throws when there's no valid admin session. Call at the top of every admin Server Action — the
 * layout guard only gates the UI, not a direct POST to the action. */
export async function assertAdmin(): Promise<void> {
	if (!(await isAdminAuthenticated())) {
		throw new Error("Unauthorized — sign in at /admin/login.");
	}
}
