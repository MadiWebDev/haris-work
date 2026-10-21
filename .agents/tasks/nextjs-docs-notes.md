# Next.js 16 API Notes for HarisPortfolio Showcase

## Project Snapshot

| Item | Value |
|---|---|
| Next.js version | **16.4.2** |
| React | 19.3.0 |
| Router | **App Router** |
| Styling | **Tailwind CSS v4** (via `@import "tailwindcss"` — no `tailwind.config.js`) |
| TypeScript | Yes |
| Fonts | Geist Sans + Geist Mono via `next/font/google` |
| Already installed | `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `@types/three` |
| Build system | Turbopack (`next dev` / `next build`); custom CSS rule via `turbopack.rules` |
| Experimental flags | `agentFeedback: true`, `cacheComponents: true`, `partialPrefetching: true` |

---

## 1. `next/image` — Correct Props for Next.js 16

### Still-valid props
- **`fill`** — still works. Parent must have `position: relative | absolute | fixed`.
- **`blurDataURL`** — still valid; must be paired with `placeholder="blur"`. For static imports of jpg/png/webp/avif the blur URL is set automatically; dynamic/remote images must supply it manually.
- **`sizes`** — still valid. Required when using `fill` or responsive CSS-sized images. Without it the browser assumes `100vw`.
- **`width` / `height`** — required unless using `fill` or a static import.
- **`loading="lazy"`** — default; use `loading="eager"` for above-the-fold images.
- **`unoptimized`** — useful for SVGs and small animated GIFs.
- **`onLoad`** / **`onError`** — valid but require `"use client"` because they accept functions.

### Breaking change in Next.js 16: `priority` deprecated
> **`priority` is deprecated in Next.js 16.** Use **`preload={true}`** instead.  
> `preload` inserts a `<link rel="preload">` in `<head>`. Use only for the LCP image (e.g. hero).  
> For other above-fold images use `loading="eager"` or `fetchPriority="high"` (passed through as a standard HTML attribute).

### Breaking change in Next.js 16: `qualities` config is required
```ts
// next.config.ts — must list every quality value you use
images: {
  qualities: [75],       // default; expand if you use quality={50} etc.
}
```
Any `quality` prop value not in the allowlist is coerced to the closest entry. The REST API returns 400 for values outside the list.

### Usage pattern for showcase screenshots
```tsx
// fill + sizes — for card thumbnails
<Image
  src="/Screenshot 2026-09-29 111906.png"
  alt="Dashboard overview"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
/>

// Hero LCP image — use preload instead of priority
<Image
  src="/Screenshot 2026-09-29 111906.png"
  alt="Hero screenshot"
  width={1920}
  height={1080}
  preload={true}
/>
```

---

## 2. Metadata API

### Static metadata — `export const metadata`
Exported from any `page.tsx` or `layout.tsx` (Server Component only — cannot be in a `"use client"` file):

```tsx
// app/showcase/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Showcase — HarisPortfolio',
  description: 'A visual tour of MineConnect features, dashboards, and reports.',
  openGraph: {
    title: 'HarisPortfolio Showcase',
    description: 'Feature gallery with screenshots and reports.',
    type: 'website',
  },
}
```

### Dynamic metadata — `generateMetadata` function
```tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  return { title: slug }
}
```

### Key rules
- `metadata` / `generateMetadata` are **Server Component only** — they cannot be exported from files with `"use client"`.
- Do **not** add `<title>`, `<meta>`, or `<link>` tags manually in layouts/pages — always use the Metadata API.
- In Next.js 16 metadata is streamed separately for dynamic pages; bots/crawlers (Googlebot, Twitterbot, etc.) always receive blocking metadata.

---

## 3. `LayoutProps` — Type for Layout Components

### Next.js 16: globally available, generated type
`LayoutProps` is a **generated, globally available helper** introduced in Next.js 16 — no import needed.

```tsx
// app/layout.tsx — already used in the existing codebase
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

The generic argument is the route path. It infers `children`, `params`, and named parallel-route slots from the directory structure.  
Types are re-generated on every `next dev` / `next build` / `next typegen` run.

For layouts without parallel routes or dynamic segments the older explicit type still works fine:
```tsx
{ children: React.ReactNode }
```

### `params` is a Promise in Next.js 15+
```tsx
// app/showcase/[id]/layout.tsx
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params   // must await
  // ...
}
```
In Client Components use `React.use(params)` to unwrap the promise.

---

## 4. Server vs Client Components & `"use client"`

### Defaults
- All files in `app/` are **Server Components by default**.
- Add `"use client"` at the top of a file (above imports) to opt into client rendering.
- `"use client"` marks a boundary: everything imported by that file is also pulled into the client bundle.

### When `"use client"` is required (relevant to this project)
- Any component using `useState`, `useEffect`, `useRef`, hooks.
- Any component using `framer-motion` (`motion.*`, `useScroll`, `useTransform`, `AnimatePresence`).
- Any component using `@react-three/fiber` `Canvas` or Three.js scene components.
- Event handlers (`onClick`, `onChange`, etc.).
- `next/image` callbacks (`onLoad`, `onError`) — these turn the parent component into a Client Component.
- `localStorage`, `window`, `document`, `navigator`.

### Third-party libraries without `"use client"`
Wrap them in a thin client wrapper:
```tsx
// components/showcase/CanvasWrapper.tsx
'use client'
export { Canvas } from '@react-three/fiber'
```

