import type { InquiryPayload, InquiryResult } from "./inquiry";
import { IS_STATIC_SITE } from "./is-static";

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
	// The GitHub Pages export has no `/api/inquiry` — there's no server to run it on. The papers
	// one-pager is just a static PDF, so let that download go through with no sign-up. The other
	// two forms can't actually send anywhere, so point to the social links instead of pretending.
	if (IS_STATIC_SITE) {
		if (payload.kind === "papers") {
			return { ok: true, id: "static-export", message: "No sign-up needed on this static build." };
		}
		return { ok: false, message: "This static preview can't send messages — reach Amar through GitHub, LinkedIn or X instead." };
	}
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
