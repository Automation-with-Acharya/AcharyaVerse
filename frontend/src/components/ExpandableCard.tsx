import { useState } from "react";

type ExpandableCardProps = {
  title: string;
  subtitle?: string;
  details: React.ReactNode;
};

export default function ExpandableCard({
  title,
  subtitle,
  details,
}: ExpandableCardProps) {
  const [expanded, setExpanded] = useState(false);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginBottom: "25px",
        padding: "20px",
        background: "#111827",
        borderRadius: "12px",
        border: "1px solid #2563eb",
        boxShadow: expanded
          ? "0 0 25px #60a5fa"
          : "0 0 10px rgba(37,99,235,0.5)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}
    >
      <h3
        style={{
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>
      {subtitle && <p>{subtitle}</p>}
      {expanded && (
        <div
          style={{
            marginTop: "15px",
            borderTop: "1px solid #374151",
            paddingTop: "15px",
          }}
        >
          {details}
        </div>
      )}
    </div>
  );
}
