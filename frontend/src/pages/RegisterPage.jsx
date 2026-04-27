import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  fullName: "",
  email: "",
  password: "",
  role: "USER",
  location: "",
  profileSummary: "",
  yearsOfExperience: 0
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await register({
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience)
      });
      navigate(result.role === "RECRUITER" ? "/recruiter/dashboard" : "/dashboard", { replace: true });
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
          <p className="eyebrow">Start your profile</p>
          <h1>Create your Smart Job Portal account</h1>
        </div>

        <div className="form-grid">
          <label>
            Full name
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="USER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </label>

          <label>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>

          <label>
            Experience (years)
            <input
              type="number"
              min="0"
              value={form.yearsOfExperience}
              onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
            />
          </label>
        </div>

        <label>
          Profile summary
          <textarea
            rows="4"
            value={form.profileSummary}
            onChange={(e) => setForm({ ...form, profileSummary: e.target.value })}
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
