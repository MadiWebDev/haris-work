# Implementation Plan — HarisPortfolio Project Showcase

## Asset Grouping Table

| Group | ID | Files | Description |
|---|---|---|---|
| Core Features | `core` | `Screenshot 2026-09-29 111906.png`, `Screenshot 2026-09-29 113813.png` | Early Sep screenshots — initial feature views |
| Admin / Management | `admin` | `Screenshot 2026-10-20 150319.png` through `150856.png` (7 files) | Oct 20 morning batch — dashboard/management screens |
| Reports & Documents | `reports` | `Screenshot 2026-10-20 153147.png` through `153443.png` (7 files) + `Report.pdf` + `MineConnect_Full_RED .pptx` | Oct 20 afternoon batch — reporting screens + documents |
| Mobile Views | `mobile` | *(none — reserved for future screenshots)* | Placeholder group; add files to showcase.ts when available |

---

## Key Technical Decisions

1. **Three.js components loaded with `next/dynamic + ssr:false` at the page level**, not inside the component. Hero.tsx and Gallery3D.tsx export their Canvas directly; page.tsx wraps them in `dynamic()`. Rationale: keeps components self-contained and avoids double-wrapping.

2. **Lightbox + GroupNav state lives in a `ShowcasePageClient.tsx` client shell**. Since `app/showcase/page.tsx` is a Server Component (needed for metadata export), all interactive state is delegated to this thin client wrapper. FeatureCard communicates upward via a React Context (`ShowcaseContext`) to avoid prop-drilling through server nodes.

3. **Tailwind v4 dynamic colors use `inline style={{ color: '#hex' }}`** — no arbitrary Tailwind classes. Accent colors for each group are defined as CSS variables in `globals.css` under a new `@theme inline` block, and consumed via `var(--color-core)` etc. in JSX style props.

4. **Image paths with spaces**: `next/image` accepts them as-is (the browser handles encoding). For `useTexture` (Three.js), each filename segment must be percent-encoded: `encodeURIComponent('Screenshot 2026-09-29 111906.png')` → `'Screenshot%202026-09-29%20111906.png'`, then prepended with `'/'`. Never encode the `/` itself.

5. **`priority` is deprecated in Next.js 16** — use `preload={true}` for the hero LCP image. Use `loading="eager"` for above-fold images that are not the LCP.

6. **`images.qualities: [75]` must be added to `next.config.ts`** — Next.js 16 rejects quality values not in the allowlist.

7. **No `tailwind.config.js`** — all new design tokens go in `globals.css` under `@theme inline {}`.

---

## Detailed Implementation Steps

- [ ] 1. **Add `images.qualities` to `next.config.ts`**
      Add `images: { qualities: [75] }` to the `nextConfig` object. Keep all existing flags.
      Files: `next.config.ts`
      Verify: `npx next build` — no "quality not in allowlist" error.

- [ ] 2. **Create `data/showcase.ts`** — typed data file with all assets.
      Define `ShowcaseItem` type, `GROUP_META` map, `BLUR_DATA_URL` constant, `showcaseItems` array.
      All 17 screenshots assigned to correct groups; Report.pdf and MineConnect_Full_RED .pptx in reports group.

      ```ts
      // Types
      export type ShowcaseGroup = 'core' | 'admin' | 'reports' | 'mobile';

      export type ShowcaseItem = {
        id: string;
        title: string;
        description: string;
        images: string[];          // paths as-is from /public (spaces preserved for next/image)
        reportUrl?: string;
        tags: string[];
        group: ShowcaseGroup;
      };

      export type GroupMeta = {
        label: string;
        letter: string;            // A/B/C/D
        accent: string;            // hex color
        intro: string;
      };

      export const GROUP_META: Record<ShowcaseGroup, GroupMeta> = {
        core:    { label: 'Core Features',        letter: 'A', accent: '#6366f1', intro: '...' },
        admin:   { label: 'Admin / Management',   letter: 'B', accent: '#06b6d4', intro: '...' },
        reports: { label: 'Reports & Documents',  letter: 'C', accent: '#10b981', intro: '...' },
        mobile:  { label: 'Mobile Views',         letter: 'D', accent: '#f59e0b', intro: '...' },
      };

      export const BLUR_DATA_URL =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      export const showcaseItems: ShowcaseItem[] = [ ... ];
      ```

      Files: `data/showcase.ts` (create `data/` directory)
      Verify: `npx next build` — TypeScript compiles with 0 errors.

