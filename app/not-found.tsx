import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
			<span className="font-mono text-label-mono tracking-widest text-tertiary">ERR_404 // FRAME DROPPED</span>
			<h1 className="font-serif text-headline-lg italic text-on-surface md:text-display-hero-mobile">This reel never made the final cut.</h1>
			<p className="max-w-md font-sans text-body-default text-on-surface-variant">The page you requested isn&apos;t in the edit. Head back to the portfolio index.</p>
			<Link
				href="/"
				className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-sans font-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95 dark:shadow-glow"
			>
				<Icon name="arrow_back" className="text-[18px]" />
				Return to Dual Persona
			</Link>
		</div>
	);
}
