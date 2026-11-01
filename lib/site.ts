export const site = {
	name: "Amar Kharvi",
	role: "Full-stack & Cinema",
	tagline: "Amar Kharvi // Dev & Cinema",
	availability: "Open for builds & shoots",
	location: "Bengaluru • Remote",
	cloneCommand: "git clone https://github.com/Amarkharvi/React-Django-Fullstack-.git",
	socials: {
		github: { label: "GitHub", handle: "github.com/Amarkharvi", href: "https://github.com/Amarkharvi" },
		linkedin: { label: "LinkedIn", handle: "linkedin.com/in/amar-kharvi", href: "https://www.linkedin.com/in/amar-kharvi" },
		twitter: { label: "X", handle: "@AmarKharvi", href: "https://x.com/AmarKharvi" },
		youtube: { label: "YouTube", handle: "youtube.com/@AmarKharvi", href: "https://youtube.com/@AmarKharvi" },
		instagram: { label: "Instagram", handle: "@AmarKharvi", href: "https://instagram.com/AmarKharvi" },
	},
} as const;

export const docs = {
	reelDeck: { href: "/media/docs/dp-reel-deck-2026.pdf", file: "Amar-Kharvi-Reels.pdf", size: "PDF • Reels, product & portraits" },
	cv: { href: "/media/docs/systems-cv-amar-kharvi.pdf", file: "Amar-Kharvi-Stack.pdf", size: "PDF • Full-stack track" },
	treatment: { href: "/media/docs/treatment-deck-2026.pdf", file: "Amar-Kharvi-Shoot-Notes.pdf" },
	lookbook: { href: "/media/docs/quiet-moments-lookbook.pdf", file: "Amar-Kharvi-Reel-Notes.pdf" },
	lut: { href: "/media/docs/quiet-moments-kodak-5219.cube", file: "Amar-Kharvi-Reel-Grade.cube" },
	spectraPaper: { href: "/media/docs/spectra-wgsl-architecture.pdf", file: "Amar-Kharvi-Stack-Notes.pdf" },
	papers: { href: "/media/docs/technical-papers.pdf", file: "Amar-Kharvi-One-Pager.pdf" },
} as const;

export const navItems = [
	{ href: "/", label: "Dual Persona", icon: "contrast", title: "Dual Persona" },
	{ href: "/cinema", label: "Cinema", icon: "movie", title: "Cinema" },
	{ href: "/lab", label: "Code & Lab", icon: "terminal", title: "Code & Lab" },
	{ href: "/shop", label: "Shop", icon: "storefront", title: "LUT Shop" },
	{ href: "/about", label: "About", icon: "badge", title: "About" },
] as const;

export const subPageTitles: Record<string, { title: string; parent: string }> = {
	"/shop/policies": { title: "Shop Policies", parent: "/shop" },
	"/cinema/quiet-moments": { title: "Reel Study", parent: "/cinema" },
	"/lab/spectra-wgsl": { title: "Stack Notes", parent: "/lab" },
};
