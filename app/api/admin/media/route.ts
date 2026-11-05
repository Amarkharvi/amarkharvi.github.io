import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/guard";
import { deleteMedia, listMedia, saveMedia } from "@/lib/admin/media";

export async function GET() {
	if (!(await isAdminAuthenticated())) return Response.json({ error: "Sign in required." }, { status: 401 });
	return Response.json(await listMedia());
}

export async function POST(request: Request) {
	if (!(await isAdminAuthenticated())) return Response.json({ error: "Sign in required." }, { status: 401 });
	const formData = await request.formData();
	const file = formData.get("file");
	if (!(file instanceof File) || file.size === 0) {
		return Response.json({ error: "Choose an image or video first." }, { status: 400 });
	}
	try {
		const item = await saveMedia(file);
		// Refresh every admin editor so the new file appears in MediaPicker without a hard reload.
		revalidatePath("/admin", "layout");
		return Response.json(item);
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
	}
}

export async function DELETE(request: Request) {
	if (!(await isAdminAuthenticated())) return Response.json({ error: "Sign in required." }, { status: 401 });
	const name = new URL(request.url).searchParams.get("name") ?? "";
	try {
		await deleteMedia(name);
		revalidatePath("/admin", "layout");
		return Response.json({ ok: true });
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : "Delete failed." }, { status: 400 });
	}
}
