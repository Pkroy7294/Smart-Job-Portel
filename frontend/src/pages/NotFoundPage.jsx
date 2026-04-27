import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="card centered-card">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="muted-text">The page you are looking for does not exist.</p>
      <Link className="primary-button" to="/">
        Return Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
