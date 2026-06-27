import PlanetPageLayout from "../components/PlanetPageLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TimelineEvent = {
  year: string;
  title: string;
  subtitle: string;
  color: string;
  tags: string[];
  details: string;
  highlight?: string;
};

const timeline: TimelineEvent[] = [
  {
    year: "2020",
    title: "Joined Bank of America",
    subtitle: "The journey begins",
    color: "#60a5fa",
    tags: ["Software Development", "Enterprise Systems", "Banking Domain"],
    details:
      "Started my professional journey at Bank of America Continuum India. Onboarded into the enterprise software ecosystem, learned the banking domain, and began contributing to critical internal systems from day one.",
  },
  {
    year: "2021",
    title: ".NET & C# Development",
    subtitle: "Enterprise engineering",
    color: "#22d3ee",
    tags: [".NET Framework", "C#", "Windows Applications", "Enterprise Dev"],
    details:
      "Worked across multiple .NET and C# projects, building and maintaining enterprise-grade Windows applications. Developed a strong foundation in object-oriented design, system integration, and enterprise software practices.",
  },
  {
    year: "2022",
    title: "Full Stack Expansion",
    subtitle: "React, Flask & Python",
    color: "#34d399",
    tags: ["React", "Flask", "Python", "REST APIs", "JavaScript"],
    details:
      "Expanded into modern web development by building React frontends and Python Flask REST API backends. Delivered internal web applications that modernized legacy workflows and improved operational efficiency.",
  },
  {
    year: "2023",
    title: "Power BI & Analytics",
    subtitle: "Business intelligence",
    color: "#fbbf24",
    tags: ["Power BI", "DAX", "Data Modeling", "Reporting", "ETL"],
    details:
      "Built Power BI dashboards and automated reporting solutions for senior leadership. Reduced manual reporting effort significantly by creating self-service analytics platforms with real-time data refresh.",
    highlight: "Reduced audit preparation time by 90%",
  },
  {
    year: "2024",
    title: "UiPath RPA Automation",
    subtitle: "Enterprise automation at scale",
    color: "#f97316",
    tags: ["UiPath", "OCR", "PDF Processing", "Email Automation", "RPA"],
    details:
      "Designed and deployed production-grade UiPath bots for enterprise processes including OCR-based PDF data extraction, email automation, and multi-system workflow orchestration.",
    highlight: "Saved 10,000+ hours annually",
  },
  {
    year: "2025",
    title: "DevOps & Release Management",
    subtitle: "Full ownership of delivery",
    color: "#a78bfa",
    tags: ["Azure DevOps", "CI/CD", "Release Management", "Git", "Full Stack"],
    details:
      "Took on expanded responsibilities including Release Management, DevOps pipeline management, and production support coordination. Simultaneously continued full-stack development and automation delivery across multiple parallel streams.",
  },
  {
    year: "2026",
    title: "Team Lead — 6 Engineers",
    subtitle: "Cross-functional leadership",
    color: "#f43f5e",
    tags: ["Leadership", "DevOps", "Development", "Power BI", "RPA"],
    details:
      "Leading a cross-functional team of 6 engineers across development, DevOps, analytics and automation. Managing delivery roadmaps, sprint planning, stakeholder communication, and technical architecture decisions.",
    highlight: "Managing 4 technology streams simultaneously",
  },
  {
    year: "Future",
    title: "AI · Physics · AcharyaVerse",
    subtitle: "The next frontier",
    color: "#6d28d9",
    tags: ["AI Agents", "Local LLMs", "Ollama", "Physics", "AcharyaVerse"],
    details:
      "The vision ahead: building AI-powered systems with local LLMs and agent frameworks, exploring the intersection of physics and computing, and evolving AcharyaVerse into a complete interactive universe of knowledge.",
  },
];

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <PlanetPageLayout
      title="EXPERIENCE PLANET"
      subtitle="A journey through 6+ years at Bank of America"
      accentColor="#f97316"
    >
      {/* Impact banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(251,191,36,0.06) 100%)",
          border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: "16px",
          padding: "24px 28px",
          marginBottom: "44px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          textAlign: "center",
        }}
      >
        {[
          { v: "10,000+", l: "Hours Saved/Year", c: "#fbbf24" },
          { v: "90%",     l: "Audit Time Reduction", c: "#34d399" },
          { v: "15+",     l: "Automation Bots", c: "#60a5fa" },
          { v: "6",       l: "Engineers Led", c: "#a78bfa" },
        ].map((stat) => (
          <div key={stat.l}>
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "2.2rem",
                fontWeight: 900,
                color: stat.c,
                marginBottom: "4px",
                textShadow: `0 0 20px ${stat.c}30`,
              }}
            >
              {stat.v}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.92rem" }}>
              {stat.l}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical connector line */}
        <div
          style={{
            position: "absolute",
            left: "44px",
            top: "50px",
            bottom: "50px",
            width: "2px",
            background: "linear-gradient(180deg, #60a5fa20, #f97316, #f43f5e, #6d28d980)",
            opacity: 0.6,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {timeline.map((event, i) => {
            const isOpen = expanded === event.year;
            return (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "90px 1fr",
                  gap: "20px",
                  alignItems: "flex-start",
                }}
              >
                {/* Year node */}
                <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                  <motion.div
                    animate={{
                      boxShadow: isOpen
                        ? [`0 0 20px ${event.color}60`, `0 0 40px ${event.color}80`, `0 0 20px ${event.color}60`]
                        : `0 0 12px ${event.color}30`,
                    }}
                    transition={{ duration: 2, repeat: isOpen ? Infinity : 0, ease: "easeInOut" }}
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "50%",
                      background: isOpen ? `${event.color}22` : `${event.color}10`,
                      border: `2px solid ${isOpen ? event.color + "80" : event.color + "40"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => setExpanded(isOpen ? null : event.year)}
                  >
                    <span
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: event.year === "Future" ? "0.55rem" : "0.65rem",
                        fontWeight: 800,
                        color: event.color,
                        letterSpacing: "0.04em",
                        textAlign: "center",
                      }}
                    >
                      {event.year}
                    </span>
                  </motion.div>
                </div>

                {/* Card */}
                <div
                  onClick={() => setExpanded(isOpen ? null : event.year)}
                  style={{
                    background: isOpen ? `${event.color}08` : "rgba(2,8,20,0.55)",
                    border: `1px solid ${isOpen ? event.color + "35" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "16px",
                    padding: "20px 26px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    marginBottom: "8px",
                    boxShadow: isOpen ? `0 4px 24px ${event.color}10` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          fontSize: "clamp(1.05rem, 2vw, 1.28rem)",
                          fontWeight: 700,
                          color: event.color,
                          letterSpacing: "0.04em",
                          marginBottom: "6px",
                        }}
                      >
                        {event.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: "#94a3b8",
                          fontSize: "0.98rem",
                          marginBottom: "12px",
                        }}
                      >
                        {event.subtitle}
                      </p>

                      {/* Tech tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: "4px 12px",
                              borderRadius: "50px",
                              background: `${event.color}10`,
                              border: `1px solid ${event.color}22`,
                              color: event.color,
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: "0.85rem",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{ color: "#475569", marginLeft: "16px", fontSize: "1rem" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expandable details */}
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
                            marginTop: "18px",
                            paddingTop: "18px",
                            borderTop: `1px solid ${event.color}20`,
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: "#e2e8f0",
                              fontSize: "1.08rem",
                              lineHeight: 1.8,
                              marginBottom: event.highlight ? "18px" : 0,
                            }}
                          >
                            {event.details}
                          </p>
                          {event.highlight && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "12px 20px",
                                background: `${event.color}12`,
                                border: `1px solid ${event.color}30`,
                                borderLeft: `4px solid ${event.color}`,
                                borderRadius: "0 10px 10px 0",
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: event.color,
                                fontSize: "1rem",
                                fontWeight: 600,
                              }}
                            >
                              ✦ {event.highlight}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div style={{ height: "60px" }} />
    </PlanetPageLayout>
  );
}