- [ ] 3. **Append CSS variables to `app/globals.css`** (append-only — preserve all existing content).
      Add a new `@theme inline` block with `--color-core`, `--color-admin`, `--color-reports`, `--color-mobile`, `--showcase-bg`.
      Add `.showcase-glass` utility and `html { scroll-behavior: smooth; }`.
      Files: `app/globals.css`
      Verify: `npx next build` — no CSS parse errors.

- [ ] 4. **Create `components/showcase/WebGLFallback.tsx`**
      'use client'. Exports `useWebGL()` hook (returns boolean, checks via `useEffect` + `try { canvas.getContext('webgl') }`) and a default `WebGLFallback` component that renders a static 2-column grid of `next/image` thumbnails when WebGL is unavailable.

      ```ts
      interface WebGLFallbackProps {
        items: ShowcaseItem[];
      }
      ```

      Files: `components/showcase/WebGLFallback.tsx`
      Verify: `npx next build` — no TypeScript errors.

- [ ] 5. **Create `components/showcase/ScrollProgress.tsx`**
      'use client'. Fixed h-1 top bar using `useScroll` + `useSpring` + `motion.div`.
      Respects `prefers-reduced-motion`.

      ```ts
      // No props needed
      export default function ScrollProgress(): JSX.Element
      ```

      Import pattern:
      ```ts
      import { motion, useScroll, useSpring } from 'framer-motion';
      ```

      Files: `components/showcase/ScrollProgress.tsx`
      Verify: `npx next build` — no errors.

- [ ] 6. **Create `components/showcase/GroupNav.tsx`**
      'use client'. Sticky nav with animated `layoutId='group-indicator'` active pill.
      Dynamic accent color via `inline style`.

      ```ts
      interface GroupNavProps {
        activeGroup: ShowcaseGroup;
        onGroupClick: (id: ShowcaseGroup) => void;
      }
      ```

      Import pattern:
      ```ts
      import { motion, AnimatePresence } from 'framer-motion';
      import { GROUP_META } from '@/data/showcase';
      ```

      Files: `components/showcase/GroupNav.tsx`
      Verify: `npx next build` — no errors.

- [ ] 7. **Create `components/showcase/ReportCard.tsx`**
      'use client'. Animated glassmorphism card for PDF/PPTX files.

      ```ts
      interface ReportCardProps {
        title: string;
        description: string;
        fileUrl: string;
        fileType: 'pdf' | 'pptx';
      }
      ```

      Buttons: Open (`target='_blank' rel='noopener noreferrer'`) + Download (`download` attribute).
      Files: `components/showcase/ReportCard.tsx`
      Verify: `npx next build` — no errors.

- [ ] 8. **Create `components/showcase/FeatureCard.tsx`**
      'use client'. Device-frame screenshot card with 3D tilt effect.

      ```ts
      interface FeatureCardProps {
        item: ShowcaseItem;
        accentColor: string;   // hex, passed via inline style
        index: number;
      }
      ```

      **3D tilt pattern:**
      ```ts
      const rotateX = useMotionValue(0);
      const rotateY = useMotionValue(0);
      const springConfig = { stiffness: 200, damping: 20 };
      const rotateXSpring = useSpring(rotateX, springConfig);
      const rotateYSpring = useSpring(rotateY, springConfig);

      function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        const y = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        rotateX.set(x * -10);
        rotateY.set(y * 10);
      }
      function handleMouseLeave() { rotateX.set(0); rotateY.set(0); }
      ```

      **Scroll-triggered reveal:**
      ```ts
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
        viewport={{ once: true, margin: '-80px' }}
      >
      ```

      **Image**: `next/image` with `fill`, `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`, `placeholder="blur"`, `blurDataURL={BLUR_DATA_URL}`.

      Image click: calls `useShowcaseContext().openLightbox(item.images, imageIndex)`.

      Files: `components/showcase/FeatureCard.tsx`
      Verify: `npx next build` — no errors.

