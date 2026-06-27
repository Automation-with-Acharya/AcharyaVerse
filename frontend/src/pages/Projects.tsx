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
  highlights: string[];
  description: string;
  status: "Live" | "Active Dev" | "Production" | "Planned";
  githubUrl?: string;
  liveUrl?: string;
  year: string;
};

const projects: Project[] = [
  {
    id: "acharyaverse",
    title: "AcharyaVerse",
    subtitle: "Interactive 3D portfolio universe",
    emoji: "🌌",
    color: "#60a5fa",
    category: "Web",
    year: "2025–Now",
    stack: ["React", "Three.js", "TypeScript", "Framer Motion", "R3F", "Vite"],
    impact: "Portfolio reimagined as an explorable 3D universe",
    highlights: [
      "7 interactive planets + black hole, each representing a career domain",
      "Real-time physics simulations: pendulum (RK4), N-body chaos, wave interference",
      "Spacetime curvature grid with gravity wells driven by mass sliders",
      "AI Mayank — knowledge-base digital twin chatbot",
      "Cinematic camera transitions with Framer Motion + R3F",
    ],
    description:
      "A cinematic, interactive 3D portfolio built with React Three Fiber. Users explore planets representing different aspects of my career — from experience and projects to AI and physics simulations. Every element tells a story. Built with real physics, not fake animations.",
    status: "Active Dev",
    githubUrl: "https://github.com/Automation-with-Acharya/AcharyaVerse",
    liveUrl: "https://acharyaverse.netlify.app",
  },
  {
    id: "ai-mayank",
    title: "AI Mayank",
    subtitle: "Personal AI digital twin",
    emoji: "🤖",
    color: "#a78bfa",
    category: "AI",
    year: "2025",
    stack: ["React", "TypeScript", "Knowledge Base", "Ollama (planned)", "LLM"],
    impact: "Digital twin answering career questions 24/7",
    highlights: [
      "Knowledge base seeded with full career history and project data",
      "Intelligent keyword matching with contextual multi-paragraph responses",
      "Suggested questions drive discovery of key achievements",
      "Planned: Ollama local LLM integration for fully autonomous conversation",
      "Streaming response with typewriter animation",
    ],
    description:
      "An AI-powered chatbot trained on my personal knowledge base. Currently uses intelligent keyword matching with rich responses. Future: integrate local LLMs via Ollama for fully autonomous, conversational AI interactions.",
    status: "Active Dev",
    githubUrl: "https://github.com/Automation-with-Acharya/AcharyaVerse",
  },
  {
    id: "uipath-automations",
    title: "UiPath Automation Suite",
    subtitle: "Enterprise RPA at Bank of America",
    emoji: "⚡",
    color: "#f97316",
    category: "Automation",
    year: "2021–Present",
    stack: ["UiPath Studio", "OCR", "VB.NET", "PDF Processing", "Email Automation", "Orchestrator"],
    impact: "10,000+ hours saved annually across teams",
    highlights: [
      "15+ production bots processing thousands of documents daily",
      "OCR-based PDF data extraction replacing 100% manual entry",
      "Automated email workflows across 8 business functions",
      "Multi-system data reconciliation reducing errors by 95%",
      "Regulatory compliance reporting with zero manual intervention",
    ],
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
    year: "2022–Present",
    stack: ["Power BI", "DAX", "SQL Server", "Data Modeling", "ETL", "Power Query"],
    impact: "90% reduction in audit preparation time",
    highlights: [
      "Suite of dashboards serving senior leadership across departments",
      "Automated refresh pipelines eliminated daily Excel-based reporting",
      "Compliance tracking dashboards reduced audit prep from weeks to hours",
      "Real-time operational KPIs replacing static weekly reports",
      "Data model handling 2M+ rows with sub-second query response",
    ],
    description:
      "Built a suite of Power BI dashboards for senior leadership covering operational metrics, compliance tracking, and team performance. Automated data refresh pipelines eliminated manual Excel-based reporting across multiple departments.",
    status: "Production",
  },
  {
    id: "physics-lab",
    title: "Physics Lab",
    subtitle: "Interactive real physics simulations",
    emoji: "⚛️",
    color: "#f43f5e",
    category: "Web",
    year: "2025",
    stack: ["Three.js", "React Three Fiber", "TypeScript", "RK4 Integration", "WebGL"],
    impact: "Teaching physics visually through real equations",
    highlights: [
      "Solar System with Newtonian orbital mechanics + spacetime curvature grid",
      "Double pendulum chaos simulation with RK4 4th-order integration",
      "N-body gravitational problem — deterministic chaos visualization",
      "Wave interference: two-source superposition with beat frequency readout",
      "Black hole: accretion disk, relativistic jets, event horizon physics",
    ],
    description:
      "An interactive physics simulation environment built entirely in Three.js and React Three Fiber. Every simulation uses real physics equations — not approximations or visual tricks.",
    status: "Active Dev",
    githubUrl: "https://github.com/Automation-with-Acharya/AcharyaVerse",
    liveUrl: "https://acharyaverse.netlify.app",
  },
  {
    id: "internal-apps",
    title: "Enterprise Internal Applications",
    subtitle: "Full-stack React + Flask web apps",
    emoji: "🏢",
    color: "#34d399",
    category: "Web",
    year: "2022–Present",
    stack: ["React", "Flask", "Python", "REST APIs", "SQL", "Azure"],
    impact: "Modernized legacy workflows for 500+ users",
    highlights: [
      "Full-stack internal applications replacing decade-old legacy tools",
      "React frontends with Flask REST API backends and SQL databases",
      "Workflow management tools used daily by cross-functional teams",
      "Zero-downtime deployments through Azure DevOps pipelines",
      "Role-based access control and audit logging for compliance",
    ],
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
    year: "2023–Present",
    stack: ["Azure DevOps", "CI/CD", "Git", "YAML Pipelines", "Release Management"],
    impact: "Zero-downtime release cadence established",
    highlights: [
      "End-to-end CI/CD pipelines for multiple simultaneous products",
      "Release gates and deployment approval workflows",
      "Environment promotion: dev → UAT → production with quality gates",
      "Reduced deployment failures through automated testing integration",
      "On-call production support and incident management coordination",
    ],
    description:
      "Managed Azure DevOps pipelines, release gates, deployment approvals and environment promotion workflows. Established consistent CI/CD practices across development teams.",
    status: "Production",
  },
];

