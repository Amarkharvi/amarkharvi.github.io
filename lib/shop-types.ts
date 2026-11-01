export type CreateOrderResult =
	| { ok: true; orderId: string; amount: number; currency: string; keyId: string; productName: string }
	| { ok: false; message: string };

export type DownloadLink = { label: string; url: string };

export type VerifyResult = { ok: true; productName: string; downloads: DownloadLink[]; expiresAt: number } | { ok: false; message: string };