- [ ] 9. **Create `components/showcase/GroupSection.tsx`**
      'use client'. Section wrapper with animated heading, intro text, staggered card grid.

      ```ts
      interface GroupSectionProps {
        group: ShowcaseGroup;
        items: ShowcaseItem[];
      }
      ```

      **Stagger pattern:**
      ```ts
      const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
      };
      // items rendered inside <motion.div variants={containerVariants} whileInView="show" viewport={{ once: true }}>
      ```

      **Heading text reveal:**
      ```ts
      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
      ```

      Files: `components/showcase/GroupSection.tsx`
      Verify: `npx next build` — no errors.

- [ ] 10. **Create `components/showcase/Hero.tsx`** — Three.js hero scene.
       'use client'. Exports default `HeroWrapper` (renders `<Canvas>` directly; caller uses `next/dynamic` with `ssr:false`).

       **Inner scene structure:**
       ```tsx
       function HeroScene() {
         // useTexture for core group images (encoded paths)
         // Float component from @react-three/drei for gentle levitation
         // One plane mesh per screenshot with computed aspect ratio
         // 500-point particle system (150 on mobile)
         // useFrame: rotate planes, animate particles — gated by reducedMotion ref
       }

       export default function HeroWrapper() {
         return (
           <Canvas
             dpr={[1, 2]}
             camera={{ position: [0, 0, 5], fov: 60 }}
             gl={{ antialias: false, powerPreference: 'high-performance' }}
             style={{ height: '100vh' }}
           >
             <ambientLight intensity={0.6} />
             <directionalLight position={[5, 5, 5]} intensity={0.8} />
             <Suspense fallback={<Html center><div className="text-white">Loading...</div></Html>}>
               <HeroScene />
             </Suspense>
           </Canvas>
         );
       }
       ```

       **Path encoding for useTexture:**
       ```ts
       // Encode each filename segment — NOT the slash
       function encodePath(path: string): string {
         return '/' + path.replace(/^\//, '').split('/').map(encodeURIComponent).join('/');
       }
       // Usage:
       const textures = useTexture(item.images.map(encodePath));
       ```

       **Off-screen pause (IntersectionObserver):**
       ```ts
       // In HeroWrapper, attach ref to a container div wrapping Canvas
       // useEffect: IntersectionObserver on containerRef
       // When not intersecting: call invalidate() pattern or set frameloop state
       // Use a ref + useThree({ frameloop setter }) — simpler: just frameloop='demand'
       // and call invalidate() on mouse-move/scroll events only
       ```

       **prefers-reduced-motion:**
       ```ts
       const reducedMotion = useRef(
         typeof window !== 'undefined' &&
         window.matchMedia('(prefers-reduced-motion: reduce)').matches
       );
       // In useFrame: if (reducedMotion.current) return;
       ```

       Imports:
       ```ts
       import { Canvas, useFrame, useThree } from '@react-three/fiber';
       import { useTexture, Float, Html } from '@react-three/drei';
       import { Suspense, useRef, useEffect } from 'react';
       ```

       Files: `components/showcase/Hero.tsx`
       Verify: `npx next build` — no SSR errors, no TypeScript errors.

