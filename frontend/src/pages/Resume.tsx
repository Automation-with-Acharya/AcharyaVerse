import PlanetPageLayout from "../components/PlanetPageLayout";
import { motion } from "framer-motion";

const achievements = [
  { icon: "⏱️", value: "10,000+", label: "Hours Saved Annually", color: "#fbbf24" },
  { icon: "📉", value: "90%",     label: "Audit Time Reduced",   color: "#34d399" },
  { icon: "🤖", value: "15+",     label: "Bots Deployed",         color: "#60a5fa" },
  { icon: "👥", value: "6",       label: "Engineers Led",          color: "#a78bfa" },
];

const skills = [
  { name: ".NET / C#",     color: "#60a5fa" },
  { name: "Python",         color: "#34d399" },
  { name: "React",          color: "#22d3ee" },
  { name: "TypeScript",     color: "#a78bfa" },
  { name: "UiPath",         color: "#f97316" },
  { name: "Power BI",       color: "#fbbf24" },
  { name: "Flask",          color: "#34d399" },
  { name: "Azure DevOps",   color: "#60a5fa" },
  { name: "SQL",            color: "#f43f5e" },
  { name: "Git",            color: "#f97316" },
  { name: "Three.js",       color: "#22d3ee" },
  { name: "AI / LLMs",      color: "#a78bfa" },
];

const certifications = [
  { name: "UiPath Advanced RPA Developer (UiARD)", icon: "🤖" },
  { name: "Microsoft Power BI Data Analyst",       icon: "📊" },
];

export default function Resume() {
  return (
    <PlanetPageLayout
      title="RESUME PLANET"
      subtitle="Software Engineer · Automation Expert · AI Builder"
      accentColor="#fbbf24"
    >
      {/* ── HERO ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(249,115,22,0.06) 100%)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "20px",
          padding: "36px 40px",
          marginBottom: "36px",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          flexWrap: "wrap",
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fbbf24, #f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.8rem",
            flexShrink: 0,
            boxShadow: "0 0 30px rgba(251,191,36,0.4)",
          }}
        >
          👨‍💻
        </div>

        <div>
          <h2
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 900,
              color: "#fbbf24",
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}
          >
            Mayank Acharya
          </h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "1rem", marginBottom: "4px" }}>
            Senior Software Engineer · Bank of America Continuum India
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.875rem" }}>
            🚀 6+ years · Automation Expert · AI Enthusiast · Physics Lover
          </p>
        </div>
      </motion.div>

      {/* ── ACHIEVEMENTS ──────────────────────────────── */}
      <SectionTitle color="#fbbf24">✦ Key Achievements</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {achievements.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            style={{
              background: `${item.color}0d`,
              border: `1px solid ${item.color}30`,
              borderRadius: "14px",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{item.icon}</div>
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "1.8rem",
                fontWeight: 900,
                color: item.color,
                marginBottom: "4px",
              }}
            >
              {item.value}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.8rem" }}>
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── ABOUT ─────────────────────────────────────── */}
      <SectionTitle color="#fbbf24">✦ About Me</SectionTitle>
      <div
        style={{
          background: "rgba(251,191,36,0.04)",
          border: "1px solid rgba(251,191,36,0.12)",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "36px",
          fontFamily: "'Space Grotesk', sans-serif",
          color: "#94a3b8",
          lineHeight: 1.8,
          fontSize: "0.95rem",
        }}
      >
        <p style={{ marginBottom: "14px" }}>
          I am a Senior Software Engineer at Bank of America Continuum India with over 6 years of experience spanning
          full-stack development, enterprise automation, analytics, DevOps, and team leadership.
        </p>
        <p style={{ marginBottom: "14px" }}>
          My career trajectory has taken me from building .NET and C# enterprise systems to developing React and Python
          web applications, Power BI business intelligence solutions, UiPath RPA automation bots, and CI/CD DevOps pipelines.
          Today I lead a cross-functional team of 6 engineers across development, automation, analytics and DevOps streams.
        </p>
        <p>
          Beyond work, I'm passionate about Artificial Intelligence, Physics, and building AcharyaVerse — an interactive
          3D portfolio universe that represents my journey from software engineer to AI builder and physics explorer.
        </p>
      </div>

      {/* ── EXPERIENCE SNAPSHOT ───────────────────────── */}
      <SectionTitle color="#fbbf24">✦ Experience</SectionTitle>
      <div
        style={{
          background: "rgba(251,191,36,0.04)",
          border: "1px solid rgba(251,191,36,0.12)",
          borderRadius: "14px",
          padding: "24px 28px",
          marginBottom: "36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "1rem",
              color: "#fbbf24",
              letterSpacing: "0.05em",
              marginBottom: "6px",
            }}
          >
            Bank of America Continuum India
          </h3>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.9rem" }}>
            Senior Software Engineer · 2020 – Present
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.82rem", marginTop: "4px" }}>
            Development · Automation · DevOps · Analytics · Release Management · Team Leadership
          </p>
        </div>
        <div
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.25)",
            borderRadius: "8px",
            padding: "8px 16px",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.8rem",
            color: "#fbbf24",
            whiteSpace: "nowrap",
          }}
        >
          6+ Years
        </div>
      </div>

      {/* ── SKILLS ────────────────────────────────────── */}
      <SectionTitle color="#fbbf24">✦ Core Skills</SectionTitle>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "36px",
        }}
      >
        {skills.map((skill) => (
          <span
            key={skill.name}
            style={{
              padding: "6px 16px",
              borderRadius: "50px",
              background: `${skill.color}12`,
              border: `1px solid ${skill.color}35`,
              color: skill.color,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.03em",
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>

      {/* ── CERTIFICATIONS ────────────────────────────── */}
      <SectionTitle color="#fbbf24">✦ Certifications</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
        {certifications.map((cert) => (
          <div
            key={cert.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(251,191,36,0.05)",
              border: "1px solid rgba(251,191,36,0.15)",
              borderRadius: "12px",
              padding: "16px 20px",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{cert.icon}</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.9rem" }}>
              {cert.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", paddingBottom: "60px" }}>
        <a
          href="https://www.linkedin.com/in/mayank-acharya/"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #1d4ed8, #4f46e5)",
            color: "white",
            borderRadius: "10px",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(79,70,229,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          📎 View LinkedIn
        </a>
        <a
          href="https://github.com/Automation-with-Acharya"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "14px 32px",
            background: "rgba(255,255,255,0.05)",
            color: "#94a3b8",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          🐙 GitHub
        </a>
      </div>
    </PlanetPageLayout>
  );
}

function SectionTitle({ children, color = "#60a5fa" }: { children: React.ReactNode; color?: string }) {
  return (
    <h2
      style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: "0.9rem",
        fontWeight: 700,
        color,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {children}
    </h2>
  );
}
