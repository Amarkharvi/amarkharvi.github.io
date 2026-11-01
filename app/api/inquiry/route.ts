import { validateInquiry, type InquiryResult } from "@/lib/inquiry";
import { rateLimited } from "@/lib/rate-limit";

const confirmations = {
	cinema: "Shoot request received. Amar will reply from Bengaluru.",
	advisory: "Build request received. Amar will reply from Bengaluru.",
	papers: "Note received. The one-pager download has started.",
} as const;

export async function POST(request: Request) {
	if (rateLimited(request, "inquiry", 8, 10 * 60 * 1000)) {
		return Response.json({ ok: false, message: "Too many requests — please try again shortly." } satisfies InquiryResult, { status: 429 });
	}

	const body = await request.json().catch(() => null);
	const result = validateInquiry(body);
	if (!result.ok) {
		return Response.json({ ok: false, message: result.message, fields: result.fields } satisfies InquiryResult, { status: 422 });
	}

	const id = crypto.randomUUID();
	const record = { id, receivedAt: new Date().toISOString(), ...result.data };
	const webhook = process.env.INQUIRY_WEBHOOK_URL;

	if (webhook) {
		try {
			const res = await fetch(webhook, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(record),
			});
			if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
		} catch (error) {
			console.error("[inquiry] webhook delivery failed", error);
			return Response.json(
				{ ok: false, message: "Could not deliver your inquiry right now — please email directly." } satisfies InquiryResult,
				{ status: 502 },
			);
		}
	} else {
		console.info("[inquiry] received (set INQUIRY_WEBHOOK_URL to forward)", record);
	}

	return Response.json({ ok: true, id, message: confirmations[result.data.kind] } satisfies InquiryResult, { status: 201 });
}
