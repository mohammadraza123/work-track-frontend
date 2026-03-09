"use client";

import React, { useState } from "react";

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      console.log("Login attempt:", { email, password });
      // Add your login logic here (API call, etc.)
    } else {
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log("Signup attempt:", { name, email, password });
      // Add your signup logic here
    }
  };

  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4 font-sans">
      {/* Main Container - Perfectly centered, max-width for web, full-width on mobile */}
      <div className="w-full max-w-xl bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header / Logo Area */}
        <div className="pt-10 pb-6 px-8 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            Welcome Back
          </h1>
        </div>

        {/* Tab Switcher - Very common mobile pattern */}
        <div className="flex px-8 border-b border-white/10">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-5 text-lg font-semibold transition-all duration-200 ${
              mode === "login"
                ? "text-white border-b-4 border-white"
                : "text-white/50"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-5 text-lg font-semibold transition-all duration-200 ${
              mode === "signup"
                ? "text-white border-b-4 border-white"
                : "text-white/50"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Area */}
        <div className="px-8 pt-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field - only in signup */}
            {mode === "signup" && (
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/10 border border-white/20 focus:border-white text-white placeholder:text-white/40 rounded-2xl px-6 py-5 text-base outline-none transition-all"
                  />
                  {/* User Icon */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full bg-white/10 border border-white/20 focus:border-white text-white placeholder:text-white/40 rounded-2xl px-6 py-5 text-base outline-none transition-all"
                />
                {/* Envelope Icon */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2.01 2.01 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 focus:border-white text-white placeholder:text-white/40 rounded-2xl px-6 py-5 text-base outline-none transition-all pr-14"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178a1.003 1.003 0 01-.036-.59"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18M10.5 10.5l9 9M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password - only in signup */}
            {mode === "signup" && (
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/10 border border-white/20 focus:border-white text-white placeholder:text-white/40 rounded-2xl px-6 py-5 text-base outline-none transition-all pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178a1.003 1.003 0 01-.036-.59"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3l18 18M10.5 10.5l9 9M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password - only login */}
            {mode === "login" && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button - Big touch target, mobile-first */}
            <button
              type="submit"
              className="w-full bg-white text-[#292c43] font-semibold text-xl py-5 rounded-3xl active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30"
            >
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>
        </div>

        {/* Bottom Switcher */}
        <div className="px-8 py-7 border-t border-white/10 text-center text-sm bg-black/20">
          {mode === "login" ? (
            <p className="text-white/60">
              Don&apos;t have an account?{" "}
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
  );
};

export default AuthForm;
