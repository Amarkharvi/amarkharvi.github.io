import { readFile } from "node:fs/promises";
import path from "node:path";
import { readDownloadToken } from "@/lib/payments/download-token";
import { findProduct } from "@/lib/products";

const LUT_DIR = path.join(process.cwd(), "private", "luts");

export async function GET(request: Request) {
	const url = new URL(request.url);
	const payload = readDownloadToken(url.searchParams.get("token"));
	if (!payload) return new Response("This download link has expired or is invalid.", { status: 403 });

	const product = await findProduct(payload.p);
	const file = product?.files.find((entry) => entry.slug === url.searchParams.get("file"));
	if (!file) return new Response("File not found.", { status: 404 });

	try {
		const data = await readFile(path.join(LUT_DIR, file.file));
		return new Response(new Uint8Array(data), {
			headers: {
				"Content-Type": "application/octet-stream",
				"Content-Disposition": `attachment; filename="${file.file}"`,
				"Cache-Control": "private, no-store",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error("[shop] LUT file missing", file.file, error);
		return new Response("The file is temporarily unavailable. Contact Amar with your order ID.", { status: 500 });
	}
}
