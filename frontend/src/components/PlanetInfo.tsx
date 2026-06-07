import { planetContent } from "../data/planetContent";
import { useNavigate } from "react-router-dom";

type Props = {
  selectedPlanet: string | null;
};

export default function PlanetInfo({ selectedPlanet }: Props) {
  const navigate = useNavigate();

  const openPlanet = () => {
    switch (selectedPlanet) {
      case "Projects":
        navigate("/projects");
        break;

      case "Skills":
        navigate("/skills");
        break;

      case "Experience":
        navigate("/experience");
        break;

      case "AI Mayank":
        navigate("/ai-mayank");
        break;

      case "Physics Lab":
        navigate("/physics-lab");
        break;

      case "Resume":
        navigate("/resume");
        break;
    }
  };

  if (!selectedPlanet) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: "400px",
        boxShadow: "0 0 20px rgba(255,255,255,0.15)",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2>{selectedPlanet}</h2>

      <p>
        {
          planetContent[selectedPlanet as keyof typeof planetContent]
            ?.description
        }
      </p>

      <button
        onClick={openPlanet}
        style={{
          marginTop: "15px",
          padding: "12px 18px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Open Planet
      </button>
      <button
        style={{
          marginTop: "10px",
          marginLeft: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}
