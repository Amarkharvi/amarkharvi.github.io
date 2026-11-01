export type Film = {
	slug: string;
	index: string;
	title: string;
	badge: string;
	badgeTone: "secondary" | "primary" | "warm" | "neutral";
	stock: string;
	credit: string;
	cover: string;
	focal: string;
	specs: [{ label: string; value: string }, { label: string; value: string }];
	note: string;
	stills: [{ src: string; alt: string }, { src: string; alt: string }];
	studyHref?: string;
};

export const defaultFilms: Film[] = [
	{
		slug: "instagram-reels",
		index: "01",
		title: "YouTube & Reels",
		badge: "Edits",
		badgeTone: "secondary",
		stock: "Vertical & widescreen cuts",
		credit: "Edit • Pace • Sound • Captions",
		cover: "/media/cinema/quiet-moments-cover.jpg",
		focal: "CUT: Hook inside the first second",
		specs: [
			{ label: "Frame", value: "9:16 feed & 16:9 masters" },
			{ label: "Delivery", value: "YouTube and Instagram" },
		],
		note: "Longer cuts go to YouTube. The reel cut is for Instagram: a clear opening image, a rhythm that matches the track, and an end card that still reads on a phone.",
		stills: [
			{ src: "/media/cinema/quiet-moments-hands.jpg", alt: "Close detail frame used as a reel cutaway" },
			{ src: "/media/cinema/quiet-moments-roofs.jpg", alt: "Wide frame held for a slower beat in an edit" },
		],
		studyHref: "/cinema/quiet-moments",
	},
	{
		slug: "product-shoots",
		index: "02",
		title: "Product Shoots",
		badge: "Still & motion",
		badgeTone: "primary",
		stock: "Tabletop and lifestyle",
		credit: "Product photography & short clips",
		cover: "/media/cinema/neon-monolith-cover.jpg",
		focal: "LIGHT: Shape the object, then the background",
		specs: [
			{ label: "Setup", value: "Tabletop, lifestyle, or on location" },
			{ label: "Delivery", value: "Stills plus a short motion cut" },
		],
		note: "Product work stays on the object: clean edges, honest color, and a clip short enough to drop into a reel or a product page.",
		stills: [
			{ src: "/media/cinema/neon-monolith-chrome.jpg", alt: "Reflective surface used as a product-light reference" },
			{ src: "/media/cinema/neon-monolith-runner.jpg", alt: "Motion frame with a strong backlight" },
		],
	},
	{
		slug: "portraits",
		index: "03",
		title: "Portraits",
		badge: "People",
		badgeTone: "warm",
		stock: "Natural and soft light",
		credit: "Headshots, lifestyle, and character frames",
		cover: "/media/cinema/symphony-of-rust-cover.jpg",
		focal: "LIGHT: Face first, background second",
		specs: [
			{ label: "Light", value: "Window, soft key, or open shade" },
			{ label: "Use", value: "Profiles, campaigns, personal sets" },
		],
		note: "Portraits are about the person in the frame: a readable face, a background that stays quiet, and a grade that doesn't repaint skin.",
		stills: [
			{ src: "/media/cinema/symphony-of-rust-chain.jpg", alt: "Texture close-up kept as a portrait detail reference" },
			{ src: "/media/cinema/symphony-of-rust-dockworker.jpg", alt: "Figure framed against a simple evening background" },
		],
	},
	{
		slug: "grade-and-cut",
		index: "04",
		title: "Grade & Cut",
		badge: "Finish",
		badgeTone: "neutral",
		stock: "Color, pace, and export",
		credit: "The pass after the shoot",
		cover: "/media/cinema/threshold-cover.jpg",
		focal: "FINISH: One look across stills and the reel",
		specs: [
			{ label: "Grade", value: "Matched stills and motion" },
			{ label: "Export", value: "Feed file and a client master" },
		],
		note: "The finish is where a shoot becomes a reel: trim in Premiere Pro or DaVinci Resolve, match the stills in Lightroom, then export a file that holds up on a phone and on a page.",
		stills: [
			{ src: "/media/cinema/threshold-dancer.jpg", alt: "Motion frame from a grade reference" },
			{ src: "/media/cinema/threshold-piano.jpg", alt: "Low-key still used to check contrast in the grade" },
		],
	},
];