---

## 5. Dynamic Imports & Three.js SSR

### `next/dynamic` with `ssr: false`
All Three.js / R3F Canvas components **must** be dynamically imported with `ssr: false`:

```tsx
// In a Server Component or Client Component that doesn't itself do WebGL
import dynamic from 'next/dynamic'

const Gallery3D = dynamic(
  () => import('@/components/showcase/Gallery3D'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-zinc-800 h-96 rounded-xl" />,
  }
)
```

### Suspense + dynamic
```tsx
import { Suspense } from 'react'

<Suspense fallback={<LoadingSpinner />}>
  <Gallery3D />
</Suspense>
```

The `loading` option in `dynamic()` and a `<Suspense>` fallback can be used together — `loading` covers the dynamic import loading phase, Suspense covers async data inside the component.

---

## 6. Tailwind CSS v4 Specifics

This project uses **Tailwind v4** with `@import "tailwindcss"` — not the v3 `@tailwind base/components/utilities` directives. Key differences:

- No `tailwind.config.js` by default; theme customisation goes in CSS with `@theme`.
- Custom CSS variables are already defined in `globals.css` under `:root` and `@theme inline`.
- Existing brand colors: `--background` (#0a0a0a dark / #ffffff light), `--foreground` (#171717 light / #ededed dark).
- `font-sans` → `--font-geist-sans`; `font-mono` → `--font-geist-mono`.
- For new accent colors, add to `globals.css` under `@theme inline`.

---

## 7. Public Assets — Discovered Files

All files in `/public`:

| File | Type | Notes |
|---|---|---|
| `Screenshot 2026-09-29 111906.png` | Screenshot | Oct group A |
| `Screenshot 2026-09-29 113813.png` | Screenshot | Oct group A |
| `Screenshot 2026-10-20 150319.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 150523.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 150549.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 150607.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 150647.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 150727.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 150856.png` | Screenshot | Oct group B |
| `Screenshot 2026-10-20 153147.png` | Screenshot | Oct group C |
| `Screenshot 2026-10-20 153229.png` | Screenshot | Oct group C |
| `Screenshot 2026-10-20 153238.png` | Screenshot | Oct group C |
| `Screenshot 2026-10-20 153349.png` | Screenshot | Oct group C |
| `Screenshot 2026-10-20 153358.png` | Screenshot | Oct group C |
| `Screenshot 2026-10-20 153419.png` | Screenshot | Oct group C |
| `Screenshot 2026-10-20 153443.png` | Screenshot | Oct group C |
| `Report.pdf` | PDF Report | Reports section |
| `MineConnect_Full_RED .pptx` | Presentation | Reports section |
| `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` | SVG icons | Next.js defaults — not used in showcase |

Total: **17 screenshots**, 1 PDF, 1 PPTX.

### Proposed grouping (based on timestamps as proxy for feature areas)

| Group | ID | Files | Description |
|---|---|---|---|
| Core Features | `core` | `Screenshot 2026-09-29 111906.png`, `Screenshot 2026-09-29 113813.png` | Early Sep screenshots — likely initial feature views |
| Admin / Management | `admin` | `Screenshot 2026-10-20 150319.png` through `150856.png` (7 files) | Oct 20 morning batch — dashboard/management screens |
| Reports & Documents | `reports` | `Screenshot 2026-10-20 153147.png` through `153443.png` (7 files), `Report.pdf`, `MineConnect_Full_RED .pptx` | Oct 20 afternoon batch — reporting/data screens + documents |
| Mobile Views | `mobile` | *(none found — no portrait-aspect or `mobile_` prefixed files)* | Reserved; add files here when available |

---

## 8. Existing Codebase State

- `app/page.tsx` — default Next.js starter page; no showcase content yet.
- `app/layout.tsx` — uses `LayoutProps<"/">` (Next.js 16 generated type), Geist fonts, Tailwind body classes.
- `app/showcase/` — directory exists but is empty.
- `components/showcase/` — directory exists but is empty.
- `data/` — directory does not yet exist.
- No existing brand accent color beyond zinc/black. New accent colors should be added to `globals.css` under `@theme inline`.

---

## 9. Install Command

All required packages are **already installed** per `package.json`:
```
three ^0.186.1
@react-three/fiber ^9.8.2
@react-three/drei ^10.7.9
framer-motion ^14.4.0
@types/three ^0.186.0
```

No additional installs needed.

---

## 10. Summary of Breaking Changes vs Next.js 14/15

| Topic | Change |
|---|---|
| `priority` prop | **Deprecated in v16** — use `preload={true}` instead |
| `images.qualities` config | **Required in v16** — must list all allowed quality values |
| `params` in layouts/pages | **Now a Promise** (since v15) — must `await params` or use `React.use(params)` |
| `LayoutProps` type | **Globally available in v16** — no import, generated by `next dev`/`next build` |
| Metadata streaming | New in v16 — metadata streams separately for dynamic pages; bots still get blocking metadata |
| `onLoadingComplete` | **Deprecated in v14** — use `onLoad` instead |
| `"use client"` boundary | Unchanged — still required for hooks, Three.js, Framer Motion |
| `next/dynamic` + `ssr: false` | Still the correct pattern for Three.js Canvas to avoid SSR errors |
| Tailwind v4 | Uses `@import "tailwindcss"` — no `tailwind.config.js`; theme via CSS `@theme` blocks |
