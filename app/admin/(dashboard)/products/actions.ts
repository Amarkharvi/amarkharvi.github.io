"use server";

import { revalidatePath, updateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { saveProducts, type Product } from "@/lib/products";

export type ProductsFormState = { error: string | null; saved: boolean };

function isProduct(value: unknown): value is Product {
	if (!value || typeof value !== "object") return false;
	const product = value as Record<string, unknown>;
	return (
		typeof product.id === "string" &&
		typeof product.name === "string" &&
		typeof product.price === "number" &&
		Number.isFinite(product.price) &&
		product.price >= 0 &&
		typeof product.image === "string" &&
		Array.isArray(product.files) &&
		Array.isArray(product.bestFor)
	);
}

export async function saveProductsAction(_prevState: ProductsFormState, formData: FormData): Promise<ProductsFormState> {
	await assertAdmin();

	let parsed: unknown;
	try {
		parsed = JSON.parse(String(formData.get("products") ?? ""));
	} catch {
		return { error: "Couldn't read the form data.", saved: false };
	}
	if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isProduct)) {
		return { error: "Each LUT needs an id, name, a price of 0 or more, and an image.", saved: false };
	}

	const ids = new Set<string>();
	for (const product of parsed) {
		if (!product.id.trim()) return { error: "Every LUT needs an id.", saved: false };
		if (ids.has(product.id)) return { error: `Duplicate id "${product.id}".`, saved: false };
		ids.add(product.id);
	}

	await saveProducts(parsed);
	updateTag("content:products");
	revalidatePath("/shop");

	return { error: null, saved: true };
}
