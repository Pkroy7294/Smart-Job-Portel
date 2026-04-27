import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { apiClient } from "../api/client";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await apiClient.get("/applications/me");
        setApplications(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadApplications();
  }, []);

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Application history</p>
        <h1>My Applications</h1>
      </section>

      <SectionCard title="Submitted Applications" subtitle="Track status and match score for each application.">
        {error ? <p className="error-text">{error}</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Status</th>
                <th>Match Score</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.jobTitle}</td>
                  <td>{application.status}</td>
                  <td>{application.matchScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default MyApplicationsPage;
