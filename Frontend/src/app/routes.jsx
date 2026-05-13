import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/context/AuthContext";

// ── Lazy Loading Screens ──
const LoginScreen = lazy(() => import("../features/auth/presentation/screens/LoginScreen.jsx"));
const SignUpScreen = lazy(() => import("../features/auth/presentation/screens/SignUpScreen.jsx"));
const RecoverPasswordScreen = lazy(() => import("../features/auth/presentation/screens/RecoverPasswordScreen.jsx"));
const VerificationScreen = lazy(() => import("../features/auth/presentation/screens/VerificationScreen.jsx"));
const SetNewPasswordScreen = lazy(() => import("../features/auth/presentation/screens/SetNewPasswordScreen.jsx"));
const DashboardScreen = lazy(() => import("../features/dashboard/presentation/screens/DashboardScreen.jsx"));
const CoursesScreen = lazy(() => import("../features/courses/presentation/screens/CoursesScreen.jsx"));
const JobsScreen = lazy(() => import("../features/jobs/presentation/screens/JobsScreen.jsx"));
const ProfileScreen = lazy(() => import("../features/profile/presentation/screens/ProfileScreen.jsx"));
const CvManagerScreen = lazy(() => import("../features/cv/presentation/screens/CvManagerScreen.jsx"));
const ChatbotScreen = lazy(() => import("../features/chatbot/presentation/screens/ChatbotScreen.jsx"));
const CareerPathsScreen = lazy(() => import("../features/careerPath/presentation/screens/CareerPathsScreen.jsx"));
const CategoriesManagerScreen = lazy(() => import("../features/courses/presentation/screens/CategoriesManagerScreen.jsx"));
const PlatformManagerScreen = lazy(() => import("../features/courses/presentation/screens/PlatformManagerScreen.jsx"));
const MyLearningScreen = lazy(() => import("../features/courses/presentation/screens/MyLearningScreen.jsx"));
const MyJobApplicationsScreen = lazy(() => import("../features/jobs/presentation/screens/MyJobApplicationsScreen.jsx"));
const JobSourcesManagerScreen = lazy(() => import("../features/jobs/presentation/screens/JobSourcesManagerScreen.jsx"));
const SavedScreen = lazy(() => import("../features/dashboard/presentation/screens/SavedScreen.jsx"));
const CareerMatchScreen = lazy(() => import("../features/careerMatch/presentation/screens/CareerMatchScreen.jsx"));
const MyCareerPathsScreen = lazy(() => import("../features/careerPath/presentation/screens/MyCareerPathsScreen.jsx"));
const CareerPathDetailsScreen = lazy(() => import("../features/careerPath/presentation/screens/CareerPathDetailsScreen.jsx"));
const OnboardingScreen = lazy(() => import("../features/auth/presentation/screens/OnboardingScreen.jsx"));
const CareerPathsManager = lazy(() => import("../features/admin/presentation/screens/CareerPathsManager.jsx"));
const CategoriesManager = lazy(() => import("../features/admin/presentation/screens/CategoriesManager.jsx"));
const CoursesManager = lazy(() => import("../features/admin/presentation/screens/CoursesManager.jsx"));
const PlatformsManager = lazy(() => import("../features/admin/presentation/screens/PlatformsManager.jsx"));
const JobSourcesManager = lazy(() => import("../features/admin/presentation/screens/JobSourcesManager.jsx"));
const JobsManager = lazy(() => import("../features/admin/presentation/screens/JobsManager.jsx"));
const GlobalSkillsManager = lazy(() => import("../features/admin/presentation/screens/GlobalSkillsManager.jsx"));
const AdminProfileManager = lazy(() => import("../features/admin/presentation/screens/AdminProfileManager.jsx"));

// ── Static Layouts (Keep static for layout stability) ──
import DashboardLayout from "../core/ui_components/Layout/DashboardLayout.jsx";
import AdminLayout from "../features/admin/presentation/components/AdminLayout.jsx";

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-xl z-50">
    <div className="flex flex-col items-center gap-6">
       <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-glass" />
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Initializing Interface...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const AdminComingSoon = ({ title }) => (
  <div className="rounded-[2rem] border border-slate-200 bg-white p-10">
    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-primary)]">
      Admin Module
    </p>
    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
      {title}
    </h1>
    <p className="mt-3 max-w-2xl text-sm font-medium text-slate-500">
      This module route is reserved for the next implementation step.
    </p>
  </div>
);

const AppRoutes = () => {
  const hasCompletedOnboarding =
    localStorage.getItem("hasCompletedOnboarding") === "true";

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={
          <Navigate
            to={hasCompletedOnboarding ? "/login" : "/onboarding"}
            replace
          />
        }
      />
      <Route
        path="/onboarding"
        element={
          <PublicRoute>
            <OnboardingScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/recover-password"
        element={
          <PublicRoute>
            <RecoverPasswordScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <VerificationScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <VerificationScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/set-new-password"
        element={
          <PublicRoute>
            <SetNewPasswordScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/career-paths" replace />} />
        <Route path="career-paths" element={<CareerPathsManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="courses" element={<CoursesManager />} />
        <Route path="platforms" element={<PlatformsManager />} />
        <Route path="jobs" element={<JobsManager />} />
        <Route path="job-sources" element={<JobSourcesManager />} />
        <Route path="skills" element={<GlobalSkillsManager />} />
        <Route path="profile" element={<AdminProfileManager />} />
      </Route>
      <Route
        path="/career-paths"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerPathsScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-paths/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerPathDetailsScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-career-paths"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyCareerPathsScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-match"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerMatchScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CoursesScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-learning"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyLearningScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SavedScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved/:tab"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SavedScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobsScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyJobApplicationsScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfileScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv-manager"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CvManagerScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ChatbotScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<div className="text-center p-20">404 - Page Not Found</div>}
      />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
