import type { InquiryPayload, InquiryResult } from "./inquiry";

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
	try {
		const res = await fetch("/api/inquiry", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const body = (await res.json().catch(() => null)) as InquiryResult | null;
		if (body) return body;
		return { ok: false, message: `Request failed (HTTP ${res.status}).` };
	} catch {
		return { ok: false, message: "Network error — please try again or email directly." };
	}
}
