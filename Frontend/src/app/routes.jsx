// src/app/routes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import SavedJobsScreen from "../features/jobs/presentation/screens/SavedJobsScreen.jsx";
import CareerMatchScreen from "../features/careerMatch/presentation/screens/CareerMatchScreen.jsx";

// 💡 استيراد شاشة مسارات المستخدم والتعريف الجديدة
import MyCareerPathsScreen from "../features/careerPath/presentation/screens/MyCareerPathsScreen.jsx";
import OnboardingScreen from "../features/auth/presentation/screens/OnboardingScreen.jsx"; // التحديث هنا

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  // 💡 التحقق من إتمام التعريف
  const hasCompletedOnboarding =
    localStorage.getItem("hasCompletedOnboarding") === "true"; // التحديث هنا[cite: 18]

  return (
    <Routes>
      {/* 💡 توجيه المستخدم بناءً على حالة التعريف */}
      <Route
        path="/"
        element={
          <Navigate
            to={hasCompletedOnboarding ? "/login" : "/onboarding"}
            replace
          />
        }
      />{" "}
      {/* التحديث هنا[cite: 18] */}
      {/* 💡 مسار شاشة التعريف الجديد */}
      <Route
        path="/onboarding"
        element={
          <PublicRoute>
            <OnboardingScreen />
          </PublicRoute>
        }
      />{" "}
      {/* التحديث هنا[cite: 18] */}
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
        path="/career-paths"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerPathsScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* 💡 مسار مسارات المستخدم الملتحق بها */}
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
        path="/categories-manager"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CategoriesManagerScreen />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/platform-manager"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlatformManagerScreen />
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
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SavedJobsScreen />
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
        path="/job-sources-manager"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobSourcesManagerScreen />
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
