"use client";

import { useState } from "react";
import Button from "../Button";
import LoginForm from "../Login";
import SignupForm from "../Signup";
import { LocationPermissionModal } from "../LocationPermissionModal";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <LocationPermissionModal />

      <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="pt-10 pb-6 px-8 text-center">
            <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          </div>

          {/* Tabs */}
          <div className="flex px-8 border-b border-white/10">
            <button
              className={`flex-1 py-5 text-lg font-semibold transition-all duration-200
        ${mode === "login" ? "text-white border-b-4 border-white" : "text-white/50"}
      `}
              onClick={() => setMode("login")}
            >
              Log In
            </button>

            <button
              className={`flex-1 py-5 text-lg font-semibold transition-all duration-200
        ${mode === "signup" ? "text-white border-b-4 border-white" : "text-white/50"}
      `}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="px-8 pt-8 pb-10">
            {mode === "login" ? <LoginForm /> : <SignupForm />}
          </div>

          {/* bottom */}
          <div className="px-8 py-7 border-t border-white/10 text-center text-sm bg-black/20">
            {mode === "login" ? (
              <p className="text-white/60">
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-white font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-white/60">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-white font-semibold hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
