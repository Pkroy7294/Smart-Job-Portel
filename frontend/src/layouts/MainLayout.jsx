import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">SJP</span>
          <div>
            <strong>Smart Job Portal</strong>
            <small>Resume intelligence for faster hiring</small>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/jobs">Jobs</NavLink>
          {user?.role === "USER" || user?.role === "ADMIN" ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
          {user?.role === "RECRUITER" || user?.role === "ADMIN" ? (
            <NavLink to="/recruiter/dashboard">Recruiter</NavLink>
          ) : null}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span>{user?.fullName}</span>
                <small>{user?.role}</small>
              </div>
              <button className="ghost-button" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button" to="/login">
                Login
              </Link>
              <Link className="primary-button" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
