import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";

const initialForm = {
  title: "",
  description: "",
  companyName: "",
  location: "",
  employmentType: "FULL_TIME",
  salaryMin: "",
  salaryMax: "",
  status: "OPEN",
  skills: ""
};

function CreateJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/jobs", {
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      });
      navigate("/recruiter/jobs");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <form className="card auth-card auth-card-wide" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">New listing</p>
          <h1>Create Job Posting</h1>
        </div>

        <div className="form-grid">
          <label>
            Job title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Company name
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </label>
          <label>
            Employment type
            <input
              value={form.employmentType}
              onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              required
            />
          </label>
          <label>
            Salary min
            <input
              type="number"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              required
            />
          </label>
          <label>
            Salary max
            <input
              type="number"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Description
          <textarea rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </label>

        <label>
          Skills
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="java, spring boot, react, mysql"
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Job"}
        </button>
      </form>
    </section>
  );
}

export default CreateJobPage;
