import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanetPageLayout from "../components/PlanetPageLayout";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  category: "Web" | "Automation" | "Analytics" | "AI" | "DevOps";
  stack: string[];
  impact: string;
  description: string;
  status: "Live" | "Active Dev" | "Production" | "Planned";
};

const projects: Project[] = [
  {
    id: "acharyaverse",
    title: "AcharyaVerse",
    subtitle: "Interactive 3D portfolio universe",
    emoji: "🌌",
    color: "#60a5fa",
    category: "Web",
    stack: ["React", "Three.js", "TypeScript", "Framer Motion", "R3F"],
    impact: "Portfolio reimagined as an explorable universe",
    description:
      "A cinematic, interactive 3D portfolio built with React Three Fiber. Users explore planets representing different aspects of my career — from experience and projects to AI and physics simulations. Every element tells a story.",
    status: "Active Dev",
  },
  {
    id: "ai-mayank",
    title: "AI Mayank",
    subtitle: "Personal AI digital twin",
    emoji: "🤖",
    color: "#a78bfa",
    category: "AI",
    stack: ["React", "TypeScript", "Knowledge Base", "LLMs (future)"],
    impact: "Digital twin answering questions about my career 24/7",
    description:
      "An AI-powered chatbot trained on my personal knowledge base. Currently uses intelligent keyword matching with rich responses. Future goal: integrate local LLMs via Ollama for fully autonomous, conversational AI interactions.",
    status: "Active Dev",
  },
  {
    id: "uipath-automations",
    title: "UiPath Automation Suite",
    subtitle: "Enterprise RPA bots at Bank of America",
    emoji: "🤖",
    color: "#f97316",
    category: "Automation",
    stack: ["UiPath", "OCR", "VB.NET", "PDF Processing", "Email Automation"],
    impact: "10,000+ hours saved annually across teams",
    description:
      "Designed and deployed 15+ production-grade automation bots including OCR-based PDF data extraction, automated email workflows, multi-system data reconciliation, and regulatory compliance reporting bots.",
    status: "Production",
  },
  {
    id: "power-bi-dashboards",
    title: "Power BI Analytics Platform",
    subtitle: "Enterprise reporting & BI dashboards",
    emoji: "📊",
    color: "#fbbf24",
    category: "Analytics",
    stack: ["Power BI", "DAX", "SQL", "Data Modeling", "ETL"],
    impact: "90% reduction in audit preparation time",
    description:
      "Built a suite of Power BI dashboards for senior leadership covering operational metrics, compliance tracking, and team performance. Automated data refresh pipelines eliminated manual Excel-based reporting across multiple departments.",
    status: "Production",
  },
  {
    id: "physics-lab",
    title: "Physics Lab",
    subtitle: "Interactive physics simulations",
    emoji: "⚛️",
    color: "#f43f5e",
    category: "Web",
    stack: ["Three.js", "React Three Fiber", "TypeScript", "Physics Engine"],
    impact: "Teaching physics visually through code",
    description:
      "An interactive physics simulation environment featuring gravity simulators, orbital mechanics, and projectile motion visualizations built entirely in Three.js. Part of AcharyaVerse's Physics Planet.",
    status: "Active Dev",
  },
  {
    id: "internal-apps",
    title: "Enterprise Internal Applications",
    subtitle: "React + Flask web apps",
    emoji: "🏢",
    color: "#34d399",
    category: "Web",
    stack: ["React", "Flask", "Python", "REST APIs", "SQL"],
    impact: "Modernized legacy workflows for 500+ users",
    description:
      "Built full-stack internal web applications replacing legacy tools. React frontends with Flask REST API backends. Delivered user-friendly dashboards, workflow management tools, and data entry systems used daily by large teams.",
    status: "Production",
  },
  {
    id: "devops",
    title: "DevOps & CI/CD Pipelines",
    subtitle: "Release automation & deployment management",
    emoji: "⚙️",
    color: "#22d3ee",
    category: "DevOps",
    stack: ["Azure DevOps", "CI/CD", "Git", "YAML Pipelines", "Release Management"],
    impact: "Zero-downtime release cadence established",
    description:
      "Managed Azure DevOps pipelines, release gates, deployment approvals and environment promotion workflows. Established consistent CI/CD practices across development teams, reducing deployment failures and improving release reliability.",
    status: "Production",
  },
];

const categories = ["All", "Web", "Automation", "Analytics", "AI", "DevOps"] as const;
type CategoryFilter = typeof categories[number];

const statusColors: Record<string, string> = {
  "Live":       "#34d399",
  "Active Dev": "#60a5fa",
  "Production": "#fbbf24",
  "Planned":    "#64748b",
};

export default function Projects() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <PlanetPageLayout
      title="PROJECTS PLANET"
      subtitle="Real-world builds — from enterprise automation to interactive universes"
      accentColor="#60a5fa"
    >
      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}
      >
        {categories.map((cat) => {
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: "50px",
                border: `1px solid ${isActive ? "#60a5fa" : "rgba(255,255,255,0.1)"}`,
                background: isActive ? "rgba(96,165,250,0.15)" : "transparent",
                color: isActive ? "#60a5fa" : "#64748b",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.82rem",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.04em",
              }}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      {/* Project grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
          paddingBottom: "60px",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => {
            const isOpen = expanded === project.id;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => setExpanded(isOpen ? null : project.id)}
                style={{
                  background: isOpen ? `${project.color}0c` : "rgba(2,8,20,0.7)",
                  border: `1px solid ${isOpen ? project.color + "40" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "18px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "border-color 0.25s ease, background 0.25s ease",
                  boxShadow: isOpen ? `0 0 30px ${project.color}15` : "none",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: `${project.color}18`,
                        border: `1px solid ${project.color}35`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        flexShrink: 0,
                      }}
                    >
                      {project.emoji}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: project.color,
                          letterSpacing: "0.04em",
                          marginBottom: "2px",
                        }}
                      >
                        {project.title}
                      </h3>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.78rem" }}>
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "50px",
                        background: `${statusColors[project.status]}18`,
                        border: `1px solid ${statusColors[project.status]}35`,
                        color: statusColors[project.status],
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Impact metric */}
                <div
                  style={{
                    padding: "10px 14px",
                    background: `${project.color}0d`,
                    border: `1px solid ${project.color}20`,
                    borderRadius: "8px",
                    marginBottom: "14px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: project.color,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  ✦ {project.impact}
                </div>

                {/* Tech stack pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: "3px 9px",
                        borderRadius: "50px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#94a3b8",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "0.7rem",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expand arrow */}
                <div
                  style={{
                    color: "#475569",
                    fontSize: "0.75rem",
                    textAlign: "right",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {isOpen ? "▲ less" : "▼ details"}
                </div>

                {/* Expanded description */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          marginTop: "14px",
                          paddingTop: "14px",
                          borderTop: `1px solid ${project.color}20`,
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: "#94a3b8",
                          fontSize: "0.875rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {project.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </PlanetPageLayout>
  );
}
