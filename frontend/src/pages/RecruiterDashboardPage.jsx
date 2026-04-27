import { Link } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

function RecruiterDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Recruiter workspace</p>
        <h1>{user?.fullName}'s Dashboard</h1>
        <p className="muted-text">Post openings, review applicants, and keep hiring workflows organized.</p>
      </section>

      <div className="stat-grid">
        <StatCard label="Role" value={user?.role} helper="Authorized to create and manage job postings." />
        <StatCard label="Hiring Focus" value="Open Roles" helper="Create listings and send job links to candidates." />
        <StatCard label="Next Action" value="Post New Job" helper="Define required skills for better candidate matching." />
      </div>

      <div className="two-column">
        <SectionCard
          title="Recruiter Actions"
          subtitle="Manage postings and applicant review from these pages."
          actions={<Link className="primary-button" to="/recruiter/jobs/create">Create Job</Link>}
        >
          <div className="quick-links">
            <Link className="ghost-button" to="/recruiter/jobs">View My Jobs</Link>
            <Link className="ghost-button" to="/jobs">Check Public Listings</Link>
          </div>
        </SectionCard>

        <SectionCard title="Best Practice" subtitle="Write structured job descriptions for better recommendations.">
          <ul className="feature-list">
            <li>Include required technologies in the description and skill list.</li>
            <li>Use consistent location and salary ranges for cleaner filtering.</li>
            <li>Review applicant match scores to prioritize aligned candidates.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

export default RecruiterDashboardPage;
