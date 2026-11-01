import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "dp_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
const MIN_SECRET_LENGTH = 32;

function sessionSecret(): string | null {
	const value = process.env.ADMIN_SESSION_SECRET;
	return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

export type AdminLoginStatus = "ready" | "missing" | "secret-too-short";

/** Why the login form is or isn't available. The session secret must be at least 32 characters. */
export function adminLoginStatus(): AdminLoginStatus {
	if (!process.env.ADMIN_PASSWORD?.trim()) return "missing";
	const secret = process.env.ADMIN_SESSION_SECRET;
	if (!secret) return "missing";
	if (secret.length < MIN_SECRET_LENGTH) return "secret-too-short";
	return "ready";
}

/** True once ADMIN_PASSWORD and a long-enough ADMIN_SESSION_SECRET are both set. */
export function adminLoginConfigured(): boolean {
	return adminLoginStatus() === "ready";
}

function constantTimeEquals(a: string, b: string): boolean {
	const bufferA = Buffer.from(a);
	const bufferB = Buffer.from(b);
	if (bufferA.length !== bufferB.length) {
		// still run a compare so a length mismatch doesn't return measurably faster
		timingSafeEqual(bufferA, bufferA);
		return false;
	}
	return timingSafeEqual(bufferA, bufferB);
}

export function verifyAdminPassword(password: string): boolean {
	const expected = process.env.ADMIN_PASSWORD;
	if (!expected || !password) return false;
	return constantTimeEquals(password, expected);
}

function sign(payload: string, secret: string): string {
	return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Returns a signed, expiring session token, or null if the admin login isn't configured. */
export function createSessionToken(): string | null {
	const secret = sessionSecret();
	if (!secret) return null;
	const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString("base64url");
	return `${payload}.${sign(payload, secret)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
	const secret = sessionSecret();
	if (!secret || !token) return false;
	const [payload, signature] = token.split(".");
	if (!payload || !signature) return false;
	if (!constantTimeEquals(signature, sign(payload, secret))) return false;
	try {
		const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
		return typeof data.exp === "number" && data.exp > Date.now();
	} catch {
		return false;
	}
}
