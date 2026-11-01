import { verifyWebhookSignature } from "@/lib/payments/razorpay";

type WebhookEvent = {
	event: string;
	payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; email?: string; status: string; notes?: Record<string, string> } } };
};

export async function POST(request: Request) {
	const raw = await request.text();
	if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature"))) {
		return new Response("Invalid signature", { status: 401 });
	}

	let event: WebhookEvent;
	try {
		event = JSON.parse(raw) as WebhookEvent;
	} catch {
		return new Response("Malformed payload", { status: 400 });
	}
	const payment = event.payload?.payment?.entity;
	const record = {
		event: event.event,
		paymentId: payment?.id,
		orderId: payment?.order_id,
		amount: payment?.amount,
		email: payment?.email,
		status: payment?.status,
		receivedAt: new Date().toISOString(),
	};
	console.info("[shop] webhook", record);

	const notify = process.env.INQUIRY_WEBHOOK_URL;
	if (notify && (event.event === "payment.captured" || event.event === "order.paid")) {
		await fetch(notify, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ kind: "lut-sale", ...record }),
		}).catch((error) => console.error("[shop] sale notification failed", error));
	}

	return Response.json({ received: true });
}
