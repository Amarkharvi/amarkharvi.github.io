export type Fact = { title: string; body: string };

export const factPageKeys = ["home", "cinema", "study", "lab", "spectra", "shop", "about"] as const;

export type FactPageKey = (typeof factPageKeys)[number];

export type FactPages = Record<FactPageKey, Fact[]>;

export const factPageLabels: Record<FactPageKey, { label: string; where: string }> = {
	home: { label: "Dual Persona", where: "Between the two columns" },
	cinema: { label: "Cinema", where: "Under the showreel" },
	study: { label: "Reel study", where: "On the quiet-moments study" },
	lab: { label: "Code & Lab", where: "Under the Palladium card" },
	spectra: { label: "Stack notes", where: "Above the shader sketch" },
	shop: { label: "LUT Shop", where: "Under the shop hero" },
	about: { label: "About", where: "Under the intro" },
};

/** Defaults used until the admin saves a replacement. */
export const defaultFacts: FactPages = {
	home: [
		{
			title: "A reel and a query do the same job.",
			body: "Both decide what you meet first. A hook in the opening frame, a WHERE clause that matches the index. Everything after is cheaper if the first step was right.",
		},
		{
			title: "The histogram and GROUP BY are cousins.",
			body: "Lightroom's histogram counts pixels per brightness. GROUP BY counts rows per value. Same picture: a pile, sorted into buckets.",
		},
		{
			title: "I learn in hits, not chapters.",
			body: "One true sentence is enough to start the next hour. These cards are how I keep the pile from turning into a tab I never reopen.",
		},
	],
	cinema: [
		{
			title: "The eye has no frame rate.",
			body: "24 fps is a film convention, not biology. At that rate a 180° shutter is 1/48 of a second, which is the motion blur people read as cinematic.",
		},
		{
			title: "Skin has a narrow lane.",
			body: "Push it toward green and a face reads as unwell before the grade reads as stylish. The vectorscope's skin line exists because that mistake is easy.",
		},
		{
			title: "Log is a squeeze, not a look.",
			body: "A flat log image packs a wide brightness range into the file so the grade has room to move. The pretty picture comes after, in Resolve or Premiere.",
		},
		{
			title: "9:16 is a crop, not a rotation.",
			body: "Turning a 16:9 master on its side does not make a reel. The frame has to be composed for a phone, with the subject still readable after the crop.",
		},
	],
	study: [
		{
			title: "The first second spends the attention.",
			body: "On a feed, the opening image has to say what the reel is. Pace, captions, and the end card only matter if that first frame held.",
		},
		{
			title: "Resolve's color page is a graph.",
			body: "Nodes, not a stack of layers. A grade is a path light takes. You can branch a look, then join it back, without burying the earlier correction.",
		},
	],
	lab: [
		{
			title: "PostgreSQL is named after its parent.",
			body: "POSTGRES meant post-Ingres, the database it grew out of. SQL was added later, in 1996, and the name became PostgreSQL. The nickname Postgres stuck anyway.",
		},
		{
			title: "A 33-point LUT holds 35,937 colors.",
			body: "33 × 33 × 33. A .cube file is a lattice of samples, not a formula. The grade looks up a color and returns the one you decided it should be.",
		},
		{
			title: "An index only helps the query it matches.",
			body: "If the WHERE column is not the first column of the index, Postgres may ignore it and sort anyway. EXPLAIN is how you catch the sort you thought you had removed.",
		},
		{
			title: "Unfinished work stays louder.",
			body: "Bluma Zeigarnik showed, in 1927, that interrupted tasks are remembered better than finished ones. An open problem is stickier than a closed one. I use that on purpose.",
		},
		{
			title: "Mixing two skills beats blocking one.",
			body: "An hour of code, then a grade, usually sticks better than a whole day of either. The contrast is the lesson. That is the whole shape of this site.",
		},
	],
	spectra: [
		{
			title: "A fragment shader runs once per pixel.",
			body: "That is why a grade can be a few lines and still touch the whole frame. The GPU does the loop. You write the rule.",
		},
		{
			title: "ColdFusion shipped in 1995.",
			body: "Allaire released it the same year PHP appeared. A lot of product software still runs on it, which is why the stack here starts there instead of pretending everything is new.",
		},
	],
	shop: [
		{
			title: "A LUT remaps. It does not invent.",
			body: "If a highlight is already clipped to white, no .cube file can put the cloud back. The slider shows a remap of light that was actually captured.",
		},
		{
			title: "33³ is the usual lattice.",
			body: "35,937 samples is enough for a reel grade and small enough to drop into Resolve, Premiere, Final Cut, and CapCut. Bigger lattices exist. They are rarely what a phone feed needs.",
		},
	],
	about: [
		{
			title: "Curiosity is the work habit.",
			body: "I collect a fact the way other people collect a bookmark. Short, true, and easy to pick up again. Cinema and code are the two piles I never get tired of.",
		},
		{
			title: "Bengaluru kept both names for a while.",
			body: "The city was renamed Bengaluru in 2006. The change was officially notified in 2014. I still write it the new way, and people still search the old one.",
		},
	],
};
