import "server-only";

const buckets = new Map<string, number[]>();

export function rateLimited(request: Request, scope: string, max: number, windowMs: number) {
	const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
	const key = `${scope}:${ip}`;
	const now = Date.now();
	const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
	recent.push(now);
	buckets.set(key, recent);
	return recent.length > max;
}
