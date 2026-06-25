import PlanetPageLayout from "../components/PlanetPageLayout";
import AiChat from "../components/AiChat";

export default function AiMayank() {
  return (
    <PlanetPageLayout
      title="AI MAYANK"
      subtitle="Digital twin powered by personal knowledge — ask me anything"
      accentColor="#a78bfa"
    >
      <AiChat />
    </PlanetPageLayout>
  );
}
