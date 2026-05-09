// src/features/auth/presentation/screens/LoginScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../../hooks/useLogin";
import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";

const LoginScreen = () => {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleLogin,
    handleGoogleSuccess,
    handleGoogleError,
  } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FD] p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-blue-100 border border-white animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-400 font-medium text-sm leading-relaxed">
            Please enter your details to login <br /> to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
          />
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <Link
              to="/recover-password"
              title="Recover Password"
              className="absolute top-0 right-0 text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
            >
              Forgot?
            </Link>
          </div>
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            className="py-4 mt-2"
          >
            Login
          </Button>
        </form>

        <div className="mt-10 text-center space-y-6">
          <div className="flex items-center gap-3 text-gray-200">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[10px] font-black uppercase text-gray-300">
              Or Login with
            </span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>
          <div className="flex justify-center rounded-full overflow-hidden border border-gray-100">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              ux_mode="popup"
              theme="outline"
              shape="pill"
              width="320px"
            />
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
