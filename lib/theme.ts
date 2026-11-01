"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dp-theme";

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const listeners = new Set<() => void>();

function readTheme(): Theme {
	return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function setTheme(theme: Theme) {
	document.documentElement.setAttribute("data-theme", theme);
	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {
		// storage unavailable (private mode); the attribute still applies for this session
	}
	listeners.forEach((listener) => listener());
}

function preferredTheme(): Theme {
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === "light" || stored === "dark") return stored;
	} catch {
		// storage unavailable
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function reapplyPreferredTheme() {
	const theme = preferredTheme();
	if (readTheme() !== theme || !document.documentElement.hasAttribute("data-theme")) {
		document.documentElement.setAttribute("data-theme", theme);
		listeners.forEach((listener) => listener());
	}
}

export function useTheme(): Theme {
	return useSyncExternalStore(subscribe, readTheme, () => "light");
}
