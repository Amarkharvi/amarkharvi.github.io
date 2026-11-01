"use client";

import { useEffect, useState } from "react";
import { ProductsEditor } from "@/components/admin/products-editor";
import { AdminLoading } from "@/components/admin/fields";
import { loadJson, loadUploads, type UploadItem } from "@/lib/admin/browser-store";
import { defaultProducts, type Product } from "@/lib/products-data";

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [media, setMedia] = useState<UploadItem[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([loadJson("products", defaultProducts), loadUploads()])
			.then(([nextProducts, nextMedia]) => {
				if (!live) return;
				setProducts(nextProducts);
				setMedia(nextMedia);
			})
			.catch((reason: unknown) => {
				if (live) setError(reason instanceof Error ? reason.message : "Couldn't load the shop.");
			});
		return () => {
			live = false;
		};
	}, []);

	if (error) return <p className="font-sans text-[13px] text-red-500">{error}</p>;
	if (!products || !media) return <AdminLoading />;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">LUT Shop</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Edit the name, price, description, and preview image for each LUT. The .cube files stay in <code className="font-mono">private/luts</code> and aren&apos;t editable here.
				</p>
			</div>
			<ProductsEditor initialProducts={products} media={media} />
		</div>
	);
}
