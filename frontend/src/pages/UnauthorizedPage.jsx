import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <section className="card centered-card">
      <p className="eyebrow">Access denied</p>
      <h1>Unauthorized</h1>
      <p className="muted-text">Your current role does not have permission to open this page.</p>
      <Link className="primary-button" to="/">
        Back to Home
      </Link>
    </section>
  );
}

export default UnauthorizedPage;
