import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  accentColor?: string;
  children: ReactNode;
};

function StarField({ accentColor }: { accentColor: string }) {
  const stars = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.4 + Math.random() * 1.8,
      delay: Math.random() * 8,
      duration: 2.5 + Math.random() * 5,
    }))
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.current.map((s) => (
        <motion.div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            background: s.id % 7 === 0 ? accentColor : "#ffffff",
            boxShadow: s.id % 7 === 0
              ? `0 0 ${s.size * 3}px ${accentColor}`
              : `0 0 ${s.size}px rgba(255,255,255,0.5)`,
          }}
          animate={{ opacity: [0.05, 0.85, 0.05] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function PlanetPageLayout({
  title,
  subtitle,
  accentColor = "#60a5fa",
  children,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000005", color: "white", position: "relative" }}>

      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg, ${accentColor}, #a78bfa, ${accentColor})`,
          transformOrigin: "0%", scaleX, zIndex: 100,
        }}
      />

      {/* Starfield */}
      <StarField accentColor={accentColor} />

      {/* Radial atmosphere blobs */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `
            radial-gradient(ellipse at 10% 20%, ${accentColor}12 0%, transparent 45%),
            radial-gradient(ellipse at 90% 80%, #6d28d912 0%, transparent 45%),
            radial-gradient(ellipse at 50% 100%, #020814 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Floating nav pill ── */}
      <motion.nav
        style={{
          position: "fixed", top: "14px", left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 28px", zIndex: 50,
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left — title pill */}
        <motion.div
          animate={{
            background: scrolled ? "rgba(2,8,20,0.92)" : "rgba(2,8,20,0.5)",
            backdropFilter: scrolled ? "blur(24px)" : "blur(10px)",
            boxShadow: scrolled ? `0 4px 28px rgba(0,0,0,0.6), inset 0 0 0 1px ${accentColor}25` : "none",
          }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            borderRadius: "50px", padding: "7px 18px 7px 7px",
            border: `1px solid ${accentColor}18`,
          }}
        >
          <motion.div
            animate={{ boxShadow: [`0 0 6px ${accentColor}80`, `0 0 20px ${accentColor}`, `0 0 6px ${accentColor}80`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: "26px", height: "26px", borderRadius: "50%",
              background: `${accentColor}20`, border: `1px solid ${accentColor}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem",
            }}
          >✦</motion.div>
          <span style={{
            fontFamily: "'Orbitron', monospace", fontSize: "0.78rem",
            fontWeight: 700, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            {title}
          </span>
        </motion.div>

        {/* Right — return button */}
        <Link
          to="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "9px 20px", borderRadius: "50px",
            background: "rgba(2,8,20,0.7)", backdropFilter: "blur(14px)",
            border: `1px solid ${accentColor}28`, color: accentColor,
            fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem",
            letterSpacing: "0.04em", textDecoration: "none", fontWeight: 500,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = `${accentColor}18`;
            el.style.borderColor = `${accentColor}55`;
            el.style.boxShadow = `0 0 18px ${accentColor}25`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "rgba(2,8,20,0.7)";
            el.style.borderColor = `${accentColor}28`;
            el.style.boxShadow = "none";
          }}
        >
          ← Universe
        </Link>
      </motion.nav>

      {/* ── Hero banner — full width, dramatic ── */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: "100px", overflow: "hidden" }}>
        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: "0 48px 56px", maxWidth: "none" }}
        >
          {/* Big decorative label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: `${accentColor}80`,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            ✦ AcharyaVerse
          </motion.div>

          <motion.h1
            animate={{
              textShadow: [
                `0 0 40px ${accentColor}30`,
                `0 0 80px ${accentColor}55`,
                `0 0 40px ${accentColor}30`,
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: accentColor,
              lineHeight: 1.0,
              marginBottom: "18px",
              maxWidth: "none",
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#94a3b8",
                fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
                letterSpacing: "0.03em",
                maxWidth: "750px",
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Wide accent rule */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "1px",
              marginTop: "40px",
              background: `linear-gradient(90deg, ${accentColor}60, ${accentColor}20, transparent)`,
            }}
          />
        </motion.div>

        {/* ── Page content — full width, no artificial max ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 1, padding: "0 48px 80px" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
