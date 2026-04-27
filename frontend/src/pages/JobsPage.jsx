import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import JobCard from "../components/JobCard";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ location: "", salaryMin: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (filters.location) {
        query.set("location", filters.location);
      }
      if (filters.salaryMin) {
        query.set("salaryMin", filters.salaryMin);
      }

      const path = query.toString() ? `/jobs?${query.toString()}` : "/jobs";
      const data = await apiClient.get(path);
      setJobs(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    loadJobs();
  }

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Open opportunities</p>
        <h1>Job Listings</h1>
        <p className="muted-text">Search jobs by location and salary to find roles that fit your goals.</p>
      </section>

      <form className="card filter-bar" onSubmit={handleSearch}>
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(event) => setFilters({ ...filters, location: event.target.value })}
        />
        <input
          type="number"
          placeholder="Minimum salary"
          value={filters.salaryMin}
          onChange={(event) => setFilters({ ...filters, salaryMin: event.target.value })}
        />
        <button className="primary-button" type="submit">
          Search
        </button>
      </form>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p className="muted-text">Loading jobs...</p> : null}

      <div className="grid-list">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
