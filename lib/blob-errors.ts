import "server-only";

/** Map raw `@vercel/blob` failures into a short fix the admin can act on. */
export function explainBlobError(error: unknown): string {
	const message = error instanceof Error ? error.message : String(error);

	if (/store does not exist/i.test(message)) {
		return "The Blob store linked to this project is missing or the token is stale. In Vercel → Storage, open a Private Blob store, connect it to this project (so BLOB_READ_WRITE_TOKEN refreshes), then redeploy.";
	}
	if (/private access on a public store/i.test(message)) {
		return "This Blob store is still Public. Dual Persona needs Private access. In Vercel → Storage → your store → set Access to Private, then retry.";
	}
	if (/public access on a private store/i.test(message)) {
		return "This Blob store is Private, but the request asked for Public access. Redeploy the latest code so uploads and content both use private access.";
	}
	if (/failed to fetch blob:\s*400/i.test(message) || /400 Bad Request/i.test(message)) {
		return "Blob returned 400 — usually the store Access mode does not match the token. Set the store to Private, reconnect it to this project, redeploy, then save again.";
	}
	if (/unauthorized|forbidden|401|403/i.test(message)) {
		return "Blob rejected the token. Reconnect the Private store to this Vercel project and redeploy so the env vars refresh.";
	}

	return message.startsWith("Vercel Blob:") ? message.replace(/^Vercel Blob:\s*/i, "") : message;
}

export function isMissingBlobStoreError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : String(error);
	return /store does not exist/i.test(message);
}
