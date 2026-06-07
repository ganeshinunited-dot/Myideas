"use client";
import { useEffect, useRef } from "react";

/* ───────────────────────────────────────────────────────────────
   Stripe-style animated gradient mesh background.
   Renders large, softly blurred colour blobs that drift and
   morph continuously — giving that signature premium feel.
   ─────────────────────────────────────────────────────────────── */

type Blob = {
  x: number;       // normalised 0-1
  y: number;
  vx: number;
  vy: number;
  radius: number;  // normalised to min(W,H)
  color: string;
};

const BLOB_DEFS: Omit<Blob, "vx" | "vy">[] = [
  // deep indigo – top-left anchor
  { x: 0.15, y: 0.15, radius: 0.55, color: "rgba(80,  40, 200, 0.8)" },
  // vivid blue – centre-left
  { x: 0.30, y: 0.50, radius: 0.50, color: "rgba(50, 100, 255, 0.7)" },
  // teal – bottom-left
  { x: 0.20, y: 0.80, radius: 0.45, color: "rgba(0,  200, 200, 0.65)" },
  // green – bottom-centre
  { x: 0.55, y: 0.85, radius: 0.48, color: "rgba(50, 210, 130, 0.6)" },
  // warm orange – right
  { x: 0.80, y: 0.35, radius: 0.42, color: "rgba(255, 140, 50, 0.55)" },
  // magenta/pink – top-right
  { x: 0.78, y: 0.12, radius: 0.38, color: "rgba(220, 50, 180, 0.6)" },
  // pale blue highlight
  { x: 0.50, y: 0.40, radius: 0.50, color: "rgba(100, 160, 255, 0.45)" },
  // extra deep purple – bottom-right
  { x: 0.75, y: 0.70, radius: 0.40, color: "rgba(100, 30, 180, 0.55)" },
];

function initBlobs(): Blob[] {
  return BLOB_DEFS.map((d) => ({
    ...d,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
  }));
}

export default function Burst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = initBlobs();
    let raf: number;
    let t = 0;

    const draw = () => {
      t += 0.004;

      // Dark navy base (Stripe-like)
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, W, H);

      const dim = Math.min(W, H);

      for (const b of blobs) {
        // drift
        b.x += b.vx + Math.sin(t * 0.7 + b.radius * 10) * 0.00015;
        b.y += b.vy + Math.cos(t * 0.6 + b.radius * 8) * 0.00015;

        // soft bounce
        if (b.x < -0.15 || b.x > 1.15) b.vx *= -1;
        if (b.y < -0.15 || b.y > 1.15) b.vy *= -1;

        const cx = b.x * W;
        const cy = b.y * H;
        const r = b.radius * dim * (1 + Math.sin(t + b.x * 5) * 0.08);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.6, b.color.replace(/[\d.]+\)$/, "0.25)"));
        grad.addColorStop(1, b.color.replace(/[\d.]+\)$/, "0)"));

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // subtle light bloom at top-centre (simulates Stripe's "glow")
      const bloom = ctx.createRadialGradient(W * 0.45, H * 0.1, 0, W * 0.45, H * 0.25, dim * 0.7);
      bloom.addColorStop(0, "rgba(160, 180, 255, 0.12)");
      bloom.addColorStop(0.5, "rgba(100, 140, 255, 0.04)");
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // slight noise-like grain overlay for texture (very subtle)
      ctx.fillStyle = "rgba(255,255,255,0.012)";
      for (let i = 0; i < 60; i++) {
        const nx = Math.random() * W;
        const ny = Math.random() * H;
        ctx.fillRect(nx, ny, 2, 2);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}
