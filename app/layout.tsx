import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { BottomNav, BottomNavView } from "@/components/layout/bottom-nav";
import { SiteHeader, SiteHeaderView } from "@/components/layout/site-header";
import { MotionProvider } from "@/components/ui/motion-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { themeInitScript } from "@/lib/theme";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Amar Kharvi — Full-stack Developer & Cinematography",
		template: "%s — Amar Kharvi // Dev & Cinema",
	},
	description:
		"Amar Kharvi builds full-stack products in ColdFusion, Django, Python, SQL, and PostgreSQL, and edits in Lightroom, DaVinci Resolve, and Premiere Pro.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#f7f8ff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
	const settings = await getSiteSettings();
	return (
		<html
			lang="en"
			data-theme="light"
			suppressHydrationWarning
			className="antialiased"
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			</head>
			<body className="flex min-h-dvh flex-col">
				<SmoothScroll>
					<MotionProvider>
						<a
							href="#main"
							className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
						>
							Skip to content
						</a>
						<Suspense fallback={<SiteHeaderView pathname={null} tagline={settings.tagline} availability={settings.availability} />}>
							<SiteHeader tagline={settings.tagline} availability={settings.availability} />
						</Suspense>
						<main id="main" className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col pb-24 pt-16 md:pb-12">
							{children}
						</main>
						<Suspense fallback={<BottomNavView pathname={null} />}>
							<BottomNav />
						</Suspense>
					</MotionProvider>
				</SmoothScroll>
			</body>
		</html>
	);
}
