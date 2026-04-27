import { Link } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Job seeker workspace</p>
        <h1>{user?.fullName}'s Dashboard</h1>
        <p className="muted-text">Manage your resume, applications, and skill-based recommendations in one place.</p>
      </section>

      <div className="stat-grid">
        <StatCard label="Profile Role" value={user?.role} helper="Authorized to upload resumes and apply for jobs." />
        <StatCard label="Primary Email" value={user?.email} helper="Used for login and notification-ready workflows." />
        <StatCard label="Next Best Step" value="Upload Resume" helper="Skill extraction powers recommendations." />
      </div>

      <div className="two-column">
        <SectionCard
          title="Career Actions"
          subtitle="Use these shortcuts to keep your profile active."
          actions={<Link className="primary-button" to="/resume-upload">Upload Resume</Link>}
        >
          <div className="quick-links">
            <Link className="ghost-button" to="/recommended-jobs">View Recommended Jobs</Link>
            <Link className="ghost-button" to="/my-applications">Check My Applications</Link>
            <Link className="ghost-button" to="/jobs">Browse All Jobs</Link>
          </div>
        </SectionCard>

        <SectionCard title="How Matching Works" subtitle="A beginner-friendly explanation of the recommendation engine.">
          <ul className="feature-list">
            <li>Your uploaded resume text is parsed using Apache Tika.</li>
            <li>Known keywords such as Java, Spring Boot, React, and MySQL are extracted as skills.</li>
            <li>Open jobs are ranked by overlap between your skills and each job's required skills.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

export default DashboardPage;
