import { Link } from "react-router-dom";



export default function Projects() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
      }}
    >
<Link
  to="/"
  style={{
    color: "cyan",
    textDecoration: "none",
  }}
>
  ← Return To Universe
</Link>

      <h1>Projects Planet</h1>

      <h2>Bank of America</h2>

      <ul>
        <li>Power BI Dashboards</li>
        <li>UiPath Automations</li>
        <li>React Applications</li>
        <li>Python Tools</li>
      </ul>
    </div>
  );
}