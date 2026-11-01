import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin/guard";
import { ADMIN_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, adminLoginConfigured, createSessionToken, verifyAdminPassword } from "@/lib/admin/session";

export async function GET() {
	return Response.json({ ok: await isAdminAuthenticated() });
}

export async function POST(request: Request) {
	if (!adminLoginConfigured()) {
		return Response.json({ error: "Admin login isn't configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." }, { status: 503 });
	}
	const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
	const password = typeof body?.password === "string" ? body.password : "";
	if (!verifyAdminPassword(password)) {
		return Response.json({ error: "That password isn't right." }, { status: 401 });
	}
	const token = createSessionToken();
	if (!token) {
		return Response.json({ error: "Admin login isn't configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." }, { status: 503 });
	}
	// Path must cover both the `/admin` pages and the `/api/admin/*` routes the browser admin
	// calls — a browser only attaches a cookie to requests under its Path, and `/api/admin/...`
	// does not start with `/admin`. (This is a real bug fix: that mismatch silently dropped the
	// cookie on every `/api/admin/*` call, so the admin guard always saw "signed out".)
	(await cookies()).set(ADMIN_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
	return Response.json({ ok: true });
}

export async function DELETE() {
	(await cookies()).delete({ name: ADMIN_COOKIE_NAME, path: "/" });
	return Response.json({ ok: true });
}