- [ ] 11. **Create `components/showcase/Gallery3D.tsx`** — Three.js image gallery.
        'use client'. Exports default `Gallery3DWrapper`.

        **Arc arrangement:**
        ```ts
        // n = items.length (capped at 8)
        // For each i:
        const angle = (i / n) * Math.PI * 1.5 - Math.PI * 0.75;
        const x = Math.sin(angle) * 4;
        const z = Math.cos(angle) * 4;
        const y = 0;
        ```

        **Hover/selection with scale spring:**
        ```ts
        // Each plane mesh:
        // onPointerOver: set isHovered=true → scale lerp to 1.15
        // onPointerOut: scale lerp to 1.0
        // onClick: call onSelect(item)
        // Use useFrame to lerp scale smoothly
        ```

        **OrbitControls config (no scroll hijack):**
        ```ts
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />
        ```

        **WebGL fallback:**
        ```tsx
        // In Gallery3DWrapper:
        const { webGLAvailable } = useWebGL();
        if (!webGLAvailable) return <WebGLFallback items={items} />;
        ```

        **Selected item overlay** (outside Canvas, in wrapper div):
        ```tsx
        <div style={{ position: 'relative' }}>
          <Canvas ...>...</Canvas>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 ..."
            >
              <h3>{selectedItem.title}</h3>
              <p>{selectedItem.description}</p>
            </motion.div>
          )}
        </div>
        ```

        Imports:
        ```ts
        import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
        import { useTexture, OrbitControls } from '@react-three/drei';
        ```

        Files: `components/showcase/Gallery3D.tsx`
        Verify: `npx next build` — no errors.

- [ ] 12. **Create `components/showcase/Lightbox.tsx`**
        'use client'. Full-screen overlay modal with `AnimatePresence` + `layoutId` shared transition.

        ```ts
        interface LightboxProps {
          images: string[];
          initialIndex: number;
          caption?: string;
          onClose: () => void;
          triggerRef?: React.RefObject<HTMLElement>;
        }
        ```

        **Pattern:**
        ```tsx
        // Outer: motion.div fixed inset-0 z-50 bg-black/90 backdrop-blur
        //   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        // Image: motion.div with layoutId={`lightbox-img-${images[currentIndex]}`}
        //   initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}

        // Keyboard:
        useEffect(() => {
          function handleKey(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Escape') onClose();
          }
          window.addEventListener('keydown', handleKey);
          return () => window.removeEventListener('keydown', handleKey);
        }, [currentIndex]);

        // Focus management:
        useEffect(() => {
          overlayRef.current?.focus();
          return () => triggerRef?.current?.focus();
        }, []);

        // Swipe:
        useEffect(() => {
          let startX = 0;
          function onTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; }
          function onTouchEnd(e: TouchEvent) {
            const dx = startX - e.changedTouches[0].clientX;
            if (dx > 50) next();
            if (dx < -50) prev();
          }
          const el = overlayRef.current;
          el?.addEventListener('touchstart', onTouchStart);
          el?.addEventListener('touchend', onTouchEnd);
          return () => { el?.removeEventListener(...); };
        }, [currentIndex]);
        ```

        Files: `components/showcase/Lightbox.tsx`
        Verify: `npx next build` — no errors.

- [ ] 13. **Create `app/showcase/ShowcaseContext.tsx`**
        'use client'. React Context for lightbox state.

        ```ts
        interface ShowcaseContextValue {
          openLightbox: (images: string[], initialIndex: number) => void;
        }
        export const ShowcaseContext = createContext<ShowcaseContextValue | null>(null);
        export function useShowcaseContext(): ShowcaseContextValue { ... }
        ```

        Files: `app/showcase/ShowcaseContext.tsx`
        Verify: `npx next build` — no errors.

