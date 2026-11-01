import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "private", "luts");
const SIZE = 33;

const clamp = (v) => Math.min(1, Math.max(0, v));
const sCurve = (v, strength) => clamp(v + strength * (v - 0.5) * (1 - Math.abs(2 * v - 1)));
const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const mix = (a, b, t) => a + (b - a) * t;

const looks = [
	{
		file: "amar-kharvi-indigo-night.cube",
		title: "Amar Kharvi - Indigo Night",
		grade(r, g, b) {
			const y = luma(r, g, b);
			const shadow = 1 - y;
			return [sCurve(r * 0.94, 0.25) - shadow * 0.03, sCurve(g * 0.98, 0.25) + shadow * 0.01, sCurve(b * 1.02 + 0.02, 0.2) + shadow * 0.06];
		},
	},
	{
		file: "amar-kharvi-bengaluru-gold.cube",
		title: "Amar Kharvi - Bengaluru Gold",
		grade(r, g, b) {
			const y = luma(r, g, b);
			return [sCurve(r * 1.06 + 0.015, 0.15), sCurve(g * 1.01 + 0.01, 0.15), sCurve(mix(b, y, 0.15) * 0.9, 0.12)];
		},
	},
	{
		file: "amar-kharvi-clean-product.cube",
		title: "Amar Kharvi - Clean Product",
		grade(r, g, b) {
			const y = luma(r, g, b);
			return [sCurve(mix(y, r, 0.95) * 1.03, 0.3), sCurve(mix(y, g, 0.95) * 1.03, 0.3), sCurve(mix(y, b, 0.95) * 1.03, 0.3)];
		},
	},
];

function buildCube({ title, grade }) {
	const rows = [`TITLE "${title}"`, `LUT_3D_SIZE ${SIZE}`, "DOMAIN_MIN 0.0 0.0 0.0", "DOMAIN_MAX 1.0 1.0 1.0"];
	for (let b = 0; b < SIZE; b++) {
		for (let g = 0; g < SIZE; g++) {
			for (let r = 0; r < SIZE; r++) {
				const out = grade(r / (SIZE - 1), g / (SIZE - 1), b / (SIZE - 1)).map(clamp);
				rows.push(out.map((v) => v.toFixed(6)).join(" "));
			}
		}
	}
	return rows.join("\n") + "\n";
}

await mkdir(outDir, { recursive: true });
for (const look of looks) {
	await writeFile(path.join(outDir, look.file), buildCube(look));
	console.log(`✓ private/luts/${look.file}`);
}
