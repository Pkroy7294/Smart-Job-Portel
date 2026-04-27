import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import SectionCard from "../components/SectionCard";

function ApplicantsPage() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplicants() {
      try {
        const data = await apiClient.get(`/applications/job/${jobId}`);
        setApplicants(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadApplicants();
  }, [jobId]);

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Applicant review</p>
        <h1>Applicants for Job #{jobId}</h1>
      </section>

      <SectionCard title="Candidate List" subtitle="Review match score and application status.">
        {error ? <p className="error-text">{error}</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Status</th>
                <th>Match Score</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>{applicant.applicantName}</td>
                  <td>{applicant.status}</td>
                  <td>{applicant.matchScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default ApplicantsPage;
