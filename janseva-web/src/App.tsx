import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import { ThemeProvider } from "./lib/theme-provider";

// New Page Imports
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DashboardHome from "./pages/DashboardHome";
import DashboardLayout from "./pages/DashboardLayout";
import CreateComplaintPage from "./pages/CreateComplaint";
import TrackComplaintsPage from "./pages/TrackComplaints";
import TrackDetailPage from "./pages/TrackDetail";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AuthorityResolvePage from "./pages/ResolveGrievance";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerDetailPage from "./pages/WorkerDetail";
import WorkerMonitoringPage from "./pages/WorkerMonitoring";
import ProfilePage from "./pages/Profile";
import AnalyticsPage from "./pages/Analytics";
import MapPage from "./pages/Map";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="janseva-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="create" element={<CreateComplaintPage />} />
              <Route path="track" element={<TrackComplaintsPage />} />
              <Route path="track/:id" element={<TrackDetailPage />} />
              <Route path="authority" element={<AuthorityDashboard />} />
              <Route path="authority/workers" element={<WorkerMonitoringPage />} />
              <Route path="authority/resolve/:id" element={<AuthorityResolvePage />} />
              <Route path="worker" element={<WorkerDashboard />} />
              <Route path="worker/:id" element={<WorkerDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="map" element={<MapPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
