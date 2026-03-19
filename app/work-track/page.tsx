"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function WorkTrack() {
  const time = useClock();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // elapsed timer
  useEffect(() => {
    if (!checkedIn || !checkInTime) return;
    const interval = setInterval(() => {
      const [h, m, s] = checkInTime.split(":").map(Number);
      const startMs = new Date();
      startMs.setHours(h, m, s, 0);
      const diff = Math.floor((Date.now() - startMs.getTime()) / 1000);
      const eh = Math.floor(diff / 3600).toString().padStart(2, "0");
      const em = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
      const es = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${eh}:${em}:${es}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [checkedIn, checkInTime]);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setCheckInTime(`${hours}:${minutes}:${seconds}`);
    setElapsed("00:00:00");
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckInTime(null);
    setElapsed("00:00:00");
  };

  return (
    <div className="min-h-screen bg-[#1e2035] flex flex-col">
      {/* subtle grid bg */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col max-w-sm mx-auto w-full px-5 pt-12 pb-8 gap-5">

        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">
              Good {time.getHours() < 12 ? "Morning" : time.getHours() < 17 ? "Afternoon" : "Evening"}
            </p>
            <h1 className="text-white text-xl font-bold">WorkTrack</h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#32364f] border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* Clock Card */}
        <div className="bg-[#292c43] border border-white/8 rounded-3xl p-7 text-center relative overflow-hidden">
          {/* glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-white/[0.03] blur-2xl pointer-events-none" />

          <p className="text-white/30 text-xs uppercase tracking-widest font-mono mb-3">
            {dateStr}
          </p>

          {/* Time */}
          <div className="flex items-end justify-center gap-1">
            <span className="text-white font-mono font-light leading-none" style={{ fontSize: "clamp(52px,15vw,68px)" }}>
              {hours}:{minutes}
            </span>
            <span className="text-white/25 font-mono text-2xl pb-2">{seconds}</span>
          </div>

          {/* Status pill */}
          <div className="mt-5 flex justify-center">
            {checkedIn ? (
              <span className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Checked In · {checkInTime}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-white/5 text-white/30 text-xs font-semibold px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Not Checked In
              </span>
            )}
          </div>
        </div>

        {/* Elapsed time (only when checked in) */}
        {checkedIn && (
          <div className="bg-[#292c43] border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Time Elapsed</p>
              <p className="text-white font-mono text-2xl font-light">{elapsed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
          </div>
        )}

        {/* Check In / Out Button */}
        <button
          onClick={checkedIn ? handleCheckOut : handleCheckIn}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98] ${
            checkedIn
              ? "bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20"
              : "bg-white text-[#1e2035] hover:bg-white/90 shadow-lg"
          }`}
        >
          {checkedIn ? "✕  Check Out" : "→  Check In"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/20 text-xs uppercase tracking-widest">Quick Access</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/leave"
            className="bg-[#292c43] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:bg-[#32364f] transition-all duration-200 active:scale-[0.98] group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-3 group-hover:bg-white/12 transition">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">Leave</p>
            <p className="text-white/35 text-xs mt-0.5">Apply & track</p>
          </Link>

          <Link
            href="/hr"
            className="bg-[#292c43] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:bg-[#32364f] transition-all duration-200 active:scale-[0.98] group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-3 group-hover:bg-white/12 transition">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">HR Portal</p>
            <p className="text-white/35 text-xs mt-0.5">Manage leaves</p>
          </Link>
        </div>

        {/* Today's summary row */}
        <div className="bg-[#292c43] border border-white/8 rounded-2xl px-5 py-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Today's Summary</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Check In", value: checkInTime ?? "--:--" },
              { label: "Check Out", value: checkedIn ? "--:--" : checkInTime ? `${hours}:${minutes}` : "--:--" },
              { label: "Hours", value: checkedIn ? elapsed.slice(0, 5) : "0:00" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white font-mono text-sm font-medium">{value}</p>
                <p className="text-white/30 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}