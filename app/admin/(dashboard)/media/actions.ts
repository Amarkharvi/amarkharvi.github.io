"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { deleteMedia, saveMedia } from "@/lib/admin/media";

export type UploadState = { error: string | null };

export async function uploadMediaAction(_prevState: UploadState, formData: FormData): Promise<UploadState> {
	await assertAdmin();
	const file = formData.get("file");
	if (!(file instanceof File) || file.size === 0) {
		return { error: "Choose an image or video first." };
	}
	try {
		await saveMedia(file);
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Upload failed." };
	}
	revalidatePath("/admin/media");
	return { error: null };
}

export async function deleteMediaAction(name: string): Promise<void> {
	await assertAdmin();
	await deleteMedia(name);
	revalidatePath("/admin/media");
}
