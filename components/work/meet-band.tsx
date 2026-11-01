import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const steps = [
	{ index: "01", title: "Shoot", body: "Product, portrait, or reel, lit on location.", icon: "photo_camera" },
	{ index: "02", title: "Cut", body: "Lightroom for stills. Resolve or Premiere for motion.", icon: "movie_edit" },
	{ index: "03", title: "Ship", body: "A Next.js page on PostgreSQL that puts the picture to work.", icon: "rocket_launch" },
];

export function MeetBand() {
	return (
		<section
			aria-labelledby="meet-title"
			className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-card md:p-8 dark:border dark:border-primary/20 dark:bg-surface-container-low"
		>
			<div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-secondary to-primary-container dark:from-primary dark:to-tertiary" />
			<div className="flex flex-col gap-1">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-secondary dark:text-primary">Both sides</span>
				<h2 id="meet-title" className="font-serif text-headline-lg text-on-surface">
					Where the frame <span className="font-headline font-bold not-italic">meets the stack</span>
				</h2>
				<p className="max-w-2xl font-sans text-body-default text-on-surface-variant">
					A product needs a picture and a page. One person shoots it, cuts it, and ships it.
				</p>
			</div>

			<ol className="mt-6 grid gap-3 md:grid-cols-3">
				{steps.map((step) => (
					<li key={step.index} className="flex flex-col gap-2 rounded-xl bg-surface-container p-4">
						<div className="flex items-center justify-between">
							<Icon name={step.icon} className="text-[22px] text-primary dark:text-primary-fixed-dim" />
							<span className="font-mono text-[11px] text-on-surface-variant">{step.index}</span>
						</div>
						<p className="font-headline text-[17px] font-semibold text-on-surface">{step.title}</p>
						<p className="font-sans text-body-dense text-on-surface-variant">{step.body}</p>
					</li>
				))}
			</ol>

			<Link
				href="/shop"
				className="group mt-4 flex items-center justify-between gap-4 rounded-xl bg-primary-container p-4 text-white transition-all hover:brightness-110 active:scale-[0.99] dark:shadow-glow"
			>
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
						<Icon name="palette" className="text-[20px]" />
					</span>
					<div>
						<span className="font-mono text-[11px] uppercase tracking-wider text-tertiary-fixed">Both at once</span>
						<p className="font-headline text-[16px] font-semibold">The LUT shop: grades from the reels, on a checkout I built.</p>
					</div>
				</div>
				<Icon name="arrow_forward" className="text-[22px] transition-transform group-hover:translate-x-1" />
			</Link>
		</section>
	);
}
