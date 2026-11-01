import { createDownloadToken } from "@/lib/payments/download-token";
import { fetchOrder, fetchPayment, verifyPaymentSignature } from "@/lib/payments/razorpay";
import { findProduct } from "@/lib/products";
import { rateLimited } from "@/lib/rate-limit";
import type { VerifyResult } from "@/lib/shop-types";

const ID_PATTERN = /^[A-Za-z0-9_]{6,64}$/;
const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/;

function fail(message: string, status: number) {
	return Response.json({ ok: false, message } satisfies VerifyResult, { status });
}

export async function POST(request: Request) {
	if (rateLimited(request, "shop-verify", 20, 10 * 60 * 1000)) return fail("Too many attempts — please wait a few minutes.", 429);

	const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
	const orderId = String(body?.orderId ?? "");
	const paymentId = String(body?.paymentId ?? "");
	const signature = String(body?.signature ?? "");
	if (!ID_PATTERN.test(orderId) || !ID_PATTERN.test(paymentId) || !SIGNATURE_PATTERN.test(signature)) {
		return fail("Payment details were incomplete.", 422);
	}
	if (!verifyPaymentSignature(orderId, paymentId, signature)) {
		return fail("We couldn't verify this payment. If you were charged, contact Amar with your payment ID.", 400);
	}

	try {
		const [order, payment] = await Promise.all([fetchOrder(orderId), fetchPayment(paymentId)]);
		const product = await findProduct(order.notes?.productId);
		const paid = payment.order_id === orderId && (payment.status === "captured" || payment.status === "authorized");
		if (!product || !paid || order.amount !== product.price) {
			console.error("[shop] verification mismatch", { orderId, paymentId, status: payment.status, amount: order.amount });
			return fail("This payment doesn't match the order. Contact Amar with your payment ID.", 409);
		}

		const { token, expiresAt } = createDownloadToken(orderId, product.id);
		const downloads = product.files.map((file) => ({
			label: file.label,
			url: `/api/shop/download?token=${encodeURIComponent(token)}&file=${file.slug}`,
		}));
		console.info("[shop] sale verified", { orderId, paymentId, productId: product.id, email: order.notes?.email });
		return Response.json({ ok: true, productName: product.name, downloads, expiresAt } satisfies VerifyResult);
	} catch (error) {
		console.error("[shop] verification failed", error);
		return fail("Payment received, but the download couldn't be prepared. Contact Amar with your payment ID.", 502);
	}
}
