import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.razorpay.com/v1";

export type RazorpayOrder = {
	id: string;
	amount: number;
	amount_paid: number;
	currency: string;
	receipt: string;
	status: "created" | "attempted" | "paid";
	notes: Record<string, string>;
};

export type RazorpayPayment = {
	id: string;
	order_id: string;
	status: "created" | "authorized" | "captured" | "refunded" | "failed";
	amount: number;
	currency: string;
	email?: string;
};

export function razorpayConfig() {
	const keyId = process.env.RAZORPAY_KEY_ID;
	const keySecret = process.env.RAZORPAY_KEY_SECRET;
	if (!keyId || !keySecret) return null;
	return { keyId, keySecret };
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
	const config = razorpayConfig();
	if (!config) throw new Error("Razorpay is not configured");
	const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64");
	const res = await fetch(`${API}${path}`, {
		...init,
		headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json", ...init.headers },
		cache: "no-store",
	});
	if (!res.ok) {
		const detail = await res.text().catch(() => "");
		throw new Error(`Razorpay ${path} responded ${res.status}: ${detail.slice(0, 300)}`);
	}
	return (await res.json()) as T;
}

export function createOrder(input: { amount: number; currency: string; receipt: string; notes: Record<string, string> }) {
	return call<RazorpayOrder>("/orders", { method: "POST", body: JSON.stringify(input) });
}

export function fetchOrder(orderId: string) {
	return call<RazorpayOrder>(`/orders/${encodeURIComponent(orderId)}`);
}

export function fetchPayment(paymentId: string) {
	return call<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`);
}

export function safeEqualHex(expected: string, received: string) {
	const a = Buffer.from(expected, "hex");
	const b = Buffer.from(received, "hex");
	return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
	const config = razorpayConfig();
	if (!config) return false;
	const expected = createHmac("sha256", config.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
	return safeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
	const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
	if (!secret || !signature) return false;
	const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
	return safeEqualHex(expected, signature);
}
