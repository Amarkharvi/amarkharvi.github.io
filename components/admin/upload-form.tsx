"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { IS_STATIC_SITE } from "@/lib/is-static";
import { uploadFile } from "@/lib/admin/browser-store";

export function UploadForm({ onUploaded }: { onUploaded: () => void }) {
	const formRef = useRef<HTMLFormElement>(null);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<form
			ref={formRef}
			onSubmit={async (event) => {
				event.preventDefault();
				const file = new FormData(event.currentTarget).get("file");
				if (!(file instanceof File) || file.size === 0) {
					setError("Choose an image or video first.");
					return;
				}
				setPending(true);
				setError(null);
				const message = await uploadFile(file);
				setPending(false);
				if (message) {
					setError(message);
					return;
				}
				formRef.current?.reset();
				onUploaded();
			}}
			className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-4 shadow-card dark:border dark:border-primary/10"
		>
			<div className="flex flex-wrap items-center gap-3">
				<input
					type="file"
					name="file"
					accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
					required
					className="flex-1 font-sans text-[13px] text-on-surface-variant file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-sans file:text-label-pill file:font-bold file:text-on-primary"
				/>
				<button
					type="submit"
					disabled={pending}
					className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-label-pill font-bold text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 dark:shadow-glow"
				>
					{pending ? "Uploading…" : "Upload"}
					<Icon name="upload" className="text-[16px]" />
				</button>
			</div>
			<p className="font-mono text-[11px] text-on-surface-variant">
				{IS_STATIC_SITE
					? "Images or short video, up to 4.5MB. The library shows it right away. Public pages pick it up after the site rebuilds."
					: "Images (jpg, png, webp, gif, avif) or video (mp4, webm, mov), up to 80MB."}
			</p>
			{error ? (
				<p role="alert" className="font-sans text-[12px] text-red-500">
					{error}
				</p>
			) : null}
		</form>
	);
}
