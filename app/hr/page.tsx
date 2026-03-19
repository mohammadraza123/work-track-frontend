"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Leave } from "../types/leave";
import StatusBadge from "../components/leave/StatusBadge";
import { diffDays, formatDate } from "../utils/leaveHelpers";


// ─── Hardcoded HR credentials ─────────────────────────────────────────────────
const HR_EMAIL = "hr@company.com";
const HR_PASSWORD = "hr1234";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Login Screen ─────────────────────────────────────────────────────────────
function HRLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-[#292c43] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-all";

  const handleLogin = () => {
    if (email === HR_EMAIL && password === HR_PASSWORD) {
      sessionStorage.setItem("hr_auth", "true");
      onLogin();
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#32364f] border border-white/10 rounded-3xl p-8">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z" />
              <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">HR Portal</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage leave requests</p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={inputClass}
          />

          {error && (
            <p className="text-red-400 text-sm px-1">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-white text-[#292c43] font-bold text-sm hover:bg-white/90 transition active:scale-[0.98] mt-2"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
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
    all:      leaves.length,
    pending:  leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  const filtered = filter === "all" ? leaves : leaves.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-[#292c43]">
      <div className="max-w-xl mx-auto px-4 pt-8 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">HR Dashboard</h1>
            <p className="text-white/40 text-sm mt-0.5">Manage employee leave requests</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Stats — clickable filters */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {([
            { key: "all",      label: "All",      value: stats.all,      color: "text-white" },
            { key: "pending",  label: "Pending",  value: stats.pending,  color: "text-yellow-400" },
            { key: "approved", label: "Approved", value: stats.approved, color: "text-emerald-400" },
            { key: "rejected", label: "Rejected", value: stats.rejected, color: "text-red-400" },
          ] as const).map(({ key, label, value, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`bg-[#32364f] border rounded-2xl p-3 text-center transition ${
                filter === key ? "border-white/30" : "border-white/8 hover:border-white/15"
              }`}
            >
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Leave list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="w-8 h-8 animate-spin text-white/30" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">No {filter} requests found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((leave) => (
              <div key={leave._id} className="bg-[#32364f] border border-white/8 rounded-2xl p-4">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-white font-medium text-sm leading-snug flex-1">
                    {leave.reason}
                  </p>
                  <StatusBadge status={leave.status} />
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span>{formatDate(leave.startDate)} → {formatDate(leave.endDate)}</span>
                  <span>·</span>
                  <span>{diffDays(leave.startDate, leave.endDate)} day(s)</span>
                </div>

                {/* Approve / Reject — only for pending */}
<div className="flex gap-2">
  <button
    disabled={updating === leave._id || leave.status === "approved"}
    onClick={() => updateStatus(leave._id, "approved")}
    className="flex-1 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    {updating === leave._id ? "..." : "✓ Approve"}
  </button>
  <button
    disabled={updating === leave._id || leave.status === "rejected"}
    onClick={() => updateStatus(leave._id, "rejected")}
    className="flex-1 py-2 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-semibold hover:bg-red-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    {updating === leave._id ? "..." : "✕ Reject"}
  </button>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page — ties login + dashboard together ───────────────────────────────────
export default function HRPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hr_auth") === "true") setAuthed(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("hr_auth");
    setAuthed(false);
  };

  if (!authed) return <HRLogin onLogin={() => setAuthed(true)} />;
  return <HRDashboard onLogout={handleLogout} />;
}