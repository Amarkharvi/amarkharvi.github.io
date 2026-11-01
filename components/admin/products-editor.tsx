"use client";

import { useActionState, useState } from "react";
import { Card, Field, SaveBar } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import type { MediaItem } from "@/lib/admin/media";
import type { Product } from "@/lib/products";
import { saveProductsAction, type ProductsFormState } from "@/app/admin/(dashboard)/products/actions";

const initialState: ProductsFormState = { error: null, saved: false };

function toRupees(paise: number | undefined) {
	return typeof paise === "number" ? String(paise / 100) : "";
}

function toPaise(rupees: string): number {
	const value = Math.round(Number(rupees) * 100);
	return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function ProductsEditor({ initialProducts, media }: { initialProducts: Product[]; media: MediaItem[] }) {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [state, action, pending] = useActionState(saveProductsAction, initialState);

	function update(index: number, patch: Partial<Product>) {
		setProducts((prev) => prev.map((product, i) => (i === index ? { ...product, ...patch } : product)));
	}

	return (
		<form action={action} className="flex flex-col gap-4 pb-24">
			<input type="hidden" name="products" value={JSON.stringify(products)} />

			{products.map((product, index) => (
				<Card key={product.id}>
					<div className="flex items-center justify-between gap-2">
						<span className="font-mono text-[11px] font-bold text-primary dark:text-primary-fixed-dim">{product.id}</span>
						<span className="font-mono text-[10px] text-on-surface-variant">{product.files.map((file) => file.label).join(", ")}</span>
					</div>

					<div className="grid gap-3 md:grid-cols-2">
						<Field label="Name" value={product.name} onChange={(value) => update(index, { name: value })} />
						<Field label="Tagline" value={product.tagline} onChange={(value) => update(index, { tagline: value })} />
						<Field label="Price (INR)" value={toRupees(product.price)} onChange={(value) => update(index, { price: toPaise(value) })} />
						<Field label="Compare-at price (INR, optional)" value={toRupees(product.compareAt)} onChange={(value) => update(index, { compareAt: value ? toPaise(value) : undefined })} />
						<Field label="Badge (optional)" value={product.badge ?? ""} onChange={(value) => update(index, { badge: value || undefined })} placeholder="Best value" />
						<Field
							label="Best for (comma separated)"
							value={product.bestFor.join(", ")}
							onChange={(value) =>
								update(index, {
									bestFor: value
										.split(",")
										.map((entry) => entry.trim())
										.filter(Boolean),
								})
							}
						/>
					</div>

					<Field label="Description" value={product.description} onChange={(value) => update(index, { description: value })} as="textarea" />
					<MediaPicker label="Preview image" value={product.image} onChange={(value) => update(index, { image: value })} media={media} />
					<Field label="Image alt text" value={product.imageAlt} onChange={(value) => update(index, { imageAlt: value })} />
					<Field label="Preview CSS filter (advanced)" value={product.preview} onChange={(value) => update(index, { preview: value })} />
				</Card>
			))}

			<SaveBar pending={pending} saved={state.saved} error={state.error} />
		</form>
	);
}
