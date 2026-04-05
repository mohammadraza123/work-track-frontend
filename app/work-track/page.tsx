"use client";

import { checkIn, checkOut, getAttendence } from "@/redux/apiSlice";
import { AppDispatch } from "@/redux/rootReducer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocationTracking } from "../hooks/useLocationTracking";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}



export default function WorkTrack() {
  const dispatch = useDispatch<AppDispatch>();
  const time = useClock();

//for location tracking
const { startTracking, stopTracking } = useLocationTracking({
  intervalMinutes: 5,
  onLocationUpdate: (entry) => {
    // Just console log for now — replace with API call later
    console.log("📍 Employee location:", {
      lat: entry.lat,
      lng: entry.lng,
      time: entry.timestamp.toLocaleTimeString(),
    });
  },
});

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [todayData, setTodayData] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadData, setLoadData] = useState(true);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // ✅ Fetch today's attendance on mount
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const data = await dispatch(getAttendence(""))?.unwrap();
        setTodayData(data);

        // Check if user is checked in
        if (data?.checkIn) {
          const d = new Date(data.checkIn);
          setCheckInTime(
            `${d.getHours().toString().padStart(2, "0")}:${d
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`,
          );
          setCheckedIn(!data.checkOut);
        }

        // Disable button if checked out
        if (data?.checkOut) {
          setIsCompleted(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadData(false);
      }
    };

    fetchToday();
  }, [dispatch]);

  // ✅ Elapsed timer
  useEffect(() => {
    if (!checkedIn || !checkInTime) return;

    const interval = setInterval(() => {
      const [h, m, s] = checkInTime.split(":").map(Number);
      const start = new Date();
      start.setHours(h, m, s, 0);

      const diff = Math.floor((Date.now() - start.getTime()) / 1000);
      const eh = Math.floor(diff / 3600)
        .toString()
        .padStart(2, "0");
      const em = Math.floor((diff % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const es = (diff % 60).toString().padStart(2, "0");

      setElapsed(`${eh}:${em}:${es}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkedIn, checkInTime]);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // next midnight
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setCheckedIn(false);
      setCheckInTime(null);
      setElapsed("00:00:00");
      setIsCompleted(false);
      setTodayData(null);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [todayData]);

  // ✅ Format time
  const formatTime = (date: string) => {
    if (!date) return "--:--";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ✅ Check-In
  const handleCheckIn = async () => {
    try {
      const res = await dispatch(checkIn("")).unwrap();
      setCheckedIn(true);
      const d = new Date(res.checkIn);
      setCheckInTime(
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`,
      );
      setTodayData(res);
      startTracking(); // Start location tracking on check-in
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Check-Out
  const handleCheckOut = async () => {
    try {
      const res = await dispatch(checkOut("")).unwrap();
      setCheckedIn(false);
      setElapsed("00:00:00");
      setIsCompleted(true);
      setTodayData(res); // store latest checkOut
      stopTracking();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const data = await dispatch(getAttendence(""))?.unwrap();
        setTodayData(data);

        if (data?.checkIn) {
          const d = new Date(data.checkIn);
          setCheckInTime(
            `${d.getHours().toString().padStart(2, "0")}:${d
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`,
          );
          setCheckedIn(!data.checkOut);

          if (!data.checkOut) {
            startTracking(); // 👈 resume tracking if already checked in
          }
        }

        if (data?.checkOut) setIsCompleted(true);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadData(false);
      }
    };

    fetchToday();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#1e2035] flex flex-col">
      {/* Grid BG */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col max-w-sm mx-auto w-full px-5 pt-12 pb-8 gap-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Good{" "}
              {time.getHours() < 12
                ? "Morning"
                : time.getHours() < 17
                  ? "Afternoon"
                  : "Evening"}
            </p>
            <h1 className="text-white text-xl font-bold">WorkTrack</h1>
          </div>
        </div>

        {/* CLOCK */}
        <div className="bg-[#292c43] rounded-3xl p-7 text-center">
          <p className="text-white/30 text-xs mb-3">{dateStr}</p>

          <div className="flex items-end justify-center text-white font-mono">
            <span className="text-6xl tracking-wider">
              {hours}:{minutes}
            </span>
            <span className="text-2xl text-white/40 mb-1 ml-1">:{seconds}</span>
          </div>

          <div className="mt-4">
            {checkedIn ? (
              <span className="text-green-400 text-xs">
                Checked In · {checkInTime}
              </span>
            ) : (
              <span className="text-white/30 text-xs">Not Checked In</span>
            )}
          </div>
        </div>

        {/* ELAPSED */}
        {checkedIn && (
          <div className="bg-[#292c43] p-4 rounded-xl text-white">
            Time: {elapsed}
          </div>
        )}

        {/* BUTTON */}
        <button
          disabled={isCompleted || loadData}
          onClick={checkedIn ? handleCheckOut : handleCheckIn}
          className={`w-full py-4 rounded-xl ${
            isCompleted
              ? "bg-gray-500 text-gray-300"
              : checkedIn
                ? "bg-red-400 text-white"
                : "bg-white text-black"
          }`}
        >
          {isCompleted
            ? "Completed Today"
            : checkedIn
              ? "Check Out"
              : "Check In"}
        </button>

        {/* QUICK ACCESS */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/20 text-xs uppercase tracking-widest">
            Quick Access
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/leave"
            className="bg-[#292c43] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:bg-[#32364f] transition-all duration-200 active:scale-[0.98] group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-3 group-hover:bg-white/12 transition">
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
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
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">HR Portal</p>
            <p className="text-white/35 text-xs mt-0.5">Manage leaves</p>
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="bg-[#292c43] p-4 rounded-xl text-center text-white">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Today's Summary
          </p>
          <div className="flex justify-between text-sm">
            <div>
              <p>{formatTime(todayData?.checkIn)}</p>
              <span className="text-xs text-white/40">Check In</span>
            </div>

            <div>
              <p>{formatTime(todayData?.checkOut)}</p>
              <span className="text-xs text-white/40">Check Out</span>
            </div>

            <div>
              <p>
                {todayData?.totalHours ? `${todayData.totalHours}h` : "0:00"}
              </p>
              <span className="text-xs text-white/40">Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
