import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;
const MIN_SECRET_LENGTH = 32;

type TokenPayload = { o: string; p: string; exp: number };

function secret() {
	const value = process.env.DOWNLOAD_TOKEN_SECRET;
	return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

export function downloadsConfigured() {
	return secret() !== null;
}

function sign(body: string, key: string) {
	return createHmac("sha256", key).update(body).digest("base64url");
}

export function createDownloadToken(orderId: string, productId: string) {
	const key = secret();
	if (!key) throw new Error("DOWNLOAD_TOKEN_SECRET is missing or shorter than 32 characters");
	const exp = Date.now() + TOKEN_TTL_MS;
	const body = Buffer.from(JSON.stringify({ o: orderId, p: productId, exp } satisfies TokenPayload)).toString("base64url");
	return { token: `${body}.${sign(body, key)}`, expiresAt: exp };
}

export function readDownloadToken(token: string | null): TokenPayload | null {
	const key = secret();
	if (!key || !token) return null;
	const [body, signature] = token.split(".");
	if (!body || !signature) return null;
	const expected = Buffer.from(sign(body, key));
	const received = Buffer.from(signature);
	if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
	try {
		const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TokenPayload;
		if (typeof payload.o !== "string" || typeof payload.p !== "string" || typeof payload.exp !== "number") return null;
		return payload.exp > Date.now() ? payload : null;
	} catch {
		return null;
	}
}
