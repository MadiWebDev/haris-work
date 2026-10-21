"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d14] text-[#ededed] px-6 overflow-hidden relative">
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-indigo-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-cyan-500/10 blur-[120px]"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-6 max-w-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Big 404 */}
        <motion.p
          className="text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tighter bg-gradient-to-br from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent select-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          aria-label="404"
        >
          404
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-16 h-px bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="text-white/50 text-base leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Go home
          </Link>
          <Link
            href="/showcase"
            className="px-6 py-2.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
          >
            View showcase
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