export type Repo = {
	name: string;
	subtitle: string;
	icon: string;
	iconTone: "primary" | "tertiary" | "secondary" | "neutral";
	meta: string;
	description: string;
	license: string;
	tag: string;
	tagTone: "primary" | "secondary" | "tertiary" | "primary-dim";
	cta: string;
	href: string;
};

// Real public GitHub repos — kept static, not admin-editable.
export const repos: Repo[] = [
	{
		name: "React-Django-Fullstack-",
		subtitle: "React + Django",
		icon: "hub",
		iconTone: "primary",
		meta: "Python",
		description: "A basic full-stack application with a React client and a Django backend.",
		license: "Public",
		tag: "React",
		tagTone: "primary",
		cta: "Open repo",
		href: "https://github.com/Amarkharvi/React-Django-Fullstack-",
	},
	{
		name: "AI-web-app-for-object-identification",
		subtitle: "Django + Keras",
		icon: "image_search",
		iconTone: "tertiary",
		meta: "Python",
		description: "Object identification with TensorFlow Keras, served through a Django web app.",
		license: "Public",
		tag: "Django",
		tagTone: "secondary",
		cta: "Open repo",
		href: "https://github.com/Amarkharvi/AI-web-app-for-object-identification",
	},
	{
		name: "Shopping-Website-I-2",
		subtitle: "Django storefront",
		icon: "storefront",
		iconTone: "secondary",
		meta: "Python",
		description: "A shopping website built with the Django framework.",
		license: "Public",
		tag: "Django",
		tagTone: "primary-dim",
		cta: "Open repo",
		href: "https://github.com/Amarkharvi/Shopping-Website-I-2",
	},
	{
		name: "blogAppication-I-1",
		subtitle: "Django blog",
		icon: "edit_note",
		iconTone: "neutral",
		meta: "Python",
		description: "A blog application written with Django, from posts through the app structure.",
		license: "Public",
		tag: "Django",
		tagTone: "tertiary",
		cta: "Open repo",
		href: "https://github.com/Amarkharvi/blogAppication-I-1",
	},
];

export type TechStackGroup = "focus" | "web" | "server";
export type TechStackItem = { label: string; dot: string; group: TechStackGroup };

export const defaultTechStack: TechStackItem[] = [
	{ label: "ColdFusion", dot: "bg-secondary", group: "focus" },
	{ label: "HTML & CSS", dot: "bg-primary", group: "web" },
	{ label: "JavaScript", dot: "bg-primary-container", group: "web" },
	{ label: "jQuery", dot: "bg-tertiary", group: "web" },
	{ label: "Django", dot: "bg-secondary-container", group: "focus" },
	{ label: "Python", dot: "bg-tertiary-fixed-dim", group: "server" },
	{ label: "PostgreSQL", dot: "bg-secondary", group: "focus" },
	{ label: "SQL", dot: "bg-tertiary", group: "server" },
	{ label: "React", dot: "bg-primary-fixed-dim", group: "focus" },
	{ label: "Next.js", dot: "bg-outline", group: "focus" },
	{ label: "Shell", dot: "bg-primary", group: "server" },
];



export type Credential = { icon: string; title: string; body: string };
export type Credentials = { cinema: Credential[]; engineering: Credential[] };

export const defaultCredentials: Credentials = {
	cinema: [
		{ icon: "movie", title: "Instagram reels & edits", body: "Cuts in DaVinci Resolve and Premiere Pro: pace, sound, captions, and a frame that reads on a phone. Stills finished in Lightroom." },
		{ icon: "photo_camera", title: "Product shoots", body: "Stills and short motion for products — tabletop, lifestyle, and on location." },
		{ icon: "portrait", title: "Portraits", body: "People in readable light, with a background that stays out of the way." },
	],
	engineering: [
		{ icon: "code", title: "ColdFusion, HTML, CSS, JS, jQuery", body: "Product interfaces, from server-rendered ColdFusion pages to front-end behavior in the browser." },
		{ icon: "terminal", title: "Django, Python & PostgreSQL", body: "Web apps and APIs in Django and Python, SQL and PostgreSQL for the data, and shell for the local workflow." },
		{ icon: "devices", title: "React & Next.js", body: "Component interfaces and Next.js apps, including this portfolio." },
	],
};
