import PlanetPageLayout from "../components/PlanetPageLayout";

export default function Contact() {
  return (
    <PlanetPageLayout title="Contact Planet">
      <h2>Connect With Me</h2>

      <p>Feel free to reach out through any of the following channels.</p>

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <h3>LinkedIn</h3>
        <a
          href="https://www.linkedin.com/in/mayank-acharya/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn Profile
        </a>

        <h3>GitHub</h3>
        <a
          href="https://github.com/Automation-with-Acharya"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Profile
        </a>

        <h3>Email</h3>
        <p>mayank.acharya.official@gmail.com</p>
      </div>
    </PlanetPageLayout>
  );
}
