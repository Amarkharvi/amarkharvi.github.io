"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

// Bohr-style shells for Pd (K, L, M, N, O). N holds 16 electrons in the "expected" filling and
// 18 in reality; the two that move between N (4d) and O (5s) are drawn separately.
const SHELL_FRACS = [0.2, 0.36, 0.54, 0.74, 0.95];
const FIXED_COUNTS = [2, 8, 18, 16, 0];
const TILT = -12 * (Math.PI / 180);
const EXPECTED_CONFIG = "[Kr] 4d⁸ 5s²";
const ACTUAL_CONFIG = "[Kr] 4d¹⁰ 5s⁰";

const expectedD = ["↑↓", "↑↓", "↑↓", "↑", "↑"];
const actualD = ["↑↓", "↑↓", "↑↓", "↑↓", "↑↓"];

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function OrbitalRow({ label, d, s, active }: { label: string; d: string[]; s: string; active: boolean }) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg px-2.5 py-2 transition-colors",
				active ? "bg-primary-fixed text-on-primary-fixed" : "text-on-surface-variant",
			)}
		>
			<span className="w-16 font-mono text-[10px] font-bold uppercase tracking-wider">{label}</span>
			<span className="flex items-center gap-1">
				<span className="mr-0.5 font-mono text-[11px]">4d</span>
				{d.map((box, i) => (
					<span key={i} className="flex h-6 w-7 items-center justify-center rounded border border-current/30 font-mono text-[12px]">
						{box}
					</span>
				))}
			</span>
			<span className="flex items-center gap-1">
				<span className="mr-0.5 font-mono text-[11px]">5s</span>
				<span
					className={cn(
						"flex h-6 w-7 items-center justify-center rounded font-mono text-[12px]",
						s ? "border border-current/30" : "border border-dashed border-current/40 text-[10px] opacity-70",
					)}
				>
					{s || "∅"}
				</span>
			</span>
		</div>
	);
}

