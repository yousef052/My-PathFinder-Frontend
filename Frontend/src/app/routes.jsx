import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/context/AuthContext";

import DashboardLayout from "../core/ui_components/Layout/DashboardLayout.jsx";
import LoginScreen from "../features/auth/presentation/screens/LoginScreen.jsx";
import SignUpScreen from "../features/auth/presentation/screens/SignUpScreen.jsx";
import RecoverPasswordScreen from "../features/auth/presentation/screens/RecoverPasswordScreen.jsx";
import VerificationScreen from "../features/auth/presentation/screens/VerificationScreen.jsx";
import SetNewPasswordScreen from "../features/auth/presentation/screens/SetNewPasswordScreen.jsx";
import DashboardScreen from "../features/dashboard/presentation/screens/DashboardScreen.jsx";
import CoursesScreen from "../features/courses/presentation/screens/CoursesScreen.jsx";
import JobsScreen from "../features/jobs/presentation/screens/JobsScreen.jsx";
import ProfileScreen from "../features/profile/presentation/screens/ProfileScreen.jsx";
import CvManagerScreen from "../features/cv/presentation/screens/CvManagerScreen.jsx";
import ChatbotScreen from "../features/chatbot/presentation/screens/ChatbotScreen.jsx";
import CareerPathsScreen from "../features/careerPath/presentation/screens/CareerPathsScreen.jsx";
import CategoriesManagerScreen from "../features/courses/presentation/screens/CategoriesManagerScreen.jsx";
import PlatformManagerScreen from "../features/courses/presentation/screens/PlatformManagerScreen.jsx";
import MyLearningScreen from "../features/courses/presentation/screens/MyLearningScreen.jsx";
import MyJobApplicationsScreen from "../features/jobs/presentation/screens/MyJobApplicationsScreen.jsx";
import JobSourcesManagerScreen from "../features/jobs/presentation/screens/JobSourcesManagerScreen.jsx";
import SavedScreen from "../features/dashboard/presentation/screens/SavedScreen.jsx";
import CareerMatchScreen from "../features/careerMatch/presentation/screens/CareerMatchScreen.jsx";
import MyCareerPathsScreen from "../features/careerPath/presentation/screens/MyCareerPathsScreen.jsx";
import CareerPathDetailsScreen from "../features/careerPath/presentation/screens/CareerPathDetailsScreen.jsx";
import OnboardingScreen from "../features/auth/presentation/screens/OnboardingScreen.jsx";
import AdminLayout from "../features/admin/presentation/components/AdminLayout.jsx";
import CareerPathsManager from "../features/admin/presentation/screens/CareerPathsManager.jsx";
import CategoriesManager from "../features/admin/presentation/screens/CategoriesManager.jsx";
import CoursesManager from "../features/admin/presentation/screens/CoursesManager.jsx";
import PlatformsManager from "../features/admin/presentation/screens/PlatformsManager.jsx";
import JobSourcesManager from "../features/admin/presentation/screens/JobSourcesManager.jsx";
import GlobalSkillsManager from "../features/admin/presentation/screens/GlobalSkillsManager.jsx";
import AdminProfileManager from "../features/admin/presentation/screens/AdminProfileManager.jsx";

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
    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">
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
  );
};

export default AppRoutes;
