import React from "react";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";

const RecoverPasswordScreen = () => {
  const { email, setEmail, isLoading, error, handleForgot } =
    useForgotPassword();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">
          Recover Password
        </h1>
        <p className="text-sm text-gray-400 font-medium mb-8 text-center">
          Enter your email to receive an OTP code.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleForgot} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            required
          />
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            className="py-4 font-bold"
          >
            Send OTP Code
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPasswordScreen;
