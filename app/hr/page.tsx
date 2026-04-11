"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Leave } from "../types/leave";
import StatusBadge from "../components/leave/StatusBadge";
import { diffDays, formatDate } from "../utils/leaveHelpers";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import BackButton from "../components/BackButton";

const HR_EMAIL = "hr@company.com";
const HR_PASSWORD = "hr1234";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function use3DTilt(strength = 12) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 30 });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };
  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function HRLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const cardTilt = use3DTilt(10);

  const inputClass =
    "w-full bg-[#1e2035] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-all";

  const handleLogin = () => {
    if (email === HR_EMAIL && password === HR_PASSWORD) {
      sessionStorage.setItem("hr_auth", "true");
      onLogin();
    } else {
      setShake(true);
      setError("Invalid credentials.");
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2035] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <motion.div className="absolute w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
        animate={{ x: [0, 60, -30, 0], y: [0, -50, 70, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-10%", left: "-10%" }}
      />
      <motion.div className="absolute w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
        animate={{ x: [0, -50, 40, 0], y: [0, 60, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ bottom: "5%", right: "-5%" }}
      />

     <motion.div
  className="w-full max-w-sm bg-[#292c43] border border-white/10 rounded-3xl p-8 relative overflow-hidden cursor-default"
  style={{ rotateX: cardTilt.rotateX, rotateY: cardTilt.rotateY, transformStyle: "preserve-3d", perspective: 800 }}
  onMouseMove={cardTilt.onMouseMove}
  onMouseLeave={cardTilt.onMouseLeave}
  initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: -15 }}
  animate={
    shake
      ? { x: [-8, 8, -6, 6, -4, 4, 0], opacity: 1, scale: 1, y: 0, rotateX: 0 }
      : { opacity: 1, scale: 1, y: 0, rotateX: 0, x: 0 }
  }
  transition={
    shake
      ? { duration: 0.5 }
      : { type: "spring", stiffness: 180, damping: 20 }
  }
>
        {/* Shine layer */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />

        <motion.div className="mb-8 text-center" style={{ transform: "translateZ(20px)" }}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <motion.div
            className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{ rotateY: [0, 10, 0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z" />
              <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold text-white">HR Portal</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage leave requests</p>
        </motion.div>

        <motion.div className="space-y-3" style={{ transform: "translateZ(16px)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {[
            { type: "email", placeholder: "Email", value: email, onChange: setEmail },
            { type: "password", placeholder: "Password", value: password, onChange: setPassword },
          ].map((field, i) => (
            <motion.input
              key={field.type}
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onKeyDown={field.type === "password" ? (e: any) => e.key === "Enter" && handleLogin() : undefined}
              className={inputClass}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08, type: "spring", stiffness: 200 }}
              whileFocus={{ scale: 1.01, borderColor: "rgba(255,255,255,0.3)" }}
            />
          ))}

          <AnimatePresence>
            {error && (
              <motion.p className="text-red-400 text-sm px-1"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >{error}</motion.p>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-white text-[#292c43] font-bold text-sm relative overflow-hidden mt-2"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03, rotateX: 4, boxShadow: "0 10px 40px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.97, rotateX: -2 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)", backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            Sign In
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Leave Card ───────────────────────────────────────────────────────────────
function LeaveCard({ leave, index, updating, onApprove, onReject }: {
  leave: Leave; index: number; updating: string | null;
  onApprove: () => void; onReject: () => void;
}) {
  const tilt = use3DTilt(8);

  return (
    <motion.div
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d", perspective: 600 }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity: 0, y: 30, rotateX: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, rotateX: 10 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: index * 0.06 }}
      whileHover={{ scale: 1.015, z: 10 }}
      layout
    >
      <div className="bg-[#32364f] border border-white/8 rounded-2xl p-4 relative overflow-hidden">
        {/* Shine */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)" }} />

        <div className="flex items-start justify-between gap-3 mb-2" style={{ transform: "translateZ(10px)" }}>
          <p className="text-white font-medium text-sm leading-snug flex-1">{leave.reason}</p>
          <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: index * 0.06 + 0.15 }}>
            <StatusBadge status={leave.status} />
          </motion.div>
        </div>

        <div className="flex items-center gap-2 text-white/40 text-xs mb-4" style={{ transform: "translateZ(6px)" }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>{formatDate(leave.startDate)} → {formatDate(leave.endDate)}</span>
          <span>·</span>
          <span>{diffDays(leave.startDate, leave.endDate)} day(s)</span>
        </div>

        <div className="flex gap-2" style={{ transform: "translateZ(12px)" }}>
          <motion.button
            disabled={updating === leave._id || leave.status === "approved"}
            onClick={onApprove}
            className="flex-1 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition relative overflow-hidden"
            whileHover={{ scale: 1.04, rotateX: 3, boxShadow: "0 6px 24px rgba(52,211,153,0.2)" }}
            whileTap={{ scale: 0.96 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="wait">
              <motion.span key={updating === leave._id ? "loading" : "label"}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}>
                {updating === leave._id ? "..." : "✓ Approve"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            disabled={updating === leave._id || leave.status === "rejected"}
            onClick={onReject}
            className="flex-1 py-2 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-semibold hover:bg-red-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition relative overflow-hidden"
            whileHover={{ scale: 1.04, rotateX: 3, boxShadow: "0 6px 24px rgba(248,113,113,0.2)" }}
            whileTap={{ scale: 0.96 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="wait">
              <motion.span key={updating === leave._id ? "loading" : "label"}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}>
                {updating === leave._id ? "..." : "✕ Reject"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HR Dashboard ─────────────────────────────────────────────────────────────
function HRDashboard({ onLogout }: { onLogout: () => void }) {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get("leave/");
      setLeaves(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      await api.patch(`leave/${id}/status`, { status });
      setLeaves((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update.");
    } finally {
      setUpdating(null);
    }
  };

  const stats = {
    all: leaves.length,
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  const filtered = filter === "all" ? leaves : leaves.filter((l) => l.status === filter);

  const statConfig = [
    { key: "all",      label: "All",      color: "text-white",        glow: "rgba(255,255,255,0.15)" },
    { key: "pending",  label: "Pending",  color: "text-yellow-400",   glow: "rgba(250,204,21,0.2)" },
    { key: "approved", label: "Approved", color: "text-emerald-400",  glow: "rgba(52,211,153,0.2)" },
    { key: "rejected", label: "Rejected", color: "text-red-400",      glow: "rgba(248,113,113,0.2)" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#1e2035] relative overflow-hidden">
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Orbs */}
      <motion.div className="fixed w-96 h-96 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none"
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 80, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-10%", left: "-10%", zIndex: 0 }} />
      <motion.div className="fixed w-72 h-72 rounded-full bg-purple-500/8 blur-3xl pointer-events-none"
        animate={{ x: [0, -60, 40, 0], y: [0, 80, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        style={{ bottom: "0%", right: "-5%", zIndex: 0 }} />

      <div className="relative z-10 max-w-xl mx-auto px-4 pt-8 pb-12">

        {/* Header */}
        <motion.div className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}>
          <div className="mb-6">
             <div className="mb-4">
                          <BackButton label="Home" href="/" />
                        </div>
            <motion.h1 className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              HR Dashboard
            </motion.h1>
            <motion.p className="text-white/40 text-sm mt-0.5"
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
              Manage employee leave requests
            </motion.p>
          </div>
          <motion.button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {statConfig.map(({ key, label, color, glow }, i) => (
            <motion.button
              key={key}
              onClick={() => setFilter(key)}
              className={`bg-[#292c43] border rounded-2xl p-3 text-center relative overflow-hidden ${
                filter === key ? "border-white/30" : "border-white/8 hover:border-white/15"
              }`}
              initial={{ opacity: 0, y: 20, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 + i * 0.07 }}
              whileHover={{
                scale: 1.07,
                rotateY: 5,
                rotateX: -4,
                boxShadow: `0 8px 28px ${glow}`,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d", perspective: 400 }}
            >
              {/* Active indicator shine */}
              {filter === key && (
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  layoutId="stat-active"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.p
                className={`text-xl font-bold ${color}`}
                key={stats[key]}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {stats[key]}
              </motion.p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </motion.button>
          ))}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div className="flex flex-col items-center justify-center py-16 gap-4"
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
              />
              <motion.p className="text-white/30 text-sm"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                Loading requests...
              </motion.p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div className="text-center py-16"
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl mb-3">📋</motion.div>
              <p className="text-white/30 text-sm">No {filter} requests found</p>
            </motion.div>
          ) : (
            <motion.div className="space-y-3" key={filter}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <AnimatePresence>
                {filtered.map((leave, i) => (
                  <LeaveCard
                    key={leave._id}
                    leave={leave}
                    index={i}
                    updating={updating}
                    onApprove={() => updateStatus(leave._id, "approved")}
                    onReject={() => updateStatus(leave._id, "rejected")}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HRPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hr_auth") === "true") setAuthed(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("hr_auth");
    setAuthed(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!authed ? (
        <motion.div key="login"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}>
          <HRLogin onLogin={() => setAuthed(true)} />
        </motion.div>
      ) : (
        <motion.div key="dashboard"
          initial={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}>
          <HRDashboard onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}