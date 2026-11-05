import "server-only";
import { issueSignedToken, type IssuedSignedToken } from "@vercel/blob";

/**
 * `issueSignedToken` hits the Blob control API. Cache one store-wide read token and reuse it
 * while signing individual media URLs so every `/api/media/...` hit is not a round-trip.
 */
let cached: { token: IssuedSignedToken; refreshAt: number } | null = null;

export async function getBlobReadToken(): Promise<IssuedSignedToken> {
	const now = Date.now();
	if (cached && cached.refreshAt > now) return cached.token;

	const token = await issueSignedToken({
		pathname: "*",
		operations: ["get"],
		validUntil: now + 60 * 60 * 1000,
	});
	// Refresh a minute before expiry so in-flight signs never use a dead token.
	cached = { token, refreshAt: token.validUntil - 60_000 };
	return token;
}
