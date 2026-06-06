import SpaceScene from "./components/SpaceScene";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "black",
      }}
    >
      <SpaceScene />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "15px",
          }}
        >
          ACHARYAVERSE
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
          }}
        >
          Exploring Software, AI and Physics
        </p>
      </div>
    </div>
  );
}

export default App;