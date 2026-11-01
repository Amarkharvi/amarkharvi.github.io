import { saveAboutContentAction } from "@/app/admin/(dashboard)/about/actions";
import { saveFilmsAction } from "@/app/admin/(dashboard)/films/actions";
import { saveProductsAction } from "@/app/admin/(dashboard)/products/actions";
import { saveSiteSettingsAction } from "@/app/admin/(dashboard)/site/actions";
import { saveCredentialsAction, saveTechStackAction } from "@/app/admin/(dashboard)/stack/actions";
import { isAdminAuthenticated } from "@/lib/admin/guard";
import { getAboutContent } from "@/lib/about";
import { getCredentials, getFilms, getTechStack } from "@/lib/content";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

type SaveState = { error: string | null; saved: boolean };
type Saver = (prev: SaveState, formData: FormData) => Promise<SaveState>;

const documents: Record<string, { field: string; load: () => Promise<unknown>; save: Saver }> = {
	films: { field: "films", load: getFilms, save: saveFilmsAction },
	products: { field: "products", load: getProducts, save: saveProductsAction },
	about: { field: "about", load: getAboutContent, save: saveAboutContentAction },
	"site-settings": { field: "settings", load: getSiteSettings, save: saveSiteSettingsAction },
	"tech-stack": { field: "techStack", load: getTechStack, save: saveTechStackAction },
	credentials: { field: "credentials", load: getCredentials, save: saveCredentialsAction },
};

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
	if (!(await isAdminAuthenticated())) return Response.json({ error: "Sign in required." }, { status: 401 });
	const { name } = await context.params;
	const document = documents[name];
	if (!document) return Response.json({ error: "Unknown document." }, { status: 404 });
	return Response.json(await document.load());
}

export async function POST(request: Request, context: { params: Promise<{ name: string }> }) {
	const { name } = await context.params;
	const document = documents[name];
	if (!document) return Response.json({ error: "Unknown document." }, { status: 404 });
	const data = await request.json().catch(() => null);
	const formData = new FormData();
	formData.set(document.field, JSON.stringify(data));
	try {
		const result = await document.save({ error: null, saved: false }, formData);
		return Response.json({ error: result.error }, { status: result.error ? 400 : 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Save failed.";
		return Response.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 400 });
	}
}
