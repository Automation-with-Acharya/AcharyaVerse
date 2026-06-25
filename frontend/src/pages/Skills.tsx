import PlanetPageLayout from "../components/PlanetPageLayout";
import SkillGalaxy from "../components/SkillGalaxy";
import { motion } from "framer-motion";

const skillGroups = [
  {
    label: "Programming",
    color: "#60a5fa",
    icon: "💻",
    skills: ["C#", "Python", "TypeScript", "JavaScript", "SQL", "VB.NET"],
  },
  {
    label: "Frontend",
    color: "#22d3ee",
    icon: "🎨",
    skills: ["React", "Three.js", "HTML/CSS", "Framer Motion", "Vite"],
  },
  {
    label: "Automation",
    color: "#f97316",
    icon: "🤖",
    skills: ["UiPath", "Power Automate", "OCR", "RPA Design"],
  },
  {
    label: "Analytics",
    color: "#fbbf24",
    icon: "📊",
    skills: ["Power BI", "DAX", "Data Modeling", "Excel"],
  },
  {
    label: "DevOps",
    color: "#a78bfa",
    icon: "⚙️",
    skills: ["Azure DevOps", "Git", "CI/CD", "Release Management"],
  },
  {
    label: "AI & Future",
    color: "#34d399",
    icon: "🧠",
    skills: ["LLMs", "Ollama", "AI Agents", "Prompt Engineering"],
  },
];

export default function Skills() {
  return (
    <PlanetPageLayout
      title="SKILLS GALAXY"
      subtitle="An interactive constellation of technologies — drag to explore"
      accentColor="#34d399"
    >
      {/* 3D Galaxy canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "rgba(0,0,5,0.6)",
          border: "1px solid rgba(52,211,153,0.15)",
          borderRadius: "20px",
          overflow: "hidden",
          marginBottom: "48px",
          boxShadow: "0 0 40px rgba(52,211,153,0.08)",
        }}
      >
        <SkillGalaxy />

        {/* Galaxy hint */}
        <div
          style={{
            textAlign: "center",
            padding: "12px 20px 16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.75rem",
            color: "#475569",
            letterSpacing: "0.05em",
          }}
        >
          🖱️ Drag to orbit · Scroll to zoom · Nodes sized by proficiency
        </div>
      </motion.div>

      {/* Flat skill category cards */}
      <h2
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "#34d399",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        ✦ Skill Clusters
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
          paddingBottom: "60px",
        }}
      >
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{
              background: `${group.color}07`,
              border: `1px solid ${group.color}22`,
              borderRadius: "16px",
              padding: "22px 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "1.4rem" }}>{group.icon}</span>
              <h3
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: group.color,
                  letterSpacing: "0.06em",
                }}
              >
                {group.label}
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "50px",
                    background: `${group.color}12`,
                    border: `1px solid ${group.color}28`,
                    color: group.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.76rem",
                    fontWeight: 500,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PlanetPageLayout>
  );
}
