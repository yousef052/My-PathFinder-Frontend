import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes.jsx";
import { GOOGLE_CLIENT_ID } from "../features/auth/config/googleAuth";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50/30 text-gray-900 font-sans w-full selection:bg-primary selection:text-white">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
