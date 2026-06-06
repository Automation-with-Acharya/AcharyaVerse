type Props = {
  selectedPlanet: string | null;
};

export default function PlanetInfo({
  selectedPlanet,
}: Props) {
  if (!selectedPlanet)
    return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: "320px",
        background:
          "rgba(0,0,0,0.8)",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2>{selectedPlanet}</h2>

      <p>
        Welcome to the{" "}
        {selectedPlanet} Planet.
      </p>

      <button
        style={{
          marginTop: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Open Planet
      </button>
    </div>
  );
}