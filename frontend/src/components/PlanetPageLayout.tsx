import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function PlanetPageLayout({ title, children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "white",
        padding: "40px",
      }}
    >
      <Link
        to="/"
        style={{
          color: "#60a5fa",
          textDecoration: "none",
        }}
      >
        ← Return To Universe
      </Link>

      <h1
        style={{
          fontSize: "3rem",
          letterSpacing: "3px",
          color: "#60a5fa",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        {title}
      </h1>

      {children}
    </div>
  );
}
