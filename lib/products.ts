import { cacheTag } from "next/cache";
import { defaultProducts, type Product } from "./products-data";

export type { LutFile, Product } from "./products-data";
export { CURRENCY, defaultProducts, formatPrice } from "./products-data";

export async function getProducts(): Promise<Product[]> {
	"use cache";
	cacheTag("content:products");
	const { readContent } = await import("./content-store");
	return readContent("products", defaultProducts);
}

export async function saveProducts(products: Product[]): Promise<void> {
	const { writeContent } = await import("./content-store");
	await writeContent("products", products);
}

export async function findProduct(id: unknown): Promise<Product | undefined> {
	if (typeof id !== "string") return undefined;
	const products = await getProducts();
	return products.find((product) => product.id === id);
}
