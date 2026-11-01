export type LutFile = { slug: string; file: string; label: string };

export type Product = {
	id: string;
	name: string;
	tagline: string;
	description: string;
	price: number;
	compareAt?: number;
	badge?: string;
	image: string;
	imageAlt: string;
	preview: string;
	files: LutFile[];
	bestFor: string[];
};

export const CURRENCY = "INR";

const luts = {
	indigoNight: { slug: "indigo-night", file: "amar-kharvi-indigo-night.cube", label: "Indigo Night.cube" },
	bengaluruGold: { slug: "bengaluru-gold", file: "amar-kharvi-bengaluru-gold.cube", label: "Bengaluru Gold.cube" },
	cleanProduct: { slug: "clean-product", file: "amar-kharvi-clean-product.cube", label: "Clean Product.cube" },
} satisfies Record<string, LutFile>;

export const defaultProducts: Product[] = [
	{
		id: "indigo-night",
		name: "Indigo Night",
		tagline: "Cool blue shadows, clean highlights",
		description: "The night look from the reels: cool shadows, steady skin, and highlights that stay white instead of going green.",
		price: 49900,
		image: "/media/cinema/neon-monolith-cover.jpg",
		imageAlt: "Night street frame used to preview the Indigo Night grade",
		preview: "contrast(1.12) saturate(1.1) hue-rotate(-12deg) brightness(0.96)",
		files: [luts.indigoNight],
		bestFor: ["Night reels", "City b-roll", "Moody portraits"],
	},
	{
		id: "bengaluru-gold",
		name: "Bengaluru Gold",
		tagline: "Warm daylight, kind to skin",
		description: "A warm daylight grade for portraits and lifestyle reels. Skin stays natural and greens don't turn neon.",
		price: 49900,
		image: "/media/cinema/symphony-of-rust-cover.jpg",
		imageAlt: "Evening frame used to preview the Bengaluru Gold grade",
		preview: "sepia(0.18) saturate(1.15) contrast(1.05) brightness(1.04)",
		files: [luts.bengaluruGold],
		bestFor: ["Portraits", "Golden hour", "Lifestyle reels"],
	},
	{
		id: "clean-product",
		name: "Clean Product",
		tagline: "Neutral, crisp, true to the object",
		description: "A neutral grade for product shoots: tighter contrast, honest color, and whites that read as white on a product page.",
		price: 39900,
		image: "/media/cinema/threshold-cover.jpg",
		imageAlt: "Low-key frame used to preview the Clean Product grade",
		preview: "contrast(1.18) saturate(0.95) brightness(1.06)",
		files: [luts.cleanProduct],
		bestFor: ["Product shoots", "Tabletop", "E-commerce"],
	},
	{
		id: "full-pack",
		name: "Full Pack",
		tagline: "All three LUTs",
		description: "Indigo Night, Bengaluru Gold, and Clean Product together, for one price.",
		price: 99900,
		compareAt: 139700,
		badge: "Best value",
		image: "/media/study/quiet-moments-hero.png",
		imageAlt: "Window-light frame used to preview the full LUT pack",
		preview: "contrast(1.1) saturate(1.12) hue-rotate(-6deg)",
		files: [luts.indigoNight, luts.bengaluruGold, luts.cleanProduct],
		bestFor: ["Reels", "Portraits", "Product"],
	},
];




export function formatPrice(paise: number) {
	return new Intl.NumberFormat("en-IN", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(paise / 100);
}
