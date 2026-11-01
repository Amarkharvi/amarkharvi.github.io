import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "public", "media", "docs");

const documents = [
	{
		file: "dp-reel-deck-2026.pdf",
		title: "Amar Kharvi - Reels, Product and Portraits",
		lines: [
			"Bengaluru. Instagram reels and edits, product shoots, portraits.",
			"Reels: pace, sound, captions, a phone-readable frame.",
			"Product: tabletop, lifestyle, and short motion.",
			"Portraits: face first, background quiet.",
			"Edit: DaVinci Resolve and Premiere Pro. Stills: Lightroom.",
			"GitHub: https://github.com/Amarkharvi",
		],
	},
	{
		file: "systems-cv-amar-kharvi.pdf",
		title: "Amar Kharvi - Full-stack Notes",
		lines: [
			"ColdFusion, HTML, CSS, JavaScript, jQuery",
			"Django, Python, SQL and PostgreSQL",
			"React and Next.js",
			"Shell for the local workflow",
			"Public code: github.com/Amarkharvi",
			"Bengaluru, remote builds welcome",
		],
	},
	{
		file: "treatment-deck-2026.pdf",
		title: "Amar Kharvi - Shoot Notes",
		lines: [
			"Edited in Lightroom, DaVinci Resolve, and Premiere Pro",
			"Based in Bengaluru. On location, or remote for the edit.",
			"Tell Amar the date, the place, and what the frame is for.",
		],
	},
	{
		file: "quiet-moments-lookbook.pdf",
		title: "Amar Kharvi - Reel Notes",
		lines: [
			"Hook inside the first second.",
			"Product frames stay on the object.",
			"Portraits stay on the face.",
			"Cut and grade in DaVinci Resolve or Premiere Pro. Stills in Lightroom.",
		],
	},
	{
		file: "spectra-wgsl-architecture.pdf",
		title: "Amar Kharvi - Stack Notes",
		lines: [
			"ColdFusion and jQuery for product UI that already runs that way.",
			"Django, Python, SQL, and PostgreSQL for apps and data.",
			"React and Next.js for new interfaces.",
			"Shell around the build. Pictures: reels, product, portraits.",
		],
	},
	{
		file: "technical-papers.pdf",
		title: "Amar Kharvi - One Pager",
		lines: [
			"Full stack: ColdFusion, HTML, CSS, JS, jQuery, Django, Python, SQL, PostgreSQL, React, Next.js, shell.",
			"Edit: Lightroom, DaVinci Resolve, Premiere Pro. Reels, product shoots, portraits.",
			"Bengaluru. GitHub: https://github.com/Amarkharvi",
			"LinkedIn: https://www.linkedin.com/in/amar-kharvi",
		],
	},
];

function escapePdfText(text) {
	return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf({ title, lines }) {
	const content = [
		"BT",
		"/F1 20 Tf",
		"56 760 Td",
		`(${escapePdfText(title)}) Tj`,
		"/F1 12 Tf",
		"0 -36 Td",
		...lines.flatMap((line) => [`(${escapePdfText(line)}) Tj`, "0 -20 Td"]),
		"ET",
	].join("\n");

	const objects = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
		`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
	];

	let pdf = "%PDF-1.4\n";
	const offsets = [];
	objects.forEach((body, index) => {
		offsets.push(Buffer.byteLength(pdf));
		pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
	});
	const xrefOffset = Buffer.byteLength(pdf);
	pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	pdf += offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
	pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
	return pdf;
}

function buildCubeLut(size = 17) {
	const rows = [
		'TITLE "Amar Kharvi - Reel Grade"',
		`LUT_3D_SIZE ${size}`,
		"DOMAIN_MIN 0.0 0.0 0.0",
		"DOMAIN_MAX 1.0 1.0 1.0",
	];
	const curve = (v) => {
		const toe = 0.03 + v * 0.97;
		return toe * toe * (3 - 2 * toe) * 0.92 + toe * 0.08;
	};
	for (let b = 0; b < size; b++) {
		for (let g = 0; g < size; g++) {
			for (let r = 0; r < size; r++) {
				const rn = r / (size - 1);
				const gn = g / (size - 1);
				const bn = b / (size - 1);
				const out = [
					Math.min(1, curve(rn) * 1.04),
					Math.min(1, curve(gn) * 0.99),
					Math.min(1, curve(bn) * 0.9 + 0.02),
				];
				rows.push(out.map((v) => v.toFixed(6)).join(" "));
			}
		}
	}
	return rows.join("\n") + "\n";
}

await mkdir(docsDir, { recursive: true });
for (const doc of documents) {
	await writeFile(path.join(docsDir, doc.file), buildPdf(doc));
	console.log(`✓ ${doc.file}`);
}
await writeFile(path.join(docsDir, "quiet-moments-kodak-5219.cube"), buildCubeLut());
console.log("✓ quiet-moments-kodak-5219.cube");
