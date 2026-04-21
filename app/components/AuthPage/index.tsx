"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../Login";
import SignupForm from "../Signup";
import { LocationPermissionModal } from "../LocationPermissionModal";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const constraintsRef = useRef(null);
useEffect (() => {
  // Replace history so this page becomes first entry
  window.history.replaceState(null, "", window.location.href);
}, []);
  return (
    <>
      <LocationPermissionModal />

      {/* Animated background */}
      <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4 relative overflow-hidden">

        {/* Floating orb 1 */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full  blur-3xl pointer-events-none"
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 80, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-10%" }}
        />

        {/* Floating orb 2 */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, -60, 50, 0],
            y: [0, 70, -50, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ bottom: "-10%", right: "-5%" }}
        />

        {/* Floating orb 3 */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, 40, -80, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          style={{ top: "40%", right: "10%" }}
        />

        {/* Card */}
        <motion.div
          className="w-full max-w-xl bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, duration: 0.7 }}
          whileHover={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
        >

          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center">
            <motion.h1
              className="text-4xl font-bold text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </motion.span>
              </AnimatePresence>
            </motion.h1>
          </div>

          {/* Tabs */}
          <div className="flex px-8 border-b border-white/10 relative">
            {(["login", "signup"] as const).map((tab, i) => (
              <motion.button
                key={tab}
                className={`flex-1 py-5 text-lg font-semibold transition-colors duration-200 relative
                  ${mode === tab ? "text-white" : "text-white/50"}
                `}
                onClick={() => setMode(tab)}
                whileHover={{ color: "rgba(255,255,255,0.85)" }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                {tab === "login" ? "Log In" : "Sign Up"}

                {/* Animated underline */}
                {mode === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-full"
                    layoutId="tab-underline"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Form area */}
          <div className="px-8 pt-8 pb-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signup" ? 40 : -40, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: mode === "signup" ? -40 : 40, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.35 }}
              >
                {mode === "login" ? <LoginForm /> : <SignupForm />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom */}
          <motion.div
            className="px-8 py-7 border-t border-white/10 text-center text-sm bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.p
                  key="login-footer"
                  className="text-white/60"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  Don't have an account?{" "}
                  <motion.button
                    onClick={() => setMode("signup")}
                    className="text-white font-semibold hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign up
                  </motion.button>
                </motion.p>
              ) : (
                <motion.p
                  key="signup-footer"
                  className="text-white/60"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  Already have an account?{" "}
                  <motion.button
                    onClick={() => setMode("login")}
                    className="text-white font-semibold hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log in
                  </motion.button>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;