import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import RecommendedJobsPage from "./pages/RecommendedJobsPage";
import RecruiterDashboardPage from "./pages/RecruiterDashboardPage";
import RecruiterJobsPage from "./pages/RecruiterJobsPage";
import CreateJobPage from "./pages/CreateJobPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resume-upload" element={<ResumeUploadPage />} />
            <Route path="/my-applications" element={<MyApplicationsPage />} />
            <Route path="/recommended-jobs" element={<RecommendedJobsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["RECRUITER", "ADMIN"]} />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
            <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
            <Route path="/recruiter/jobs/:jobId/applicants" element={<ApplicantsPage />} />
          </Route>

          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
