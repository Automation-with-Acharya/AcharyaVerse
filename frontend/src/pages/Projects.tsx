import PlanetPageLayout from "../components/PlanetPageLayout";
import ExpandableCard from "../components/ExpandableCard";

export default function Projects() {
  return (
    <PlanetPageLayout title="Projects Planet">
      <h2>Featured Projects</h2>

      <div
        style={{
          display: "grid",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <ExpandableCard
          title="AcharyaVerse"
          subtitle="Interactive 3D portfolio universe built using React and Three.js."
          details={
            <>
              <p>
                <strong>Tech Stack:</strong>
              </p>

              <p>React, TypeScript, Three.js, React Three Fiber</p>

              <br />

              <p>Features implemented:</p>

              <ul>
                <li>3D Universe Homepage</li>
                <li>Interactive Planet Navigation</li>
                <li>AI Mayank Chat</li>
                <li>Physics Lab Simulations</li>
                <li>Career Timeline</li>
              </ul>

              <br />

              <p>Current Status: Active Development</p>
            </>
          }
        />

        <ExpandableCard
          title="AI Mayank"
          subtitle="Personal AI assistant trained on career, skills and interests."
          details={
            <>
              <p>
                <strong>Tech Stack:</strong>
              </p>

              <p>React, TypeScript, OpenAI API (future)</p>

              <br />

              <p>Features:</p>

              <ul>
                <li>Interactive Chat UI</li>
                <li>Personal Knowledge Base</li>
                <li>Career Guidance</li>
                <li>Physics Discussions</li>
              </ul>

              <br />

              <p>Future Goal: Fully AI-powered personal assistant.</p>
            </>
          }
        />

        <ExpandableCard
          title="Physics Lab"
          subtitle="Interactive physics simulations and visual experiments."
          details={
            <>
              <p>
                <strong>Tech Stack:</strong>
              </p>

              <p>Three.js, React Three Fiber, TypeScript</p>

              <br />

              <p>Simulations:</p>

              <ul>
                <li>Orbital Mechanics</li>
                <li>Projectile Motion (planned)</li>
                <li>Pendulum (planned)</li>
                <li>Gravity Simulation (planned)</li>
              </ul>

              <br />

              <p>Goal: Teach physics visually.</p>
            </>
          }
        />
        <ExpandableCard
          title="Power BI Dashboards"
          subtitle="Reporting and analytics dashboards built for enterprise environments."
          details={
            <>
              <p>
                <strong>Skills Used:</strong>
              </p>

              <ul>
                <li>Power BI</li>
                <li>DAX</li>
                <li>Data Modeling</li>
                <li>ETL Concepts</li>
              </ul>

              <br />

              <p>
                Delivered interactive dashboards, reporting automation and
                business insights.
              </p>
            </>
          }
        />

        <ExpandableCard
          title="UiPath Automations"
          subtitle="Enterprise automation solutions using RPA."
          details={
            <>
              <p>
                <strong>Automation Areas:</strong>
              </p>

              <ul>
                <li>OCR Processing</li>
                <li>PDF Extraction</li>
                <li>Email Automation</li>
                <li>Workflow Automation</li>
              </ul>

              <br />

              <p>Built production-grade bots for enterprise environments.</p>
            </>
          }
        />
      </div>
    </PlanetPageLayout>
  );
}
