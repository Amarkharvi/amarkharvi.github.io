import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Drop cached content and refresh every public surface that can show admin media.
 * Call after films / about / products / site / stack saves so Dual Persona, Cinema,
 * Shop, Lab, and About all pick up the same files.
 */
export function revalidatePublicSite(tags: string[] = []) {
	for (const tag of tags) {
		revalidateTag(tag, { expire: 0 });
	}
	for (const path of ["/", "/cinema", "/cinema/quiet-moments", "/about", "/lab", "/lab/spectra-wgsl", "/shop", "/shop/policies", "/admin"]) {
		revalidatePath(path);
	}
}
