// src/features/auth/presentation/screens/SignUpScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useSignUp } from "../../hooks/useSignUp";
import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";

const SignUpScreen = () => {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSignUp,
    handleGoogleSuccess,
    handleGoogleError,
  } = useSignUp();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FD] p-6">
      <div className="w-full max-w-lg bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-blue-100 border border-white animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
            👤
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 font-medium text-xs leading-relaxed">
            Please fill in your details to create <br /> your professional
            account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="rounded-2xl bg-slate-50 border-none"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="rounded-2xl bg-slate-50 border-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="rounded-2xl bg-slate-50 border-none"
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="rounded-2xl bg-slate-50 border-none"
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-2xl bg-slate-50 border-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-2xl bg-slate-50 border-none"
            />
            <Input
              label="Confirm"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="rounded-2xl bg-slate-50 border-none"
            />
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              className="py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-5">
          <div className="flex items-center gap-3 text-gray-200">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[10px] font-black uppercase text-gray-300">
              Or Sign Up with
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
        </div>

        <p className="mt-8 text-center text-[11px] text-gray-400 font-black uppercase">
          Already have account?{" "}
          <Link to="/login" className="text-primary hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
