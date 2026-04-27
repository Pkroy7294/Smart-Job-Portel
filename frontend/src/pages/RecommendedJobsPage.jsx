import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import JobCard from "../components/JobCard";

function RecommendedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await apiClient.get("/jobs/recommended");
        setJobs(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadRecommendations();
  }, []);

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Skill-based ranking</p>
        <h1>Recommended Jobs</h1>
        <p className="muted-text">These roles are sorted by overlap between your extracted resume skills and job requirements.</p>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="grid-list">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedJobsPage;
