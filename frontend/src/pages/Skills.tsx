import PlanetPageLayout from "../components/PlanetPageLayout";
import ExpandableCard from "../components/ExpandableCard";

export default function Skills() {
  return (
    <PlanetPageLayout title="Skills Planet">
      <h2>Core Technologies</h2>

      <div style={{ marginTop: "30px" }}>
        <ExpandableCard
          title=".NET & C#"
          subtitle="Primary development stack"
          details={
            <>
              <p>Experience Level: Advanced</p>

              <br />

              <p>Areas:</p>

              <ul>
                <li>.NET Framework</li>
                <li>C#</li>
                <li>Windows Applications</li>
                <li>Enterprise Systems</li>
              </ul>
            </>
          }
        />

        <ExpandableCard
          title="Python"
          subtitle="Backend and automation"
          details={
            <>
              <ul>
                <li>Flask</li>
                <li>Automation</li>
                <li>REST APIs</li>
                <li>Scripting</li>
              </ul>
            </>
          }
        />

        <ExpandableCard
          title="React"
          subtitle="Frontend development"
          details={
            <>
              <ul>
                <li>React</li>
                <li>TypeScript</li>
                <li>SPA Development</li>
              </ul>
            </>
          }
        />

        <ExpandableCard
          title="Power BI"
          subtitle="Analytics and reporting"
          details={
            <>
              <ul>
                <li>DAX</li>
                <li>Dashboards</li>
                <li>Data Modeling</li>
              </ul>
            </>
          }
        />

        <ExpandableCard
          title="UiPath"
          subtitle="Robotic Process Automation"
          details={
            <>
              <ul>
                <li>OCR</li>
                <li>PDF Automation</li>
                <li>Workflow Automation</li>
              </ul>
            </>
          }
        />

        <ExpandableCard
          title="DevOps"
          subtitle="Release and deployment management"
          details={
            <>
              <ul>
                <li>Release Management</li>
                <li>Production Support</li>
                <li>Deployment Coordination</li>
              </ul>
            </>
          }
        />
      </div>
    </PlanetPageLayout>
  );
}
