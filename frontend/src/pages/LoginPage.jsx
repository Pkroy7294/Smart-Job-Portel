import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form);
      if (result.role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Login to your account</h1>
        </div>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="muted-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
