export type InquiryKind = "cinema" | "advisory" | "papers";

export type InquiryPayload = {
	kind: InquiryKind;
	email: string;
	projectType?: string;
	timeline?: string;
	locations?: string;
	gear?: string;
	focusArea?: string;
	duration?: string;
	stack?: string;
};

export type InquiryResult = { ok: true; id: string; message: string } | { ok: false; message: string; fields?: string[] };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD_LENGTH = 300;

const requiredByKind: Record<InquiryKind, (keyof InquiryPayload)[]> = {
	cinema: ["email", "projectType", "timeline", "locations", "gear"],
	advisory: ["email", "focusArea", "duration", "stack"],
	papers: ["email"],
};

const optionalKeys: (keyof InquiryPayload)[] = ["projectType", "timeline", "locations", "gear", "focusArea", "duration", "stack"];

export function validateInquiry(input: unknown): { ok: true; data: InquiryPayload } | { ok: false; message: string; fields: string[] } {
	if (typeof input !== "object" || input === null) {
		return { ok: false, message: "Malformed request body.", fields: [] };
	}
	const raw = input as Record<string, unknown>;
	const kind = raw.kind;
	if (kind !== "cinema" && kind !== "advisory" && kind !== "papers") {
		return { ok: false, message: "Unknown inquiry type.", fields: ["kind"] };
	}

	const data: InquiryPayload = { kind, email: "" };
	const invalid: string[] = [];

	for (const key of ["email", ...optionalKeys] as const) {
		const value = raw[key];
		if (value === undefined || value === null || value === "") continue;
		if (typeof value !== "string" || value.length > MAX_FIELD_LENGTH) {
			invalid.push(key);
			continue;
		}
		data[key] = value.trim() as never;
	}

	for (const key of requiredByKind[kind]) {
		if (!data[key]) invalid.push(key);
	}
	if (data.email && !EMAIL_PATTERN.test(data.email)) invalid.push("email");

	if (invalid.length) {
		const unique = [...new Set(invalid)];
		return { ok: false, message: `Please check: ${unique.join(", ")}.`, fields: unique };
	}
	return { ok: true, data };
}
