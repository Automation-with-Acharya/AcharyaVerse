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

/** Tiny animated star — pure CSS, no canvas, so it works in any DOM context */
function StarField({ accentColor }: { accentColor: string }) {
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
    }))
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
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
            background: s.id % 5 === 0 ? accentColor : "#ffffff",
            boxShadow:
              s.id % 5 === 0
                ? `0 0 ${s.size * 2}px ${accentColor}`
                : `0 0 ${s.size}px rgba(255,255,255,0.6)`,
          }}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000005",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${accentColor}, #a78bfa)`,
          transformOrigin: "0%",
          scaleX,
          zIndex: 100,
        }}
      />

      {/* Live starfield background */}
      <StarField accentColor={accentColor} />

      {/* Animated radial gradient blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse at 15% 40%, ${accentColor}0a 0%, transparent 55%),
            radial-gradient(ellipse at 85% 60%, #6d28d90a 0%, transparent 55%),
            radial-gradient(ellipse at 50% 90%, #0a0f2e 0%, transparent 60%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating top nav — sticks on scroll */}
      <motion.div
        style={{
          position: "fixed",
          top: "12px",
          left: "50%",
          x: "-50%",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            background: scrolled
              ? "rgba(2,8,20,0.85)"
              : "rgba(2,8,20,0.4)",
            backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
            boxShadow: scrolled
              ? `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}20`
              : "none",
          }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "50px",
            padding: "6px 16px 6px 6px",
            border: `1px solid ${accentColor}20`,
          }}
        >
          {/* Planet icon dot */}
          <motion.div
            animate={{ boxShadow: [`0 0 8px ${accentColor}`, `0 0 18px ${accentColor}`, `0 0 8px ${accentColor}`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}60`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
            }}
          >
            ✦
          </motion.div>

          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: accentColor,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
        </motion.div>

        {/* Return pill */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "50px",
            background: "rgba(2,8,20,0.7)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${accentColor}30`,
            color: accentColor,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
            textDecoration: "none",
            fontWeight: 500,
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = `${accentColor}18`;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accentColor}60`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(2,8,20,0.7)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accentColor}30`;
          }}
        >
          ← Universe
        </Link>
      </motion.div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "100px 40px 32px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          style={{ marginBottom: "48px" }}
        >
          <motion.h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: accentColor,
              marginBottom: "10px",
              textShadow: `0 0 40px ${accentColor}60`,
              lineHeight: 1.1,
            }}
            animate={{
              textShadow: [
                `0 0 30px ${accentColor}40`,
                `0 0 60px ${accentColor}70`,
                `0 0 30px ${accentColor}40`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#64748b",
                fontSize: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Animated accent line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            style={{
              height: "2px",
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              marginTop: "16px",
              borderRadius: "2px",
            }}
          />
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
