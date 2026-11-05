"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type Persona = "both" | "cinema" | "dev";

const options: { id: Persona; label: string; short: string; icon: string }[] = [
	{ id: "both", label: "Both sides", short: "Both", icon: "contrast" },
	{ id: "cinema", label: "Cinematographer", short: "Cinema", icon: "movie" },
	{ id: "dev", label: "Developer", short: "Dev", icon: "terminal" },
];

const grow: Record<Persona, { cinema: number; dev: number }> = {
	both: { cinema: 1, dev: 1 },
	cinema: { cinema: 1.8, dev: 0.7 },
	dev: { cinema: 0.7, dev: 1.8 },
};

type PersonaSplitProps = {
	cinemaHero: ReactNode;
	devHero: ReactNode;
	cinemaColumn: ReactNode;
	devColumn: ReactNode;
};

export function PersonaSplit({ cinemaHero, devHero, cinemaColumn, devColumn }: PersonaSplitProps) {
	const [persona, setPersona] = useState<Persona>("both");

	return (
		<div data-persona={persona} className="group/stage flex flex-col gap-12">
			<div className="flex flex-col gap-4">
				<div
					role="group"
					aria-label="Choose a side"
					className="flex w-full items-center rounded-full bg-surface-container-high p-1 shadow-inner md:max-w-xl dark:border dark:border-primary/15 dark:bg-surface-container-low"
				>
					{options.map((option) => {
						const active = persona === option.id;
						return (
							<button
								key={option.id}
								type="button"
								aria-pressed={active}
								onClick={() => setPersona(option.id)}
								className={cn(
									"flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 font-sans text-label-pill font-bold transition-all duration-300",
									active
										? "bg-surface-container-lowest text-on-surface shadow-sm dark:bg-primary dark:text-on-primary dark:shadow-glow"
										: "text-on-surface-variant hover:text-on-surface",
								)}
							>
								<Icon name={option.icon} className="hidden text-[16px] sm:inline" />
								<span className="sm:hidden">{option.short}</span>
								<span className="hidden truncate sm:inline">{option.label}</span>
							</button>
						);
					})}
				</div>

				<div
					style={{
						gridTemplateColumns: `${grow[persona].cinema}fr 0fr ${grow[persona].dev}fr`,
					}}
					className="relative flex flex-col gap-3 md:grid md:h-[540px] md:gap-0 md:overflow-hidden md:rounded-2xl md:shadow-card md:transition-[grid-template-columns] md:duration-500 md:ease-[cubic-bezier(0.22,1,0.36,1)] dark:md:border dark:md:border-primary/20"
				>
					<div
						className={cn(
							"min-h-[400px] min-w-0 overflow-hidden rounded-2xl transition-opacity duration-500 ease-out md:rounded-none",
							persona === "dev" && "max-md:hidden md:opacity-75",
						)}
					>
						{cinemaHero}
					</div>
					<div aria-hidden="true" className="relative z-10 hidden md:block">
						<span className="absolute left-0 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-surface bg-surface-container-lowest font-mono text-on-surface shadow-lg dark:shadow-glow">
							<span className="text-[15px] font-bold leading-none">AK</span>
							<span className="mt-0.5 text-[9px] uppercase tracking-widest text-on-surface-variant">x2</span>
						</span>
					</div>
					<div
						className={cn(
							"min-h-[400px] min-w-0 overflow-hidden rounded-2xl transition-opacity duration-500 ease-out md:rounded-none",
							persona === "cinema" && "max-md:hidden md:opacity-75",
						)}
					>
						{devHero}
					</div>
				</div>
			</div>

			<div className={cn("grid grid-cols-1 gap-y-12", persona === "both" && "lg:grid-cols-2 lg:gap-x-8")}>
				<div className={persona === "dev" ? "hidden" : "contents"}>{cinemaColumn}</div>
				<div className={persona === "cinema" ? "hidden" : "contents"}>{devColumn}</div>
			</div>
		</div>
	);
}
