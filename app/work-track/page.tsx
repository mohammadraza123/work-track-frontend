"use client";
import Cookies from "js-cookie";

import {
  checkIn,
  checkOut,
  getAttendence,
  addLocation,
} from "@/redux/apiSlice";
import { AppDispatch } from "@/redux/rootReducer";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocationTracking } from "../hooks/useLocationTracking";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

/** 3D tilt hook — attach to any card */
function use3DTilt(strength = 15) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 300, damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 300, damping: 30,
  });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

export default function WorkTrack() {
  const dispatch = useDispatch<AppDispatch>();
  const time = useClock();

  const { startTracking, stopTracking } = useLocationTracking({
    intervalMinutes: 5,
    onLocationUpdate: (entry) => {
      dispatch(addLocation({ locationName: entry.locationName }));
    },
  });

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [todayData, setTodayData] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const clockTilt = use3DTilt(10);
  const summaryTilt = use3DTilt(8);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const saved = localStorage.getItem("attendance");
    if (saved) {
      const data = JSON.parse(saved);
      setTodayData(data);
      if (data?.checkIn) {
        const d = new Date(data.checkIn);
        const timeStr = `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
        setCheckInTime(timeStr);
        setCheckedIn(!data.checkOut);
        setIsCompleted(!!data.checkOut);
      }
    }
    setInitialized(true);
    setTimeout(() => setIsInitialLoading(false), 800);
  }, []);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        setIsSyncing(true);
        const data = await dispatch(getAttendence(""))?.unwrap();
        setTodayData((prev: any) => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) return data;
          return prev;
        });
        if (data?.checkIn) {
          const d = new Date(data.checkIn);
          const timeStr = `${d.getHours().toString().padStart(2, "0")}:${d
            .getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
          setCheckInTime(timeStr);
          setCheckedIn(!data.checkOut);
          if (!data.checkOut) startTracking();
        }
        if (data?.checkOut) setIsCompleted(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsSyncing(false);
      }
    };
    fetchToday();
  }, [dispatch]);

  useEffect(() => {
    if (todayData) localStorage.setItem("attendance", JSON.stringify(todayData));
  }, [todayData]);

  useEffect(() => {
    if (!checkedIn || !checkInTime) return;
    const interval = setInterval(() => {
      const [h, m, s] = checkInTime.split(":").map(Number);
      const start = new Date();
      start.setHours(h, m, s, 0);
      const diff = Math.floor((Date.now() - start.getTime()) / 1000);
      const eh = Math.floor(diff / 3600).toString().padStart(2, "0");
      const em = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
      const es = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${eh}:${em}:${es}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [checkedIn, checkInTime]);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeout = setTimeout(() => {
      setCheckedIn(false);
      setCheckInTime(null);
      setElapsed("00:00:00");
      setIsCompleted(false);
      setTodayData(null);
      localStorage.removeItem("attendance");
    }, tomorrow.getTime() - now.getTime());
    return () => clearTimeout(timeout);
  }, [todayData]);

  const formatTime = (date: string) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
  };

  const handleCheckIn = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      const res = await dispatch(checkIn("")).unwrap();
      setCheckedIn(true);
      const d = new Date(res.checkIn);
      const timeStr = `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
      setCheckInTime(timeStr);
      setTodayData(res);
      startTracking();
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await dispatch(checkOut("")).unwrap();
      setCheckedIn(false);
      setElapsed("00:00:00");
      setIsCompleted(true);
      setTodayData(res?.data);
      stopTracking();
    } catch (err) {
      console.log(err);
    }
  };

const router = useRouter();

const handleLogout = () => {
  localStorage.clear();
  Cookies.remove("token"); 
  router.push("/");
};

  const buttonText = isCompleted
    ? "Completed Today"
    : checkedIn ? "Check Out" : "Check In";

  return (
    <div className="min-h-screen bg-[#1e2035] flex flex-col relative overflow-hidden">

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

<motion.button
  onClick={handleLogout}
  className="w-full py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium relative overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.55 }}
  whileHover={{
    scale: 1.02,
    rotateX: 3,
    borderColor: "rgba(255,255,255,0.25)",
    color: "rgba(255,255,255,0.9)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
  }}
  whileTap={{ scale: 0.97, rotateX: -1 }}
  style={{ transformStyle: "preserve-3d", perspective: 500 }}
>
  <motion.span
    className="absolute inset-0 rounded-xl pointer-events-none"
    style={{
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
      backgroundSize: "200% 100%",
    }}
    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  />
  <span className="flex items-center justify-center gap-2">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
    Log Out
  </span>
</motion.button>

      <motion.div
        className="fixed w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
        animate={{ x: [0, 60, -30, 0], y: [0, -50, 70, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-5%", left: "-5%", zIndex: 0 }}
      />
      <motion.div
        className="fixed w-56 h-56 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
        animate={{ x: [0, -50, 40, 0], y: [0, 60, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ bottom: "5%", right: "-5%", zIndex: 0 }}
      />

      {/* Full-screen loader */}
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e2035]/95 backdrop-blur-xl"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* 3D spinning ring */}
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
              />
              <motion.p
                className="text-white/60 text-sm"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading your attendance...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-sm mx-auto w-full px-5 pt-12 pb-8 gap-5">

        {/* CLOCK CARD — 3D tilt */}
        <motion.div
          className="bg-[#292c43] rounded-3xl p-7 text-center cursor-default"
          style={{
            rotateX: clockTilt.rotateX,
            rotateY: clockTilt.rotateY,
            transformStyle: "preserve-3d",
            perspective: 800,
          }}
          onMouseMove={clockTilt.onMouseMove}
          onMouseLeave={clockTilt.onMouseLeave}
          initial={{ opacity: 0, y: 40, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Inner 3D shine layer */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
              transform: "translateZ(4px)",
            }}
          />

          <p className="text-white/30 text-xs mb-3">{dateStr}</p>

          <div
            className="flex items-end justify-center text-white font-mono"
            style={{ transform: "translateZ(20px)" }}
          >
            <motion.span
              className="text-6xl"
              key={`${hours}:${minutes}`}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {hours}:{minutes}
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.span
                key={seconds}
                className="text-2xl text-white/40 ml-1"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                :{seconds}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-4" style={{ transform: "translateZ(12px)" }}>
            <AnimatePresence mode="wait">
              {checkedIn ? (
                <motion.span
                  key="checked-in"
                  className="text-green-400 text-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Checked In · {checkInTime}
                </motion.span>
              ) : (
                <motion.span
                  key="not-checked"
                  className="text-white/30 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Not Checked In
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CHECK IN/OUT BUTTON */}
        <motion.button
          disabled={!initialized || isCompleted || isProcessing}
          onClick={checkedIn ? handleCheckOut : handleCheckIn}
          className={`w-full py-4 rounded-xl font-semibold text-base relative overflow-hidden ${
            isCompleted
              ? "bg-gray-500 text-gray-300"
              : checkedIn
                ? "bg-red-400 text-white"
                : "bg-white text-black"
          } ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
          whileHover={!isCompleted && !isProcessing ? {
            scale: 1.03,
            rotateX: 4,
            boxShadow: checkedIn
              ? "0 10px 40px rgba(248,113,113,0.4)"
              : "0 10px 40px rgba(255,255,255,0.25)",
            transition: { type: "spring", stiffness: 400, damping: 20 },
          } : {}}
          whileTap={!isCompleted && !isProcessing ? {
            scale: 0.97,
            rotateX: -2,
          } : {}}
          style={{ transformStyle: "preserve-3d", perspective: 600 }}
        >
          {/* Ripple shimmer on button */}
          {!isCompleted && !isProcessing && (
            <motion.span
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          <AnimatePresence mode="wait">
            <motion.span
              key={buttonText}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {isProcessing ? "Please wait..." : buttonText}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* QUICK LINK CARDS */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              href: "/leave",
              label: "Leave",
              sub: "Apply & track",
              delay: 0.3,
              icon: (
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
                </svg>
              ),
            },
            {
              href: "/hr",
              label: "HR Portal",
              sub: "Manage leaves",
              delay: 0.38,
              icon: (
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
            },
          ].map(({ href, label, sub, delay, icon }) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 24, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay }}
              whileHover={{
                rotateY: 6,
                rotateX: -4,
                scale: 1.04,
                z: 20,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.97, rotateY: 0 }}
              style={{ transformStyle: "preserve-3d", perspective: 500 }}
            >
              <Link
                href={href}
                className="bg-[#292c43] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:bg-[#32364f] transition-colors duration-200 group block relative overflow-hidden"
              >
                {/* 3D shine */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)",
                  }}
                />
                <div
                  className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-3 group-hover:bg-white/12 transition"
                  style={{ transform: "translateZ(8px)" }}
                >
                  {icon}
                </div>
                <p className="text-white font-semibold text-sm" style={{ transform: "translateZ(6px)" }}>
                  {label}
                </p>
                <p className="text-white/35 text-xs mt-0.5" style={{ transform: "translateZ(4px)" }}>
                  {sub}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* SUMMARY CARD — 3D tilt */}
        <motion.div
          className="bg-[#292c43] p-4 rounded-xl text-center text-white relative overflow-hidden cursor-default"
          style={{
            rotateX: summaryTilt.rotateX,
            rotateY: summaryTilt.rotateY,
            transformStyle: "preserve-3d",
            perspective: 600,
          }}
          onMouseMove={summaryTilt.onMouseMove}
          onMouseLeave={summaryTilt.onMouseLeave}
          initial={{ opacity: 0, y: 30, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.45 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Shine overlay */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)",
              transform: "translateZ(4px)",
            }}
          />

          <p className="text-white/40 text-xs mb-3" style={{ transform: "translateZ(8px)" }}>
            Today's Summary
          </p>

          <div className="flex justify-between text-sm" style={{ transform: "translateZ(12px)" }}>
            <div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={todayData?.checkIn ?? "ci"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {todayData ? formatTime(todayData.checkIn) : "--:--"}
                </motion.p>
              </AnimatePresence>
              <span className="text-xs text-white/40">Check In</span>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={todayData?.checkOut ?? "co"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {todayData ? formatTime(todayData.checkOut) : "--:--"}
                </motion.p>
              </AnimatePresence>
              <span className="text-xs text-white/40">Check Out</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}