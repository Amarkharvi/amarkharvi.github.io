import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
	title: "Shop Policies",
	description: "Terms of sale, refund policy, privacy and contact details for Amar Kharvi's LUT shop.",
};

const sections = [
	{
		id: "terms",
		title: "Terms of sale",
		body: [
			"Each purchase gives you a personal, non-transferable licence to use the LUT in your own and your clients' projects, including commercial work.",
			"You may not resell, share, upload or redistribute the LUT files, alone or as part of another pack.",
			"Prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.",
		],
	},
	{
		id: "delivery",
		title: "Delivery",
		body: [
			"LUTs are digital products. Order from the shop page and WhatsApp opens with the look, price, and your details filled in.",
			"Amar replies on that chat with payment details and the .cube files. Keep the chat if you need the files sent again.",
		],
	},
	{
		id: "refunds",
		title: "Cancellation & refunds",
		body: [
			"Payment is arranged directly with Amar on WhatsApp. This site does not take card or UPI payments.",
			"If a file is corrupt or never arrives after you've paid, message the same WhatsApp chat and Amar will send it again or refund you.",
		],
	},
	{
		id: "privacy",
		title: "Privacy",
		body: [
			"The shop does not store your card or UPI details. Your name, email, and order note are only placed in the WhatsApp message you choose to send.",
			"Amar keeps that chat so he can deliver the files and answer follow-ups.",
		],
	},
];

export default function PoliciesPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-8">
			<div>
				<span className="font-mono text-label-mono uppercase tracking-widest text-tertiary">LUT Shop</span>
				<h1 className="font-headline text-headline-lg font-bold text-on-surface">Policies</h1>
				<p className="font-sans text-body-default text-on-surface-variant">Last updated November 2026.</p>
			</div>
			{sections.map((section) => (
				<section key={section.id} id={section.id} className="scroll-mt-20 rounded-2xl bg-surface-container-low p-5 dark:border dark:border-primary/10">
					<h2 className="font-headline text-headline-sm font-semibold text-on-surface">{section.title}</h2>
					<ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 font-sans text-body-dense text-on-surface-variant">
						{section.body.map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</section>
			))}
			<section id="contact" className="scroll-mt-20 rounded-2xl bg-primary-fixed p-5 text-on-primary-fixed">
				<h2 className="font-headline text-headline-sm font-semibold">Contact</h2>
				<p className="mt-1 font-sans text-body-dense">
					{site.name}, {site.location.split(" •")[0]}, India. Place an order from the{" "}
					<Link href="/shop" className="font-bold underline">
						LUT shop
					</Link>
					. It opens WhatsApp with the details already filled in.
				</p>
			</section>
		</div>
	);
}
