import PlanetPageLayout from "../components/PlanetPageLayout";
import ExpandableCard from "../components/ExpandableCard";

export default function Experience() {
  return (
    <PlanetPageLayout title="Experience Planet">
      <h2>Career Timeline</h2>

      <div
        style={{
          marginTop: "40px",
          borderLeft: "3px solid #60a5fa",
          boxShadow: "0 0 20px #60a5fa",
          paddingLeft: "30px",
        }}
      >
        <ExpandableCard
          title="2020"
          subtitle="Joined Bank of America"
          details={
            <>
              <p>Started my professional journey at Bank of America.</p>

              <br />

              <p>Focus Areas:</p>

              <ul>
                <li>Software Development</li>
                <li>Enterprise Systems</li>
                <li>Banking Domain</li>
              </ul>
            </>
          }
        />

        <ExpandableCard
          title="2021"
          subtitle="Worked on multiple .NET and C# projects"
          details={
            <>
              <p>Technologies:</p>

              <ul>
                <li>.NET Framework</li>
                <li>C#</li>
                <li>Windows Applications</li>
                <li>Enterprise Development</li>
              </ul>

              <br />

              <p>Built and maintained enterprise software solutions.</p>
            </>
          }
        />

        <ExpandableCard
          title="2022"
          subtitle="Worked on React, Flask and Python applications"
          details={
            <>
              <p>Technologies:</p>

              <ul>
                <li>React</li>
                <li>Flask</li>
                <li>Python</li>
                <li>REST APIs</li>
              </ul>

              <br />

              <p>Expanded into modern web development and backend APIs.</p>
            </>
          }
        />

        <ExpandableCard
          title="2023"
          subtitle="Developed Power BI dashboards and reporting solutions"
          details={
            <>
              <p>Technologies:</p>

              <ul>
                <li>Power BI</li>
                <li>DAX</li>
                <li>Data Modeling</li>
                <li>Reporting</li>
              </ul>

              <br />

              <p>Created dashboards and business intelligence solutions.</p>
            </>
          }
        />

        <ExpandableCard
          title="2024"
          subtitle="Built UiPath automation solutions"
          details={
            <>
              <p>Technologies:</p>

              <ul>
                <li>UiPath</li>
                <li>OCR</li>
                <li>Automation</li>
                <li>PDF Processing</li>
              </ul>

              <br />

              <p>Developed enterprise automation solutions and bots.</p>
            </>
          }
        />

        <ExpandableCard
          title="2025"
          subtitle="Expanded into DevOps, Release Management and Full Stack Development"
          details={
            <>
              <p>Focus Areas:</p>

              <ul>
                <li>DevOps</li>
                <li>Release Management</li>
                <li>React</li>
                <li>Python</li>
              </ul>

              <br />

              <p>
                Took ownership of broader development and deployment
                responsibilities.
              </p>
            </>
          }
        />

        <ExpandableCard
          title="2026"
          subtitle="Leading a team of 6 engineers"
          details={
            <>
              <p>Leadership Areas:</p>

              <ul>
                <li>DevOps Projects</li>
                <li>Development Projects</li>
                <li>Power BI Initiatives</li>
                <li>RPA Solutions</li>
              </ul>

              <br />

              <p>Managing delivery across multiple technology streams.</p>
            </>
          }
        />

        <ExpandableCard
          title="Future"
          subtitle="AI, Physics and AcharyaVerse"
          details={
            <>
              <p>Vision:</p>

              <ul>
                <li>Artificial Intelligence</li>
                <li>Physics Simulations</li>
                <li>Scientific Computing</li>
                <li>AcharyaVerse Evolution</li>
              </ul>

              <br />

              <p>Combining technology, science and creativity.</p>
            </>
          }
        />
      </div>
    </PlanetPageLayout>
  );
}
