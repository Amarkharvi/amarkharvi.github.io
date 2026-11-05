"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { EMAIL_PATTERN } from "@/lib/inquiry";
import type { OrderChannel } from "@/lib/site-settings-data";

function whatsappDigits(value: string) {
	return value.replace(/\D/g, "");
}

const channelCopy: Record<OrderChannel, { name: string; icon: string; submit: string; button: string; pill: string }> = {
	instagram: {
		name: "Instagram",
		icon: "photo_camera",
		submit: "Open Instagram chat",
		button: "bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 text-white",
		pill: "bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 text-white",
	},
	whatsapp: {
		name: "WhatsApp",
		icon: "chat",
		submit: "Send order on WhatsApp",
		button: "bg-[#25D366] text-white",
		pill: "bg-[#25D366] text-white",
	},
};

export function BuyButton({
	productName,
	priceLabel,
	files,
	channel,
	whatsapp,
	instagram,
	featured,
}: {
	productName: string;
	priceLabel: string;
	files: string[];
	channel: OrderChannel;
	whatsapp: string;
	/** Instagram username (no @) that receives the DM when `channel` is "instagram". */
	instagram: string;
	featured?: boolean;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [sentText, setSentText] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const number = whatsappDigits(whatsapp);
	const copy = channelCopy[channel];
	const sent = sentText !== null;

	function open() {
		setMessage(null);
		dialogRef.current?.showModal();
	}

	async function copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	}

	function order(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const name = String(data.get("name") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const note = String(data.get("note") ?? "").trim();
		if (name.length < 2) {
			setMessage("Enter your name so Amar knows who the order is from.");
			return;
		}
		if (!EMAIL_PATTERN.test(email)) {
			setMessage("Enter a valid email so the LUT files can be sent back to you.");
			return;
		}
		if (channel === "whatsapp" && number.length < 8) {
			setMessage("WhatsApp orders aren't set up yet. Try the contact form on the About page.");
			return;
		}
		if (channel === "instagram" && !instagram) {
			setMessage("Instagram orders aren't set up yet. Try the contact form on the About page.");
			return;
		}

		const lines = [
			"Hi Amar, I'd like to buy a LUT.",
			"",
			`Look: ${productName}`,
			`Price: ${priceLabel}`,
			`Files: ${files.join(", ")}`,
			`Name: ${name}`,
			`Email: ${email}`,
		];
		if (note) lines.push(`Note: ${note}`);
		const text = lines.join("\n");

		// Open the chat first, synchronously, so the browser treats it as part of the click.
		if (channel === "whatsapp") {
			window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
		} else {
			window.open(`https://ig.me/m/${instagram}`, "_blank", "noopener,noreferrer");
			void copyText(text);
		}
		setMessage(null);
		setSentText(text);
	}

	return (
		<>
			<button
				type="button"
				onClick={open}
				className={cn(
					"flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-sans text-label-pill font-bold shadow-md transition-all hover:brightness-110 active:scale-[0.98]",
					copy.button,
					featured && "dark:shadow-glow",
				)}
			>
				<Icon name={copy.icon} className="text-[18px]" filled />
				{sent ? `Order again on ${copy.name}` : `Order on ${copy.name} — ${priceLabel}`}
			</button>

			<dialog
				ref={dialogRef}
				aria-label={`Order ${productName} on ${copy.name}`}
				className="m-auto w-[min(92vw,420px)] rounded-2xl bg-surface-container-lowest p-0 text-on-surface shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm dark:border dark:border-primary/20 dark:bg-surface-container-low"
			>
				<div className="flex flex-col gap-4 p-5">
					<div className="flex items-start justify-between gap-3">
						<div>
							<span className="font-mono text-label-mono uppercase tracking-wider text-tertiary">{copy.name} order</span>
							<h2 className="font-headline text-headline-sm font-semibold">{productName}</h2>
							<p className="font-mono text-[13px] font-bold text-primary">{priceLabel}</p>
						</div>
						<button
							type="button"
							onClick={() => dialogRef.current?.close()}
							aria-label="Close"
							className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface"
						>
							<Icon name="close" className="text-[20px]" />
						</button>
					</div>

					{sent ? (
						<div className="flex flex-col gap-3" aria-live="polite">
							<p className="flex items-center gap-2 rounded-xl bg-primary-fixed px-3 py-2 font-sans text-body-dense font-semibold text-on-primary-fixed">
								<Icon name="check_circle" className="text-[18px]" filled />
								{channel === "whatsapp" ? "WhatsApp opened with your order." : "Instagram chat opened."}
							</p>
							{channel === "whatsapp" ? (
								<p className="font-sans text-[13px] text-on-surface-variant">
									Send that message. Amar replies on WhatsApp with payment details and the LUT files.
								</p>
							) : (
								<>
									<p className="font-sans text-[13px] text-on-surface-variant">
										{copied
											? "Your order message is copied. Paste it into the chat and send it."
											: "Instagram can't prefill a message. Copy this, paste it into the chat, and send it."}
									</p>
									<pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-surface p-3 font-mono text-[12px] leading-relaxed text-on-surface">{sentText}</pre>
									<div className="flex flex-col gap-2 sm:flex-row">
										<button
											type="button"
											onClick={() => void copyText(sentText)}
											className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 font-sans text-label-pill font-bold text-on-primary"
										>
											<Icon name={copied ? "check" : "content_copy"} className="text-[16px]" />
											{copied ? "Copied" : "Copy message"}
										</button>
										<a
											href={`https://ig.me/m/${instagram}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-surface-container px-4 py-2.5 font-sans text-label-pill font-bold text-on-surface hover:bg-surface-container-high"
										>
											<Icon name="open_in_new" className="text-[16px]" />
											Reopen chat
										</a>
									</div>
								</>
							)}
							<button
								type="button"
								onClick={() => {
									setSentText(null);
									setCopied(false);
								}}
								className="rounded-full bg-surface-container px-4 py-2.5 font-sans text-label-pill font-bold text-on-surface hover:bg-surface-container-high"
							>
								Edit details
							</button>
						</div>
					) : (
						<form onSubmit={order} className="flex flex-col gap-3">
							<label className="flex flex-col gap-1.5">
								<span className="font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Your name</span>
								<span className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 py-2.5 focus-within:border-primary">
									<Icon name="person" className="text-[18px] text-outline" />
									<input
										name="name"
										required
										maxLength={120}
										autoComplete="name"
										placeholder="Your name"
										className="w-full bg-transparent font-sans text-body-dense outline-none placeholder:text-outline"
									/>
								</span>
							</label>
							<label className="flex flex-col gap-1.5">
								<span className="font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Email for the files</span>
								<span className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 py-2.5 focus-within:border-primary">
									<Icon name="mail" className="text-[18px] text-outline" />
									<input
										name="email"
										type="email"
										required
										maxLength={200}
										autoComplete="email"
										placeholder="you@studio.com"
										className="w-full bg-transparent font-sans text-body-dense outline-none placeholder:text-outline"
									/>
								</span>
							</label>
							<label className="flex flex-col gap-1.5">
								<span className="font-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Note (optional)</span>
								<textarea
									name="note"
									maxLength={300}
									rows={2}
									placeholder="Editor, project, or anything else"
									className="resize-y rounded-xl border border-outline-variant bg-surface px-3 py-2.5 font-sans text-body-dense outline-none placeholder:text-outline focus:border-primary"
								/>
							</label>
							{message ? (
								<p role="alert" className="rounded-lg bg-error/10 px-3 py-2 font-sans text-body-dense text-error">
									{message}
								</p>
							) : null}
							<button
								type="submit"
								className={cn("flex items-center justify-center gap-2 rounded-full px-5 py-3 font-sans font-bold shadow-lg transition-all hover:brightness-110 active:scale-[0.98]", copy.pill)}
							>
								<Icon name={copy.icon} className="text-[18px]" filled />
								{copy.submit}
							</button>
							<p className="text-center font-sans text-[11px] text-on-surface-variant">
								{channel === "whatsapp"
									? "This opens WhatsApp with the look, price, and your details already filled in. You send the message yourself."
									: "This opens an Instagram chat with Amar and copies your order, so you can paste it and send it yourself."}
							</p>
						</form>
					)}
				</div>
			</dialog>
		</>
	);
}