- [ ] 14. **Create `app/showcase/ShowcasePageClient.tsx`**
        'use client'. Thin client shell that:
        - Provides `ShowcaseContext` with `openLightbox` function.
        - Owns `lightboxOpen` + `lightboxImages` + `lightboxInitialIndex` state.
        - Owns `activeGroup` state, updated by `IntersectionObserver` scroll-spy watching `#core`, `#admin`, `#reports`, `#mobile`.
        - Renders `ScrollProgress`, `GroupNav`, `AnimatePresence` wrapping `Lightbox`.
        - Renders `{children}` slot for server-rendered content.

        ```ts
        interface ShowcasePageClientProps {
          children: React.ReactNode;
        }
        ```

        Files: `app/showcase/ShowcasePageClient.tsx`
        Verify: `npx next build` — no errors.

- [ ] 15. **Create `app/showcase/page.tsx`** — the route.
        Server Component — no 'use client'. Exports `metadata`.

        ```ts
        import type { Metadata } from 'next';
        import dynamic from 'next/dynamic';
        import { Suspense } from 'react';
        import { showcaseItems, GROUP_META } from '@/data/showcase';
        import ScrollProgress from '@/components/showcase/ScrollProgress';
        import GroupNav from '@/components/showcase/GroupNav';
        import GroupSection from '@/components/showcase/GroupSection';
        import ReportCard from '@/components/showcase/ReportCard';
        import ShowcasePageClient from './ShowcasePageClient';

        const Hero = dynamic(() => import('@/components/showcase/Hero'), {
          ssr: false,
          loading: () => <div className="animate-pulse bg-zinc-900 h-screen w-full" />,
        });

        const Gallery3D = dynamic(() => import('@/components/showcase/Gallery3D'), {
          ssr: false,
          loading: () => <div className="animate-pulse bg-zinc-900 h-[600px] w-full rounded-2xl" />,
        });

        export const metadata: Metadata = {
          title: 'Project Showcase — HarisPortfolio',
          description: 'A visual tour of MineConnect features, dashboards, and reports.',
          openGraph: { ... },
        };
        ```

        Page JSX structure:
        ```tsx
        <ShowcasePageClient>
          <Hero />                      {/* dynamic ssr:false */}
          {/* Group sections */}
          {(['core','admin','reports','mobile'] as ShowcaseGroup[]).map(g => (
            <GroupSection key={g} group={g} items={grouped[g]} />
          ))}
          {/* 3D gallery */}
          <section id="gallery-3d" ...>
            <Suspense fallback={...}>
              <Gallery3D items={showcaseItems} />
            </Suspense>
          </section>
          {/* Reports */}
          <section id="reports-docs" ...>
            {reportDocs.map(doc => <ReportCard ... />)}
          </section>
          {/* Footer CTA */}
        </ShowcasePageClient>
        ```

        Files: `app/showcase/page.tsx`
        Verify: `npx next build` — /showcase route emitted, 0 errors.

- [ ] 16. **Final build verification**
        Run `npx next build`. Expected: exit 0, route `/showcase` listed, 0 TypeScript errors, 0 "priority is deprecated" warnings (we use `preload`), 0 hydration warnings.
        Files: none
        Verify: `cd d:\My-Projects\NEXT\hariswork && npx next build`

---

## Known Gotchas & Technical Notes

### Next.js 16 / React 19 / r3f 9 Compatibility
- `@react-three/fiber@9` requires `react@19` (peer: `>=19 <19.4`). This project has `react@19.3.0` — compatible.
- `@react-three/drei@10` requires `@react-three/fiber@^9` — compatible.
- `framer-motion@14` supports `react@^18 || ^19` — compatible.

### Hydration Warnings — Avoidance Rules
- Never access `window`, `document`, `navigator`, `matchMedia` at module level. Always inside `useEffect` or event handlers.
- `useMotionValue`, `useSpring`, `useScroll` are safe in 'use client' components — they don't cause hydration mismatch.
- For the WebGL detection: `const [webGL, setWebGL] = useState(true)` (default true) + `useEffect(() => { setWebGL(detectWebGL()) }, [])`. This avoids a server/client mismatch.
- Three.js Canvas components are only rendered on the client (`ssr: false`) so no hydration issues there.

