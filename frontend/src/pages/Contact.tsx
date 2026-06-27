import { useState } from "react";
import { motion } from "framer-motion";
import PlanetPageLayout from "../components/PlanetPageLayout";

type ContactCard = {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  color: string;
  description: string;
};

const contacts: ContactCard[] = [
  {
    id: "linkedin",
    icon: "🔗",
    label: "LinkedIn",
    value: "linkedin.com/in/mayank-acharya",
    href: "https://www.linkedin.com/in/mayank-acharya/",
    color: "#60a5fa",
    description: "Professional profile, career history and recommendations",
  },
  {
    id: "github",
    icon: "🐙",
    label: "GitHub",
    value: "github.com/Automation-with-Acharya",
    href: "https://github.com/Automation-with-Acharya",
    color: "#a78bfa",
    description: "Open source projects, automation scripts and AcharyaVerse",
  },
  {
    id: "email",
    icon: "📡",
    label: "Email",
    value: "mayank.acharya.official@gmail.com",
    href: "mailto:mayank.acharya.official@gmail.com",
    color: "#34d399",
    description: "For collaborations, opportunities and project discussions",
  },
];

type FormState = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compose mailto link as a functional fallback
    const subject = encodeURIComponent(`AcharyaVerse — Message from ${form.name}`);
    const body    = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.open(`mailto:mayank.acharya.official@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <PlanetPageLayout
      title="CONTACT PLANET"
      subtitle="Send a signal across the universe"
      accentColor="#22d3ee"
    >
      {/* Contact cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
          marginBottom: "52px",
        }}
      >
        {contacts.map((card, i) => (
          <motion.a
            key={card.id}
            href={card.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${card.color}25` }}
            style={{
              display: "block",
              background: `${card.color}07`,
              border: `1px solid ${card.color}25`,
              borderRadius: "18px",
              padding: "28px 24px",
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: `${card.color}18`,
                  border: `1px solid ${card.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: card.color,
                    letterSpacing: "0.08em",
                    marginBottom: "2px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "#cbd5e1",
                    fontSize: "0.92rem",
                  }}
                >
                  {card.value}
                </p>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#94a3b8",
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
              {card.description}
            </p>
            <div
              style={{
                marginTop: "16px",
                color: card.color,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Open ↗
            </div>
          </motion.a>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)",
          marginBottom: "44px",
        }}
      />

      {/* Send a message form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#22d3ee",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          ✦ Send A Signal
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(34,211,238,0.04)",
            border: "1px solid rgba(34,211,238,0.15)",
            borderRadius: "18px",
            padding: "32px",
            maxWidth: "600px",
          }}
        >
          {[
            { id: "name",    label: "Your Name",    type: "text",  placeholder: "Enter your name..." },
            { id: "email",   label: "Your Email",   type: "email", placeholder: "your@email.com" },
          ].map((field) => (
            <div key={field.id} style={{ marginBottom: "20px" }}>
              <label
                htmlFor={field.id}
                style={{
                  display: "block",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={form[field.id as keyof FormState]}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(2,8,20,0.8)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  borderRadius: "10px",
                  color: "white",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.02rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.9rem",
                color: "#94a3b8",
                letterSpacing: "0.05em",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Tell me about your project, opportunity, or just say hello..."
              required
              rows={5}
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "rgba(2,8,20,0.8)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: "10px",
                color: "white",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.02rem",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.6,
              }}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(34,211,238,0.35)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "14px 36px",
              background: sent
                ? "linear-gradient(135deg, #34d399, #059669)"
                : "linear-gradient(135deg, #0e7490, #22d3ee)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.95rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
          >
            {sent ? "✓ Signal Sent!" : "📡 Send Signal"}
          </motion.button>
        </form>
      </motion.div>

      <div style={{ height: "60px" }} />
    </PlanetPageLayout>
  );
}
