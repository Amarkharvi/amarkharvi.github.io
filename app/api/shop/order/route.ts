import { randomBytes } from "node:crypto";
import { EMAIL_PATTERN } from "@/lib/inquiry";
import { downloadsConfigured } from "@/lib/payments/download-token";
import { createOrder, razorpayConfig } from "@/lib/payments/razorpay";
import { CURRENCY, findProduct } from "@/lib/products";
import { rateLimited } from "@/lib/rate-limit";
import type { CreateOrderResult } from "@/lib/shop-types";

function fail(message: string, status: number) {
	return Response.json({ ok: false, message } satisfies CreateOrderResult, { status });
}

export async function POST(request: Request) {
	if (rateLimited(request, "shop-order", 12, 10 * 60 * 1000)) return fail("Too many attempts — please wait a few minutes.", 429);

	const config = razorpayConfig();
	if (!config || !downloadsConfigured()) {
		return fail("Checkout isn't switched on yet. Please check back soon.", 503);
	}

	const body = (await request.json().catch(() => null)) as { productId?: unknown; email?: unknown } | null;
	const product = await findProduct(body?.productId);
	if (!product) return fail("That LUT isn't available.", 404);
	const email = typeof body?.email === "string" ? body.email.trim() : "";
	if (!EMAIL_PATTERN.test(email) || email.length > 200) return fail("Enter a valid email for your receipt.", 422);

	try {
		const order = await createOrder({
			amount: product.price,
			currency: CURRENCY,
			receipt: `lut_${randomBytes(8).toString("hex")}`,
			notes: { productId: product.id, email },
		});
		return Response.json(
			{ ok: true, orderId: order.id, amount: order.amount, currency: order.currency, keyId: config.keyId, productName: product.name } satisfies CreateOrderResult,
			{ status: 201 },
		);
	} catch (error) {
		console.error("[shop] order creation failed", error);
		return fail("Couldn't start checkout. Please try again.", 502);
	}
}
