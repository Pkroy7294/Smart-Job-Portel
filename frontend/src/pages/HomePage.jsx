import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="hero-grid">
      <section className="hero-panel">
        <p className="eyebrow">AI-assisted hiring workflow</p>
        <h1>Match strong candidates to the right jobs faster.</h1>
        <p className="hero-copy">
          Smart Job Portal helps job seekers upload resumes, extract skills automatically, and discover better-fit
          opportunities while recruiters manage openings and applicants in one place.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/register">
            Create Account
          </Link>
          <Link className="ghost-button" to="/jobs">
            Explore Jobs
          </Link>
        </div>
      </section>

      <section className="card spotlight-panel">
        <div className="spotlight-row">
          <span className="spotlight-badge">Resume Analyzer</span>
          <strong>PDF / DOC / DOCX</strong>
        </div>
        <ul className="feature-list">
          <li>Extract skills from uploaded resumes using Apache Tika</li>
          <li>Recommend jobs based on matched technology keywords</li>
          <li>Manage recruiter job postings and applicant pipelines</li>
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