const categories = ["All", "Web", "Automation", "Analytics", "AI", "DevOps"] as const;
type CategoryFilter = (typeof categories)[number];

const statusColors: Record<string, string> = {
  "Live":       "#34d399",
  "Active Dev": "#60a5fa",
  "Production": "#fbbf24",
  "Planned":    "#64748b",
};

const categoryStats = {
  total: projects.length,
  production: projects.filter((p) => p.status === "Production").length,
  activeDev: projects.filter((p) => p.status === "Active Dev").length,
  hoursImpact: "10,000+",
};

export default function Projects() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <PlanetPageLayout
      title="PROJECTS GALAXY"
      subtitle="Real-world builds — from enterprise automation to interactive universes"
      accentColor="#60a5fa"
    >
      {/* ── TOP STATS ROW ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        {[
          { value: categoryStats.total.toString(),       label: "Total Projects",      color: "#60a5fa" },
          { value: categoryStats.production.toString(),  label: "In Production",       color: "#fbbf24" },
          { value: categoryStats.activeDev.toString(),   label: "Active Development",  color: "#34d399" },
          { value: categoryStats.hoursImpact,            label: "Hours Saved / Year",  color: "#f97316" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            style={{
              background: `${stat.color}0a`,
              border: `1px solid ${stat.color}22`,
              borderRadius: "16px",
              padding: "22px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "2.4rem",
                fontWeight: 900,
                color: stat.color,
                marginBottom: "4px",
                textShadow: `0 0 20px ${stat.color}40`,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.92rem" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CATEGORY FILTERS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}
      >
        {categories.map((cat) => {
          const isActive = filter === cat;
          const count = cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "10px 24px",
                borderRadius: "50px",
                border: `1px solid ${isActive ? "#60a5fa" : "rgba(255,255,255,0.1)"}`,
                background: isActive ? "rgba(96,165,250,0.15)" : "transparent",
                color: isActive ? "#60a5fa" : "#94a3b8",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.92rem",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.04em",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {cat}
              <span
                style={{
                  background: isActive ? "#60a5fa20" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isActive ? "#60a5fa40" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "50px",
                  padding: "2px 9px",
                  fontSize: "0.78rem",
                  color: isActive ? "#60a5fa" : "#64748b",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ── PROJECT GRID ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
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
                transition={{ delay: i * 0.05, duration: 0.35 }}
                style={{
                  background: isOpen ? `${project.color}0a` : "rgba(2,8,20,0.7)",
                  border: `1px solid ${isOpen ? project.color + "35" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: isOpen ? `0 8px 40px ${project.color}10` : "none",
                  transition: "border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                {/* Accent top bar */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${project.color}, ${project.color}40, transparent)` }} />

                <div
                  style={{ padding: "22px 22px 18px", cursor: "pointer" }}
                  onClick={() => setExpanded(isOpen ? null : project.id)}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "46px", height: "46px", borderRadius: "12px",
                          background: `${project.color}15`,
                          border: `1px solid ${project.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.5rem", flexShrink: 0,
                        }}
                      >
                        {project.emoji}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: "'Orbitron', monospace", fontSize: "1.08rem",
                            fontWeight: 700, color: project.color, letterSpacing: "0.04em", marginBottom: "2px",
                          }}
                        >
                          {project.title}
                        </h3>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.88rem" }}>
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <span
                        style={{
                          padding: "4px 12px", borderRadius: "50px",
                          background: `${statusColors[project.status]}15`,
                          border: `1px solid ${statusColors[project.status]}30`,
                          color: statusColors[project.status],
                          fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", fontWeight: 600,
                        }}
                      >
                        {project.status}
                      </span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#475569", fontSize: "0.76rem" }}>
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Impact metric */}
                  <div
                    style={{
                      padding: "10px 15px", background: `${project.color}0c`,
                      border: `1px solid ${project.color}18`, borderRadius: "8px",
                      marginBottom: "12px", fontFamily: "'Space Grotesk', sans-serif",
                      color: project.color, fontSize: "0.92rem", fontWeight: 500,
                    }}
                  >
                    ✦ {project.impact}
                  </div>

                  {/* Tech stack pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: "4px 11px", borderRadius: "50px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#94a3b8", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <div
                    style={{
                      color: "#475569", fontSize: "0.82rem", textAlign: "right",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {isOpen ? "▲ collapse" : "▼ explore"}
                  </div>
                </div>

                {/* ── EXPANDED SECTION ── */}
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
                          padding: "0 22px 22px",
                          borderTop: `1px solid ${project.color}18`,
                          marginTop: 0,
                          paddingTop: "18px",
                        }}
                      >
                        {/* Description */}
                        <p
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "#e2e8f0", fontSize: "1.02rem", lineHeight: 1.75,
                            marginBottom: "18px",
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Highlights */}
                        <div style={{ marginBottom: "20px" }}>
                          <div
                            style={{
                              fontFamily: "'Orbitron', monospace", fontSize: "0.75rem",
                              color: project.color, letterSpacing: "0.18em",
                              textTransform: "uppercase", marginBottom: "10px",
                            }}
                          >
                            Key Highlights
                          </div>
                          {project.highlights.map((h, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex", alignItems: "flex-start", gap: "10px",
                                marginBottom: "7px",
                              }}
                            >
                              <span style={{ color: project.color, fontSize: "0.65rem", marginTop: "5px", flexShrink: 0 }}>✦</span>
                              <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.5 }}>
                                {h}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        {(project.githubUrl || project.liveUrl) && (
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {project.githubUrl && (
                              <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.04, boxShadow: `0 0 18px ${project.color}30` }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: "7px",
                                  padding: "10px 20px", borderRadius: "50px",
                                  border: `1px solid ${project.color}40`,
                                  background: `${project.color}10`,
                                  color: project.color,
                                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 600,
                                  textDecoration: "none", cursor: "pointer",
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                GitHub
                              </motion.a>
                            )}
                            {project.liveUrl && (
                              <motion.a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: "7px",
                                  padding: "10px 20px", borderRadius: "50px",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  background: "rgba(255,255,255,0.05)",
                                  color: "#94a3b8",
                                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 500,
                                  textDecoration: "none",
                                }}
                              >
                                ↗ View Live
                              </motion.a>
                            )}
                          </div>
                        )}
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
