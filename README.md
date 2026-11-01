# Dual Persona — Amar Kharvi // Dev & Cinema

A two-sided portfolio for Amar Kharvi, a full-stack developer in Bengaluru who also cuts Instagram reels and shoots products and portraits. It is built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**. There are two themes: _Kinetic Cinema_ (light) and _Cobalt Prism_ (dark). The page designs come from the Stitch exports.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see "Inquiries" below
npm run dev                  # http://localhost:3000
```

| Script                  | Purpose                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`           | Dev server (Turbopack)                                                        |
| `npm run build`         | Production build                                                              |
| `npm start`             | Serve the production build                                                    |
| `npm run lint`          | ESLint                                                                        |
| `npm run media:fetch`   | Re-download the design imagery listed in `scripts/media-manifest.json` (`-- --force` overwrites) |
| `npm run docs:generate` | Regenerate the placeholder PDFs and `.cube` LUT in `public/media/docs`         |
| `npm run luts:generate` | Regenerate the sample paid LUTs in `private/luts` (replace with your real ones) |

The images and docs are already committed under `public/media`, so you only need these two scripts if you want to refresh or replace those assets.

## Routes

| Route                   | Page                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `/`                     | **Dual Persona**: hero, a cinematographer/developer split view, YouTube/Instagram + stack columns, contact |
| `/cinema`               | **Cinema**: reel player with a live timecode and rain ambience, filmography drawers, booking   |
| `/cinema/quiet-moments` | **Reel study**: lighting diagram, flat-to-finished grade wipe, frame archive lightbox |
| `/lab`                  | **Code & Lab**: stack, public GitHub repos, browser grade sketch, brief request |
| `/lab/spectra-wgsl`     | **Stack notes**: grade sketch, highlighted stack snippet, clone command |
| `/about`                | **About**: pedigree, PDF downloads, commission forms, direct coordinates, socials       |
| `/shop`                 | **LUT Shop**: before/after previews, Razorpay checkout, instant downloads |
| `/shop/policies`        | Terms, delivery, refunds, privacy and contact (required by Razorpay) |
| `POST /api/inquiry`     | Validates and accepts commission and papers requests                                         |
| `POST /api/shop/order`  | Creates a Razorpay order for a product (price is always taken from the server) |
| `POST /api/shop/verify` | Verifies the payment signature, re-checks the order with Razorpay, returns signed download links |
| `GET /api/shop/download`| Streams a LUT from `private/luts` when the signed link is valid |
| `POST /api/shop/webhook`| Signed Razorpay webhook; logs sales and notifies `INQUIRY_WEBHOOK_URL` |
| `/admin`                | **Admin** (password-protected, `noindex`): edit picture work, the LUT shop, stack chips, credentials, site text, and upload media — see [Admin](#admin-content-editor) below |

## Project structure

```
app/                    routes, root layout (fonts, theme script, header/nav), API route
  admin/login/          password form + loginAction/logoutAction (outside the admin guard)
  admin/(dashboard)/    dashboard, films, products, stack, site, media — each page gates itself
components/
  layout/               SiteHeader, BottomNav (mobile), ThemeToggle
  ui/                   Icon, CopyButton, SectionHeading
  work/  cinema/  study/  lab/  spectra/  about/   page-specific components
  admin/                shared Field/Card/SaveBar, MediaPicker, and each section's editor
lib/
  site.ts               identity, socials, document links, navigation (static, client-safe)
  site-settings.ts       admin-editable tagline/availability/location/socials (server-only)
  content.ts             films, repos, tech stack, credentials (repos stays static; rest editable)
  content-store.ts        generic JSON read/write under content/ (atomic writes)
  admin/                   session cookie, auth guard, media library (server-only)
  theme.ts               light/dark store (localStorage + prefers-color-scheme)
  use-flash.ts          transient feedback driven by CSS animation end (no timers)
  inquiry.ts            shared payload types + validation
  inquiry-client.ts     fetch wrapper for /api/inquiry
  products.ts           LUT catalog and prices (admin-editable, except the LUT `files`)
  payments/             Razorpay client + signature checks, signed download tokens (server-only)
  browser.ts            clipboard + file download helpers
content/                admin-edited JSON (films/products/tech-stack/credentials/site-settings) — gitignored
public/media/           work/ about/ study/ lab/ cinema/ images, docs/ downloads
public/media/uploads/   images/reels uploaded from /admin/media — gitignored
private/luts/           paid LUT files (served only via signed download links)
scripts/                media fetcher + manifest, document generator
```

## Inquiries

The About forms and the Lab papers terminal send their data to `/api/inquiry`. The server validates each payload: email format, required fields per inquiry type, and field length. It also applies a simple per-IP rate limit.

- If `INQUIRY_WEBHOOK_URL` is set, each accepted inquiry is forwarded to that URL as JSON. Slack, Discord, Zapier or your own endpoint all work.
- If it is not set, inquiries are only logged on the server.

Do not commit secrets. Keep them in `.env.local`, which is gitignored.

## LUT shop (Razorpay)

1. Create a [Razorpay](https://dashboard.razorpay.com) account and copy the **test** key ID and secret from *Settings → API Keys*.
2. Fill `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `DOWNLOAD_TOKEN_SECRET` (`openssl rand -base64 48`) in `.env.local`, then restart the dev server.
3. Buy a LUT on `/shop` with Razorpay's [test UPI ID or test cards](https://razorpay.com/docs/payments/payments/test-card-details/).
4. Optional: add a webhook in the dashboard pointing at `https://<your-domain>/api/shop/webhook` for `payment.captured`, and put its secret in `RAZORPAY_WEBHOOK_SECRET`.
5. To go live, complete Razorpay KYC (they review `/shop/policies`), swap in the `rzp_live_` keys, and deploy.

Products and prices live in `lib/products.ts` (prices in paise). The files you sell go in `private/luts/`. That folder is never served publicly; buyers only reach it through 72-hour signed links issued after a verified payment. Until the Razorpay keys are set, the Buy button opens normally but says checkout isn't switched on yet.

## Admin (content editor)

`/admin` is a password-protected page for one admin (you) to edit the site's content without touching code: Picture Work (the Cinema cards), the LUT Shop (name/price/description/preview, not the `.cube` files themselves), Stack & Credentials, Site Basics (tagline, availability, location, socials), and a Media Library for uploading images/reels.

1. Set two variables in `.env.local` (and on your server):
   - `ADMIN_PASSWORD` — pick any password.
   - `ADMIN_SESSION_SECRET` — at least 32 characters, e.g. `openssl rand -base64 48`.
2. Restart the server and sign in at `/admin/login`. The session is a signed, httpOnly cookie that expires after 12 hours.
3. Edits save to JSON files in `content/` and go live immediately (no rebuild/redeploy needed) — every public page reads through a cached getter that's invalidated the moment you save.
4. Uploads land in `public/media/uploads/`; pick them from any section's media picker by URL (e.g. `/media/uploads/your-file.jpg`).

**Persistence matters more than usual here.** `content/*.json` and `public/media/uploads/*` are intentionally gitignored — they're live, admin-edited data, not source. If your deploy process does a fresh `git clone` on every deploy (for example, a GitHub Actions workflow that rebuilds from a clean checkout), those two directories will be wiped on the next deploy unless you keep them outside that checkout — e.g. a persistent disk/volume mounted at those paths, or a deploy step that copies them back in after checkout and before build. Back them up the same way you'd back up a database.

## Implementation notes

- **Theme without a flash.** An inline `<head>` script sets `data-theme` before the first paint. The Tailwind `dark:` variant is keyed on that attribute.
- **No timers.** Feedback such as "Copied!" or "Sent" disappears when its CSS animation ends. Animations, timecodes and benchmarks run on `requestAnimationFrame`.
- **No DOM observers.** Scroll behavior and layout use native CSS instead: grid-rows accordions, scroll snapping and `<dialog>`.
- **Accessibility.** The site includes a skip link, focus-visible rings, ARIA tabs, radios and switches, and live regions. It also respects `prefers-reduced-motion`.
