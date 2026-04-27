import { Link } from "react-router-dom";

function JobCard({ job, action }) {
  return (
    <article className="card job-card">
      <div className="job-card-header">
        <div>
          <p className="eyebrow">{job.companyName}</p>
          <h3>{job.title}</h3>
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

      <div className="job-card-footer">
        {job.matchPercentage !== null && job.matchPercentage !== undefined ? (
          <strong>{Math.round(job.matchPercentage)}% match</strong>
        ) : (
          <span className="muted-text">Recruiter: {job.recruiterName}</span>
        )}
        <div className="inline-actions">
          <Link className="ghost-button" to={`/jobs/${job.id}`}>
            View
          </Link>
          {action}
        </div>
      </div>
    </article>
  );
}

export default JobCard;
