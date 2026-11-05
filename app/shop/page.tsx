import type { Metadata } from "next";
import Link from "next/link";
import { BuyButton } from "@/components/shop/buy-button";
import { LutPreview } from "@/components/shop/lut-preview";
import { FactDeck } from "@/components/ui/fact-deck";
import { Icon } from "@/components/ui/icon";
import { getFacts } from "@/lib/facts";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/cn";
import { formatPrice, getProducts } from "@/lib/products";
import { getSiteSettings, instagramUsername } from "@/lib/site-settings";

export const metadata: Metadata = {
	title: "LUT Shop",
	description: "Buy Amar Kharvi's reel, portrait and product LUTs (.cube) for Premiere Pro, DaVinci Resolve, Final Cut Pro and CapCut.",
};

const apps = ["DaVinci Resolve", "Premiere Pro", "Final Cut Pro", "CapCut Desktop", "After Effects", "OBS"];

function buildFaqs(chat: string, instagram: boolean) {
	return [
		{ q: "What do I get?", a: `A 33-point .cube LUT file for each look. Amar sends the files on ${chat} after you message him from this page.` },
		{ q: "Which apps does it work in?", a: "Anything that reads .cube LUTs — DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut desktop, After Effects and OBS." },
		{
			q: "How do I pay?",
			a: instagram
				? "Tap Order on Instagram, paste the copied message into the chat and send it. Amar replies with how to pay and the LUT files. No card checkout on this site."
				: "Tap Order on WhatsApp, send the prefilled message, and Amar replies with how to pay and the LUT files. No card checkout on this site.",
		},
		{ q: "Can I use it for client work?", a: "Yes — reels, ads and client projects are fine. Re-selling or sharing the LUT file itself isn't." },
	];
}

export default async function ShopPage() {
	const [products, settings, facts] = await Promise.all([getProducts(), getSiteSettings(), getFacts()]);
	const [featured, ...singles] = [...products].sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)));
	const channel = settings.orderChannel;
	const instagram = channel === "instagram";
	const chat = instagram ? "Instagram" : "WhatsApp";
	const instagramName = instagramUsername(settings.socials.instagram);
	const faqs = buildFaqs(chat, instagram);

	return (
		<div className="flex flex-col gap-10 px-4 py-4 md:px-8">

			<section className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-xl md:p-8 dark:border dark:border-primary/30 dark:bg-[linear-gradient(135deg,#2a1f8f,#4e35de_120%)]">
				<div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-tertiary-fixed/20 blur-2xl" />
				<div className="relative flex flex-col gap-3">
					<span className="w-fit rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] uppercase text-on-primary">LUT Shop</span>
					<h1 className="font-headline text-headline-code-mobile font-extrabold tracking-tight text-white md:text-headline-code">
						The grades from my reels.
					</h1>
					<p className="max-w-2xl font-sans text-body-default text-on-primary-container">
						The same looks I use on Instagram reels, portraits and product shoots, as .cube files you can drop into your editor. Message me on{" "}
						{chat} to buy one.
					</p>
					<ul className="flex flex-wrap gap-1.5 pt-1">
						{apps.map((app) => (
							<li key={app} className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] text-white">
								{app}
							</li>
						))}
					</ul>
				</div>
			</section>

			<FactDeck label="Before you buy" facts={facts.shop} />

			<section className="grid grid-cols-1 gap-6 rounded-2xl bg-surface-container-lowest p-5 shadow-card lg:grid-cols-[1.2fr_1fr] lg:items-center dark:border dark:border-primary/20 dark:bg-surface-container-low">
				<LutPreview src={featured.image} alt={featured.imageAlt} filter={featured.preview} name={featured.name} before={featured.before} after={featured.after} />
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="rounded-full bg-tertiary-fixed px-3 py-1 font-sans text-label-pill font-bold text-on-tertiary-fixed">{featured.badge}</span>
						<span className="font-mono text-label-mono text-on-surface-variant">{featured.files.length} LUTs</span>
					</div>
					<h2 className="font-headline text-headline-md font-bold text-on-surface">{featured.name}</h2>
					<p className="font-sans text-body-default text-on-surface-variant">{featured.description}</p>
					<p className="flex items-baseline gap-2">
						<span className="font-headline text-headline-md font-extrabold text-primary">{formatPrice(featured.price)}</span>
						{featured.compareAt ? <span className="font-mono text-[13px] text-outline line-through">{formatPrice(featured.compareAt)}</span> : null}
					</p>
					<BuyButton
						productName={featured.name}
						priceLabel={formatPrice(featured.price)}
						files={featured.files.map((file) => file.label)}
						channel={channel}
						whatsapp={settings.whatsapp}
						instagram={instagramName}
						featured
					/>
				</div>
			</section>

			<section className="flex flex-col gap-4">
				<SectionHeading title="Single looks" icon="palette" aside={<span className="text-primary">.CUBE • 33³</span>} />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{singles.map((product, index) => (
						<Reveal key={product.id} delay={index * 0.06}>
							<TiltCard
								as="article"
								strength={7}
								className="flex h-full flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-card dark:border dark:border-primary/15 dark:bg-surface-container-low"
							>
								<LutPreview
									src={product.image}
									alt={product.imageAlt}
									filter={product.preview}
									name={product.name}
									before={product.before}
									after={product.after}
								/>
								<div>
									<h3 className="font-headline text-headline-sm font-semibold text-on-surface">{product.name}</h3>
									<p className="font-sans text-body-dense text-primary">{product.tagline}</p>
								</div>
								<p className="font-sans text-[13px] text-on-surface-variant">{product.description}</p>
								<ul className="flex flex-wrap gap-1.5">
									{product.bestFor.map((use) => (
										<li key={use} className={cn("rounded-full bg-secondary-fixed px-2.5 py-0.5 font-mono text-[10px] text-on-secondary-fixed")}>
											{use}
										</li>
									))}
								</ul>
								<div className="mt-auto pt-1">
									<BuyButton
										productName={product.name}
										priceLabel={formatPrice(product.price)}
										files={product.files.map((file) => file.label)}
										channel={channel}
										whatsapp={settings.whatsapp}
										instagram={instagramName}
									/>
								</div>
							</TiltCard>
						</Reveal>
					))}
				</div>
			</section>

			<section className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{faqs.map((faq) => (
					<div key={faq.q} className="rounded-2xl bg-surface-container-low p-5 dark:border dark:border-primary/10">
						<h3 className="font-sans text-body-default font-bold text-on-surface">{faq.q}</h3>
						<p className="mt-1 font-sans text-body-dense text-on-surface-variant">{faq.a}</p>
					</div>
				))}
			</section>

			<footer className="flex flex-col items-center gap-2 border-t border-outline-variant pb-6 pt-5 text-center">
				<span className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant">
					<Icon name={instagram ? "photo_camera" : "chat"} className="text-[14px] text-primary" />
					Orders go to Amar on {chat}
				</span>
				<Link href="/shop/policies" className="font-sans text-[12px] font-semibold text-primary hover:underline">
					Terms, refunds &amp; privacy
				</Link>
			</footer>
		</div>
	);
}
