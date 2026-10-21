"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Landing() {
  const reduce = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  // Mouse-driven 3D tilt for the avatar
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 14 });
  const sy = useSpring(my, { stiffness: 120, damping: 14 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [14, -14]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <main className="stage" onMouseMove={onMove}>
      <style>{css}</style>

      {/* Aurora background */}
      <div className="aurora a1" aria-hidden="true" />
      <div className="aurora a2" aria-hidden="true" />
      <div className="aurora a3" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="center">
        {/* Avatar */}
        <motion.div
          className="avatar-wrap"
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          initial={{ opacity: 0, scale: 0.4, filter: "blur(24px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {/* expanding pulse rings */}
          <span className="pulse p1" aria-hidden="true" />
          <span className="pulse p2" aria-hidden="true" />

          {/* spinning gradient ring */}
          <span className="ring" aria-hidden="true" />
          <span className="ring-blur" aria-hidden="true" />

          <motion.div
            className="avatar"
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {imgFailed ? (
              <span className="monogram">H</span>
            ) : (
              <Image
                src="/avatar.jpeg"
                alt="Haris"
                fill
                sizes="(max-width: 600px) 200px, 260px"
                priority
                style={{ objectFit: "cover" }}
                onError={() => setImgFailed(true)}
              />
            )}
            <span className="sheen" aria-hidden="true" />
          </motion.div>
        </motion.div>

        {/* Showcase button */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.9 }}
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Link href="/showcase" className="cta">
              <span className="cta-border" aria-hidden="true" />
              <span className="cta-shine" aria-hidden="true" />
              <span className="cta-label">Project Showcase</span>
              <svg
                className="cta-arrow"
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

const css = `
.stage{
  min-height:100vh; min-height:100dvh; position:relative; overflow:hidden;
  background:#07070d; color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-geist-sans), system-ui, sans-serif;
}
.center{
  position:relative; z-index:2; display:flex; flex-direction:column;
  align-items:center; gap:clamp(2.5rem,7vh,4rem); padding:2rem 1.5rem;
}

/* Aurora */
.aurora{ position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; opacity:.55; }
.a1{ width:clamp(280px,48vw,720px); height:clamp(280px,48vw,720px);
  background:radial-gradient(circle,#6366f1 0%,transparent 68%);
  top:-12%; left:-8%; animation:drift1 18s ease-in-out infinite alternate; }
.a2{ width:clamp(260px,42vw,620px); height:clamp(260px,42vw,620px);
  background:radial-gradient(circle,#06b6d4 0%,transparent 68%);
  bottom:-14%; right:-6%; animation:drift2 22s ease-in-out infinite alternate; }
.a3{ width:clamp(200px,32vw,480px); height:clamp(200px,32vw,480px);
  background:radial-gradient(circle,#a855f7 0%,transparent 68%);
  top:40%; left:48%; opacity:.35; animation:drift3 26s ease-in-out infinite alternate; }
@keyframes drift1{ to{ transform:translate(18vw,14vh) scale(1.25);} }
@keyframes drift2{ to{ transform:translate(-20vw,-12vh) scale(1.2);} }
@keyframes drift3{ to{ transform:translate(-26vw,10vh) scale(.8);} }
.grain{ position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.07;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }

/* Avatar */
.avatar-wrap{ position:relative; width:clamp(190px,26vw,260px); aspect-ratio:1; display:grid; place-items:center; }
.avatar{
  position:relative; width:100%; height:100%; border-radius:50%; overflow:hidden;
  background:#10101c; z-index:2;
  box-shadow:0 0 0 6px #07070d, 0 30px 80px rgba(99,102,241,.45);
}
.monogram{ position:absolute; inset:0; display:grid; place-items:center;
  font-size:5rem; font-weight:800;
  background:linear-gradient(135deg,#6366f1,#06b6d4); }
.sheen{ position:absolute; inset:0; z-index:3;
  background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.35) 50%,transparent 65%);
  transform:translateX(-120%); animation:sheen 5s ease-in-out 1.6s infinite; }
@keyframes sheen{ 0%{transform:translateX(-120%);} 35%,100%{transform:translateX(120%);} }

.ring, .ring-blur{
  position:absolute; inset:-14px; border-radius:50%; z-index:1;
  background:conic-gradient(from 0deg,#6366f1,#06b6d4,#a855f7,#6366f1);
  animation:spin 6s linear infinite;
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));
          mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));
}
.ring-blur{ filter:blur(14px); opacity:.85; inset:-18px;
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 14px),#000 calc(100% - 13px));
          mask:radial-gradient(farthest-side,transparent calc(100% - 14px),#000 calc(100% - 13px)); }
@keyframes spin{ to{ transform:rotate(360deg);} }

.pulse{ position:absolute; inset:0; border-radius:50%; z-index:0;
  border:1px solid rgba(165,180,252,.55); opacity:0; animation:pulse 4s ease-out infinite; }
.p2{ animation-delay:2s; }
@keyframes pulse{ 0%{ transform:scale(1); opacity:.7;} 100%{ transform:scale(2.1); opacity:0;} }

/* CTA */
.cta{
  position:relative; display:inline-flex; align-items:center; gap:.75rem;
  padding:1.05rem 2.4rem; min-height:56px; border-radius:999px; overflow:hidden;
  color:#fff; text-decoration:none; font-weight:600; font-size:1.05rem; letter-spacing:.01em;
  background:rgba(255,255,255,.06);
  -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
  box-shadow:0 10px 40px rgba(99,102,241,.35), inset 0 0 0 1px rgba(255,255,255,.1);
  transition:box-shadow .4s;
}
.cta:hover{ box-shadow:0 14px 60px rgba(6,182,212,.5), inset 0 0 0 1px rgba(255,255,255,.2); }
.cta:focus-visible{ outline:2px solid #a5b4fc; outline-offset:4px; }
.cta-border{ position:absolute; inset:-60%; z-index:0;
  background:conic-gradient(from 0deg,transparent 0 70%,#06b6d4 85%,#6366f1 100%);
  animation:spin 3.5s linear infinite; opacity:.9; }
.cta::before{ content:""; position:absolute; inset:2px; border-radius:inherit; background:#0b0b16; z-index:1; }
.cta-shine{ position:absolute; inset:0; z-index:2;
  background:linear-gradient(110deg,transparent 40%,rgba(255,255,255,.18) 50%,transparent 60%);
  transform:translateX(-120%); animation:sheen 4s ease-in-out 2s infinite; }
.cta-label,.cta-arrow{ position:relative; z-index:3; }
.cta-arrow{ transition:transform .35s cubic-bezier(.16,1,.3,1); animation:nudge 2s ease-in-out infinite; }
.cta:hover .cta-arrow{ transform:translateX(6px); animation:none; }
@keyframes nudge{ 50%{ transform:translateX(4px);} }

@media (prefers-reduced-motion: reduce){
  .aurora,.ring,.ring-blur,.pulse,.sheen,.cta-border,.cta-shine,.cta-arrow{ animation:none !important; }
}
`;