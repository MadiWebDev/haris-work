'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { ShowcaseItem } from '@/data/showcase';
import { BLUR_DATA_URL } from '@/data/showcase';

/**
 * Detects WebGL availability entirely on the client side (inside useEffect)
 * to avoid server/client mismatch. Defaults to `true` so the server render
 * and initial client render both assume WebGL is available; the hook corrects
 * itself after mount if WebGL is actually missing.
 */
export function useWebGL(): { webGLAvailable: boolean } {
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx =
        canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
      setWebGLAvailable(!!ctx);
    } catch {
      setWebGLAvailable(false);
    }
  }, []);

  return { webGLAvailable };
}

interface WebGLFallbackProps {
  items: ShowcaseItem[];
}

/**
 * Renders a static 2-column grid of next/image thumbnails.
 * Shown when WebGL is unavailable (old device, privacy browser, etc.).
 */
export default function WebGLFallback({ items }: WebGLFallbackProps) {
  return (
    <div
      role="region"
      aria-label="Screenshot gallery (WebGL unavailable)"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
        padding: '2rem',
      }}
    >
      {items.map((item) =>
        item.images.map((src, imgIdx) => (
          <div
            key={`${item.id}-${imgIdx}`}
            className="showcase-glass"
            style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}
          >
            <Image
              src={src}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        )),
      )}
    </div>
  );
}
