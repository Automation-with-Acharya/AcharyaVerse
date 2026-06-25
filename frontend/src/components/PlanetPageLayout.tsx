import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  accentColor?: string;
  children: ReactNode;
};

export default function PlanetPageLayout({ title, subtitle, accentColor = "#60a5fa", children }: Props) {
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
      {/* Animated background gradient blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse at 15% 40%, ${accentColor}08 0%, transparent 55%),
            radial-gradient(ellipse at 85% 60%, #6d28d908 0%, transparent 55%),
            radial-gradient(ellipse at 50% 90%, #0a0f2e 0%, transparent 60%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "32px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: accentColor,
              textDecoration: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              padding: "8px 16px",
              background: `${accentColor}10`,
              border: `1px solid ${accentColor}25`,
              borderRadius: "50px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${accentColor}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${accentColor}10`;
            }}
          >
            ← Return To Universe
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginTop: "36px", marginBottom: "48px" }}
        >
          <h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: accentColor,
              marginBottom: "10px",
              textShadow: `0 0 30px ${accentColor}50`,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#64748b",
                fontSize: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              {subtitle}
            </p>
          )}
          {/* Accent line */}
          <div
            style={{
              height: "2px",
              width: "80px",
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              marginTop: "16px",
              borderRadius: "2px",
            }}
          />
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