export function PalladiumCanvas({ id }: { id?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fpsRef = useRef<HTMLSpanElement>(null);
	const frameTimeRef = useRef<HTMLSpanElement>(null);
	const configRef = useRef<HTMLSpanElement>(null);
	const elapsedRef = useRef(0);
	const transitionRef = useRef(0);
	const targetRef = useRef(1);
	const [paused, setPaused] = useState(false);
	const [showActual, setShowActual] = useState(true);
	const [inView, setInView] = useState(true);
	const running = !paused && inView;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const observer = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ root: null, rootMargin: "120px 0px", threshold: 0.05 },
		);
		observer.observe(canvas);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		targetRef.current = showActual ? 1 : 0;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		let dpr = 1;
		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = canvas.clientWidth * dpr;
			canvas.height = canvas.clientHeight * dpr;
		};
		resize();
		window.addEventListener("resize", resize);

		let raf = 0;
		let last = performance.now();
		let samples = 0;
		let accum = 0;
		let shownConfig = "";

		const drawElectron = (x: number, y: number, r: number, depth: number, gold: boolean) => {
			const alpha = 0.45 + 0.55 * depth;
			const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
			glow.addColorStop(0, gold ? `rgba(255, 224, 138, ${alpha})` : `rgba(143, 227, 255, ${alpha * 0.9})`);
			glow.addColorStop(1, gold ? "rgba(255, 224, 138, 0)" : "rgba(143, 227, 255, 0)");
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = gold ? `rgba(255, 246, 214, ${alpha})` : `rgba(240, 252, 255, ${alpha})`;
			ctx.beginPath();
			ctx.arc(x, y, r * (0.75 + 0.25 * depth), 0, Math.PI * 2);
			ctx.fill();
		};

		const render = (now: number) => {
			const dt = Math.min(now - last, 50);
			last = now;
			elapsedRef.current += dt;
			const elapsed = elapsedRef.current;
			if (paused) {
				transitionRef.current = targetRef.current;
			} else {
				transitionRef.current += (targetRef.current - transitionRef.current) * (1 - Math.exp(-dt / 380));
			}
			const shift = easeInOutCubic(Math.min(1, Math.max(0, transitionRef.current)));

			const w = canvas.width;
			const h = canvas.height;
			const time = elapsed * 0.0021;

			ctx.fillStyle = "#160066";
			ctx.fillRect(0, 0, w, h);
			const grad = ctx.createLinearGradient(0, 0, w, h);
			grad.addColorStop(0, "rgba(53, 5, 200, 0.85)");
			grad.addColorStop(0.5, "rgba(78, 53, 222, 0.4)");
			grad.addColorStop(1, "rgba(0, 102, 140, 0.55)");
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, w, h);

			ctx.lineWidth = 1.5;
			for (let i = 0; i < 7; i++) {
				const offset = i * (Math.PI / 3.5);
				const yStart = h * 0.5 + Math.sin(time + offset) * (h * 0.28);
				const yEnd = h * 0.5 - Math.sin(time * 0.8 + offset) * (h * 0.28);
				ctx.beginPath();
				ctx.strokeStyle = i % 2 === 0 ? "rgba(143, 227, 255, 0.4)" : "rgba(205, 198, 255, 0.45)";
				ctx.moveTo(0, yStart);
				ctx.bezierCurveTo(w * 0.35, yStart + Math.cos(time + i) * 40, w * 0.65, yEnd - Math.sin(time + i) * 40, w, yEnd);
				ctx.stroke();
			}

			const cx = w * 0.56;
			const cy = h * 0.52;
			const maxRx = Math.min(w * 0.4, h * 1.05);
			const ratio = 0.42;

			const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, maxRx * 0.55);
			core.addColorStop(0, "rgba(255, 255, 255, 0.9)");
			core.addColorStop(0.2, "rgba(143, 227, 255, 0.35)");
			core.addColorStop(0.6, "rgba(78, 53, 222, 0.12)");
			core.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = core;
			ctx.beginPath();
			ctx.arc(cx, cy, maxRx * 0.55, 0, Math.PI * 2);
			ctx.fill();

			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(TILT);

			SHELL_FRACS.forEach((frac, shell) => {
				const rx = maxRx * frac;
				ctx.save();
				ctx.lineWidth = dpr;
				if (shell === 4) {
					ctx.setLineDash([4 * dpr, 5 * dpr]);
					ctx.strokeStyle = `rgba(255, 224, 138, ${0.35 + 0.35 * shift})`;
				} else {
					ctx.strokeStyle = "rgba(205, 198, 255, 0.4)";
				}
				ctx.beginPath();
				ctx.ellipse(0, 0, rx, rx * ratio, 0, 0, Math.PI * 2);
				ctx.stroke();
				ctx.restore();
			});

			const electrons: { x: number; y: number; depth: number; gold: boolean }[] = [];
			SHELL_FRACS.forEach((frac, shell) => {
				const count = FIXED_COUNTS[shell];
				const rx = maxRx * frac;
				const speed = 0.0009 / (0.4 + frac);
				for (let i = 0; i < count; i++) {
					const angle = (i / count) * Math.PI * 2 + elapsed * speed + shell * 0.7;
					const sin = Math.sin(angle);
					electrons.push({ x: Math.cos(angle) * rx, y: sin * rx * ratio, depth: (sin + 1) / 2, gold: false });
				}
			});

			// The two electrons that break the Aufbau order: in 5s for the expected filling, in 4d for the real one.
			const nFrac = SHELL_FRACS[3];
			const oFrac = SHELL_FRACS[4];
			const movingFrac = oFrac + (nFrac - oFrac) * shift;
			const movingSpeed = 0.0009 / (0.4 + movingFrac);
			for (let i = 0; i < 2; i++) {
				const gapOffset = (Math.PI * 2) / 32;
				const angle = i * Math.PI + gapOffset + elapsed * movingSpeed + 3 * 0.7;
				const rx = maxRx * movingFrac;
				const sin = Math.sin(angle);
				electrons.push({ x: Math.cos(angle) * rx, y: sin * rx * ratio, depth: (sin + 1) / 2, gold: true });
			}

			const electronR = Math.max(1.6 * dpr, maxRx * 0.018);
			for (const e of electrons) if (e.depth < 0.5) drawElectron(e.x, e.y, electronR, e.depth, e.gold);

			const nucleusR = maxRx * 0.1;
			const nucleus = ctx.createRadialGradient(-nucleusR * 0.3, -nucleusR * 0.3, 0, 0, 0, nucleusR);
			nucleus.addColorStop(0, "#ffffff");
			nucleus.addColorStop(0.45, "#c6bfff");
			nucleus.addColorStop(1, "#4e35de");
			ctx.shadowColor = "rgba(198, 191, 255, 0.9)";
			ctx.shadowBlur = 18 * dpr;
			ctx.fillStyle = nucleus;
			ctx.beginPath();
			ctx.arc(0, 0, nucleusR, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;

			for (const e of electrons) if (e.depth >= 0.5) drawElectron(e.x, e.y, electronR, e.depth, e.gold);

			ctx.restore();

			ctx.fillStyle = "#160066";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = `700 ${Math.max(10 * dpr, nucleusR * 0.8)}px ui-sans-serif, system-ui, sans-serif`;
			ctx.fillText("Pd", cx, cy - nucleusR * 0.12);
			ctx.font = `600 ${Math.max(7 * dpr, nucleusR * 0.38)}px ui-monospace, monospace`;
			ctx.fillText("46", cx, cy + nucleusR * 0.52);

			const labelX = cx + Math.cos(TILT) * maxRx * oFrac;
			const labelY = cy + Math.sin(TILT) * maxRx * oFrac - 10 * dpr;
			ctx.font = `600 ${10 * dpr}px ui-monospace, monospace`;
			ctx.textAlign = "right";
			ctx.fillStyle = `rgba(255, 224, 138, ${0.35 + 0.6 * shift})`;
			ctx.fillText(shift > 0.5 ? "5s⁰ · empty" : "5s²", labelX, labelY);

			samples++;
			accum += dt;
			if (accum >= 500) {
				const avg = accum / samples;
				if (fpsRef.current) fpsRef.current.textContent = (1000 / avg).toFixed(1);
				if (frameTimeRef.current) frameTimeRef.current.textContent = `${avg.toFixed(2)}ms`;
				samples = 0;
				accum = 0;
			}
			const config = shift > 0.5 ? ACTUAL_CONFIG : EXPECTED_CONFIG;
			if (config !== shownConfig && configRef.current) {
				configRef.current.textContent = config;
				shownConfig = config;
			}

			if (running) raf = requestAnimationFrame(render);
		};

		if (running) {
			raf = requestAnimationFrame(render);
		} else {
			render(performance.now());
		}

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, [running, showActual]);

	return (
		<div id={id} className="flex scroll-mt-24 flex-col gap-3">
			<div className="relative h-52 w-full overflow-hidden rounded-xl bg-inverse-surface shadow-inner md:h-64">
				<canvas
					ref={canvasRef}
					className="block h-full w-full"
					aria-label="Animated palladium atom with shells of 2, 8, 18 and 18 electrons and an empty fifth shell"
					role="img"
				/>
				<div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1 rounded-lg bg-black/70 p-2 font-mono backdrop-blur-md">
					<div className="flex items-center gap-2">
						<span className="text-[10px] text-white/70">FPS:</span>
						<span ref={fpsRef} className="text-[11px] font-bold tabular-nums text-tertiary-fixed">
							60.0
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-[10px] text-white/70">FRAMETIME:</span>
						<span ref={frameTimeRef} className="text-[11px] tabular-nums text-primary-fixed-dim">
							16.00ms
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-[10px] text-white/70">CONFIG:</span>
						<span ref={configRef} className="text-[11px] text-secondary-fixed">
							{EXPECTED_CONFIG}
						</span>
					</div>
				</div>
				<div className="absolute bottom-2 right-2 flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => setPaused((p) => !p)}
						aria-label={paused ? "Resume animation" : "Pause animation"}
						className="flex items-center gap-1 rounded-md bg-surface px-2 py-1 font-mono text-[10px] text-on-surface shadow transition-transform active:scale-95"
					>
						<Icon name={paused ? "play_arrow" : "pause"} className="text-[13px] text-primary" />
						{paused ? "Resume" : "Pause"}
					</button>
					<button
						type="button"
						onClick={() => setShowActual((value) => !value)}
						className="flex items-center gap-1 rounded-md bg-surface px-2 py-1 font-mono text-[10px] text-on-surface shadow transition-transform active:scale-95"
					>
						<Icon name="sync" className="text-[13px] text-primary" />
						{showActual ? "Show expected" : "Show actual"}
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<OrbitalRow label="Expected" d={expectedD} s="↑↓" active={!showActual} />
				<OrbitalRow label="Actual" d={actualD} s="" active={showActual} />
			</div>
		</div>
	);
}
