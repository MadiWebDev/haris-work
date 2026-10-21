'use client';

import { createContext, useContext } from 'react';

// ─── Context shape ─────────────────────────────────────────────────────────────

export interface ShowcaseContextValue {
  /**
   * Opens the lightbox for a set of images.
   * @param images - flat array of /public image paths for the active item
   * @param initialIndex - zero-based index of the image to show first
   * @param caption - optional caption shown below the image
   */
  openLightbox: (images: string[], initialIndex: number, caption?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const ShowcaseContext = createContext<ShowcaseContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Consume the showcase context inside FeatureCard or any other client
 * component that needs to open the lightbox without prop-drilling through
 * Server Component boundaries.
 *
 * @throws if called outside of a ShowcasePageClient provider
 */
export function useShowcaseContext(): ShowcaseContextValue {
  const ctx = useContext(ShowcaseContext);
  if (!ctx) {
    throw new Error(
      'useShowcaseContext must be used inside a ShowcaseContext.Provider ' +
        '(i.e. inside ShowcasePageClient).',
    );
  }
  return ctx;
}
