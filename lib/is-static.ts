// True only in the GitHub Pages export (see scripts/build-static.mjs, which sets
// NEXT_PUBLIC_STATIC_SITE at build time). `NEXT_PUBLIC_` vars are inlined at build time, so this
// is safe to read from client components too — there is no server at runtime to ask.
export const IS_STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === "1";
