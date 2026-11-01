import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/fields";
import { ProductsEditor } from "@/components/admin/products-editor";
import { requireAdmin } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "LUT Shop", robots: { index: false, follow: false } };

export default function AdminProductsPage() {
	return (
		<Suspense fallback={<AdminLoading />}>
			<ProductsContent />
		</Suspense>
	);
}

async function ProductsContent() {
	await requireAdmin();
	const [products, media] = await Promise.all([getProducts(), listMedia()]);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-headline text-headline-sm font-semibold text-on-surface">LUT Shop</h1>
				<p className="font-sans text-[13px] text-on-surface-variant">
					Edit the name, price, description, and preview image for each LUT. The .cube files stay in{" "}
					<code className="font-mono">private/luts</code> and aren&apos;t editable here.
				</p>
			</div>
			<ProductsEditor initialProducts={products} media={media} />
		</div>
	);
}
