"use server";

import { revalidatePath, updateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { saveCredentials, saveTechStack, type Credentials, type TechStackItem } from "@/lib/content";

export type StackFormState = { error: string | null; saved: boolean };

function isTechStackItem(value: unknown): value is TechStackItem {
	if (!value || typeof value !== "object") return false;
	const item = value as Record<string, unknown>;
	return typeof item.label === "string" && item.label.trim().length > 0 && typeof item.dot === "string" && (item.group === "focus" || item.group === "web" || item.group === "server");
}

export async function saveTechStackAction(_prevState: StackFormState, formData: FormData): Promise<StackFormState> {
	await assertAdmin();
	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("techStack") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isTechStackItem)) {
		return { error: "Every skill needs a label and a group.", saved: false };
	}
	await saveTechStack(parsed);
	updateTag("content:tech-stack");
	revalidatePath("/lab");
	return { error: null, saved: true };
}

function isCredential(value: unknown): boolean {
	if (!value || typeof value !== "object") return false;
	const item = value as Record<string, unknown>;
	return typeof item.icon === "string" && typeof item.title === "string" && typeof item.body === "string";
}

function isCredentials(value: unknown): value is Credentials {
	if (!value || typeof value !== "object") return false;
	const data = value as Record<string, unknown>;
	return Array.isArray(data.cinema) && data.cinema.every(isCredential) && Array.isArray(data.engineering) && data.engineering.every(isCredential);
}

export async function saveCredentialsAction(_prevState: StackFormState, formData: FormData): Promise<StackFormState> {
	await assertAdmin();
	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("credentials") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!isCredentials(parsed)) {
		return { error: "Each credential needs an icon, a title, and body text.", saved: false };
	}
	await saveCredentials(parsed);
	updateTag("content:credentials");
	revalidatePath("/about");
	return { error: null, saved: true };
}
