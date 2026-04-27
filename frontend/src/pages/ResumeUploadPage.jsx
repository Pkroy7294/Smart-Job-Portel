import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { apiClient } from "../api/client";

function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError("Please choose a resume file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiClient.post("/resumes/upload", formData);
      setResult(data);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack-lg">
      <section className="page-head">
        <p className="eyebrow">Resume workflow</p>
        <h1>Upload Resume</h1>
        <p className="muted-text">Upload a PDF, DOC, or DOCX file and let the portal extract your skills.</p>
      </section>

      <SectionCard title="Resume Analyzer" subtitle="Accepted formats: PDF, DOC, DOCX">
        <form className="stack-md" onSubmit={handleSubmit}>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          {error ? <p className="error-text">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Upload and Analyze"}
          </button>
        </form>
      </SectionCard>

      {result ? (
        <SectionCard title="Analysis Result" subtitle={`Resume Id: ${result.resumeId}`}>
          <div className="stack-md">
            <p className="muted-text">File: {result.fileName}</p>
            <div>
              <h3>Extracted Skills</h3>
              <div className="tag-list">
                {result.extractedSkills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3>Recommended Job Titles</h3>
              <ul className="feature-list">
                {result.recommendedJobTitles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export default ResumeUploadPage;