### `useTexture` Return Type
`useTexture` with an array returns `Texture[]`. With a single string it returns `Texture`. Always pass an array when you want an array back, and type the result as `Texture[]`:
```ts
const textures = useTexture(paths) as Texture[];
```
Wrap `useTexture` calls in a Suspense boundary — it throws a promise during load.

### AnimatePresence in Server Components
`AnimatePresence` requires `'use client'`. It must be in a client component. Never try to export it from a Server Component. The `ShowcasePageClient.tsx` is the correct place.

### `layoutId` Shared Transitions
The `layoutId` string must be the same between the FeatureCard thumbnail and the Lightbox image for the zoom-in shared transition. Use `layoutId={"lightbox-img-" + imageSrc}` in FeatureCard's image wrapper and the same in Lightbox.

### framer-motion `useScroll` in Nested Scroll Containers
`useScroll()` without arguments tracks the page scroll. If there is a scrollable container, pass `container` ref. For this page we track window scroll — no container needed.

### Mobile Touch + Three.js OrbitControls
Set `enablePan={false}` and `enableZoom={false}` on OrbitControls. The `touches` prop defaults allow single-finger rotate — this is fine. Vertical page scroll is NOT hijacked because OrbitControls only intercepts horizontal drag. Document this explicitly in comments so future devs don't accidentally re-enable pan/zoom.

### Framer Motion `whileInView` on Mobile
`viewport={{ once: true, margin: '-80px' }}` prevents re-triggering. On mobile the viewport margin should be smaller (`'-40px'`) to trigger animations sooner. Use a responsive value or a CSS-based approach.

### `next/image` with Spaces in Paths
`next/image` src prop accepts paths with spaces as-is: `/Screenshot 2026-09-29 111906.png`. Do NOT encode them for `next/image`. Only encode for `useTexture`.

### `preload` vs `priority`
`priority` is deprecated in Next.js 16. Use `preload={true}` for the LCP image only. Everything else uses default lazy loading or `loading="eager"` for above-fold non-LCP images.

### Canvas Frame Loop
Use `frameloop="demand"` for Gallery3D (only renders when something changes — much better for battery/CPU when idle). Use `frameloop="always"` for Hero (continuous gentle animation). Pause Hero when off-screen using IntersectionObserver that sets a ref; inside `useFrame` check the ref and `return` early if off-screen.

### TypeScript Strict Mode Notes
- `ThreeEvent<PointerEvent>` for pointer handlers in R3F: `import type { ThreeEvent } from '@react-three/fiber'`
- `OrbitControls` ref type: `import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'` then `useRef<OrbitControlsImpl>(null)`
- `MotionValue<number>` for tilt values: explicit generic required in strict mode
- `React.RefObject<HTMLElement>` for focus management refs

---

## Assumptions Made
1. No existing brand accent color beyond zinc/black in the project — new palette introduced in globals.css.
2. Screenshots are all desktop-resolution (16:9 assumed for Three.js plane aspect ratio). If aspect ratios differ, the 3D planes will show some letterboxing.
3. No mobile-specific screenshots exist; "Mobile Views" group is a placeholder.
4. Project name for the showcase is "MineConnect" (inferred from the PPTX filename `MineConnect_Full_RED .pptx`).
5. The PPTX file cannot be embedded in-browser; it gets a Download button only (no Open button). The PDF gets both Open and Download.
6. No existing navigation header — the GroupNav serves as in-page navigation only.
7. The showcase page is standalone at `/showcase`, not embedded in the home page.
8. All screenshot descriptions are placeholder text — the implementer should fill them in from actual screenshot content.

---

## How to Add a New Screenshot or Report
Edit **`data/showcase.ts`** only:
- Add the file to `/public`
- Add a new `ShowcaseItem` to `showcaseItems` (or add the path to an existing item's `images` array)
- Set the `group` to `'core'`, `'admin'`, `'reports'`, or `'mobile'`
- The components pick up the data automatically — no component code changes needed
