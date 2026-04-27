import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import SectionCard from "../components/SectionCard";

function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await apiClient.get("/jobs/mine");
        setJobs(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Posting management</p>
        <h1>My Jobs</h1>
      </section>

      <SectionCard
        title="Recruiter Listings"
        subtitle="Open each posting to review candidates."
        actions={<Link className="primary-button" to="/recruiter/jobs/create">Create Job</Link>}
      >
        {error ? <p className="error-text">{error}</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Applicants</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.status}</td>
                  <td>
                    <Link to={`/recruiter/jobs/${job.id}/applicants`}>View Applicants</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default RecruiterJobsPage;
