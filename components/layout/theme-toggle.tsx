"use client";

import { useLayoutEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { reapplyPreferredTheme, setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle() {
	const theme = useTheme();

	useLayoutEffect(() => {
		reapplyPreferredTheme();
	}, []);

	const next = theme === "dark" ? "light" : "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(next)}
			aria-label={`Switch to ${next} theme`}
			title={`Switch to ${next} theme`}
			className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-all active:scale-95 dark:border dark:border-primary/40 dark:bg-surface-container dark:text-primary dark:shadow-glow dark:hover:border-primary"
		>
			<Icon name={theme === "dark" ? "dark_mode" : "light_mode"} className="text-[19px]" />
		</button>
	);
}
