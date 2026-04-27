import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

function JobDetailPage() {
  const { jobId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await apiClient.get(`/jobs/${jobId}`);
        setJob(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadJob();
  }, [jobId]);

  async function handleApply(event) {
    event.preventDefault();
    setError("");
    setFeedback("");

    try {
      const result = await apiClient.post("/applications", {
        jobId: Number(jobId),
        resumeId: resumeId ? Number(resumeId) : null,
        coverLetter
      });
      setFeedback(`Applied successfully. Match score: ${result.matchScore}`);
    } catch (applyError) {
      setError(applyError.message);
    }
  }

  if (error && !job) {
    return <p className="error-text">{error}</p>;
  }

  if (!job) {
    return <p className="muted-text">Loading job details...</p>;
  }

  return (
    <div className="two-column">
      <section className="card stack-md">
        <div className="job-card-header">
          <div>
            <p className="eyebrow">{job.companyName}</p>
            <h1>{job.title}</h1>
          </div>
          <span className={`status-pill ${String(job.status || "").toLowerCase()}`}>{job.status}</span>
        </div>
        <p className="muted-text">{job.description}</p>
        <div className="job-meta">
          <span>{job.location}</span>
          <span>{job.employmentType}</span>
          <span>
            {job.salaryMin} - {job.salaryMax}
          </span>
        </div>
        <div className="tag-list">
          {(job.skills || []).map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="card stack-md">
        <div>
          <p className="eyebrow">Quick Action</p>
          <h2>Apply to this job</h2>
        </div>

        {!isAuthenticated ? (
          <p className="muted-text">
            Please <Link to="/login">login</Link> as a job seeker to apply.
          </p>
        ) : user?.role !== "USER" && user?.role !== "ADMIN" ? (
          <p className="muted-text">Recruiter accounts can view job details but cannot apply.</p>
        ) : (
          <form className="stack-md" onSubmit={handleApply}>
            <label>
              Resume Id
              <input value={resumeId} onChange={(event) => setResumeId(event.target.value)} placeholder="Example: 1" />
            </label>
            <label>
              Cover letter
              <textarea rows="5" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} />
            </label>
            {feedback ? <p className="success-text">{feedback}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
            <button className="primary-button" type="submit">
              Submit Application
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default JobDetailPage;
