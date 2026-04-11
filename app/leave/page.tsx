"use client";

import { useState, useEffect } from "react";
import { Leave } from "../types/leave";
import { getLeaveById } from "../lib/leaveApi";
import RequestForm from "../components/leave/RequestForm";
import LeaveCard from "../components/leave/LeaveCard";
import LeaveDetailDrawer from "../components/leave/LeaveDetailDrawer";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

function use3DTilt(strength = 10) {
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

// ─── Animated Stat Card ───────────────────────────────────────────────────────
function StatCard({ label, value, color, glow, delay }: {
  label: string; value: number; color: string; glow: string; delay: number;
}) {
  const tilt = use3DTilt(10);
  return (
    <motion.div
      className="bg-[#32364f] border border-white/8 rounded-2xl p-3 text-center relative overflow-hidden cursor-default"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d", perspective: 400 }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity: 0, y: 24, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
      whileHover={{ scale: 1.07, boxShadow: `0 8px 28px ${glow}` }}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
      <motion.p
        className={`text-xl font-bold ${color}`}
        style={{ transform: "translateZ(10px)" }}
        key={value}
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >{value}</motion.p>
      <p className="text-white/40 text-xs mt-0.5" style={{ transform: "translateZ(6px)" }}>{label}</p>
    </motion.div>
  );
}

// ─── Animated Leave Row ───────────────────────────────────────────────────────
function AnimatedLeaveCard({ leave, index, onClick }: { leave: Leave; index: number; onClick: () => void }) {
  const tilt = use3DTilt(7);
  return (
    <motion.div
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d", perspective: 600 }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity: 0, y: 28, rotateX: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: index * 0.06 }}
      whileHover={{ scale: 1.02, z: 10 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Shine */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)" }} />
        <LeaveCard leave={leave} onClick={onClick} />
      </div>
    </motion.div>
  );
}

export default function LeavePage() {
  const [tab, setTab] = useState<"my-leaves" | "request">("my-leaves");
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Leave | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const user = useSelector((state: any) => state.api.user);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getLeaveById({ id: user?._id });
      setLeaves(res.data?.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchLeaves();
  }, [user]);

  const handleSuccess = () => {
    setSuccessMsg("Leave request submitted successfully!");
    setTab("my-leaves");
    fetchLeaves();
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const stats = {
    total:    leaves.length,
    pending:  leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  const statConfig = [
    { label: "Total",    value: stats.total,    color: "text-white",       glow: "rgba(255,255,255,0.12)", delay: 0.15 },
    { label: "Pending",  value: stats.pending,  color: "text-yellow-400",  glow: "rgba(250,204,21,0.18)",  delay: 0.21 },
    { label: "Approved", value: stats.approved, color: "text-emerald-400", glow: "rgba(52,211,153,0.18)",  delay: 0.27 },
    { label: "Rejected", value: stats.rejected, color: "text-red-400",     glow: "rgba(248,113,113,0.18)", delay: 0.33 },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#1e2035] relative overflow-hidden">

        {/* Grid bg */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Ambient orbs */}
        <motion.div className="fixed w-80 h-80 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none"
          animate={{ x: [0, 60, -30, 0], y: [0, -50, 70, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-10%", zIndex: 0 }} />
        <motion.div className="fixed w-60 h-60 rounded-full bg-purple-500/8 blur-3xl pointer-events-none"
          animate={{ x: [0, -50, 40, 0], y: [0, 70, -40, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          style={{ bottom: "5%", right: "-5%", zIndex: 0 }} />

        <div className="relative z-10 max-w-xl mx-auto px-4 pt-8 pb-24">

          {/* Back + Header */}
          <div className="mb-6">
            <div className="mb-4">
              <BackButton label="Home" href="/" />
            </div>
            <motion.h1 className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.08 }}>
              Leave Management
            </motion.h1>
            <motion.p className="text-white/40 text-sm mt-0.5"
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 }}>
              Manage and track your leave requests
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {statConfig.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Success toast */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                className="mb-4 flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3"
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <motion.svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}>
                  <path d="M20 6L9 17l-5-5" />
                </motion.svg>
                <p className="text-emerald-400 text-sm font-medium">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <motion.div
            className="bg-[#292c43] border border-white/8 rounded-2xl p-1 flex mb-6 relative"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, type: "spring", stiffness: 200 }}
          >
            {([
              { key: "my-leaves", label: "My Leaves" },
              { key: "request",   label: "New Request" },
            ] as const).map(({ key, label }) => (
              <motion.button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors relative z-10 ${
                  tab === key ? "text-[#292c43]" : "text-white/50 hover:text-white/80"
                }`}
                whileHover={tab !== key ? { scale: 1.03 } : {}}
                whileTap={{ scale: 0.97 }}
              >
                {tab === key && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-xl z-[-1]"
                    layoutId="tab-pill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {label}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {tab === "request" ? (
              <motion.div
                key="request"
                className="bg-[#292c43] border border-white/10 rounded-3xl p-5 relative overflow-hidden"
                initial={{ opacity: 0, y: 30, rotateX: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                style={{ transformStyle: "preserve-3d", perspective: 800 }}
              >
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)" }} />
                <motion.h2 className="text-white font-bold text-base mb-4"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
                  Apply for Leave
                </motion.h2>
                <RequestForm onSuccess={handleSuccess} onCancel={() => setTab("my-leaves")} />
              </motion.div>
            ) : (
              <motion.div
                key="my-leaves"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <motion.div className="flex flex-col items-center justify-center py-16 gap-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                      className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ transformStyle: "preserve-3d" }}
                    />
                    <motion.p className="text-white/30 text-sm"
                      animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                      Loading leaves...
                    </motion.p>
                  </motion.div>
                ) : leaves.length === 0 ? (
                  <motion.div className="flex flex-col items-center justify-center py-16 gap-3"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-[#292c43] border border-white/10 flex items-center justify-center"
                      animate={{ y: [0, -8, 0], rotateY: [0, 15, 0, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      style={{ transformStyle: "preserve-3d", perspective: 300 }}
                    >
                      <svg className="w-7 h-7 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                      </svg>
                    </motion.div>
                    <p className="text-white/40 text-sm">No leave requests yet</p>
                    <motion.button
                      onClick={() => setTab("request")}
                      className="text-white text-sm font-semibold hover:underline"
                      whileHover={{ scale: 1.05, x: 3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply for your first leave →
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {leaves.map((leave, i) => (
                        <AnimatedLeaveCard
                          key={leave._id}
                          leave={leave}
                          index={i}
                          onClick={() => setSelected(leave)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAB */}
        <AnimatePresence>
          {tab === "my-leaves" && (
            <motion.div
              className="fixed bottom-6 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:translate-x-[220px]"
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <motion.button
                onClick={() => setTab("request")}
                className="flex items-center gap-2 bg-white text-[#292c43] font-bold text-sm px-5 py-3 rounded-2xl shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.06, rotateX: 4, boxShadow: "0 12px 40px rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.95, rotateX: -2 }}
                style={{ transformStyle: "preserve-3d", perspective: 400 }}
              >
                <motion.span
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)", backgroundSize: "200% 100%" }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                  animate={{ rotate: [0, 90, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}>
                  <path d="M12 5v14M5 12h14" />
                </motion.svg>
                New Request
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selected && (
        <LeaveDetailDrawer leave={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}