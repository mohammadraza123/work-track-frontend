"use client";

import { useState, useEffect } from "react";
import { Leave } from "../types/leave";
import { getAllLeaves, getLeaveById } from "../lib/leaveApi";
import RequestForm from "../components/leave/RequestForm";
import LeaveCard from "../components/leave/LeaveCard";
import LeaveDetailDrawer from "../components/leave/LeaveDetailDrawer";
import { useSelector } from "react-redux";


export default function LeavePage() {
  const [tab, setTab] = useState<"my-leaves" | "request">("my-leaves");
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Leave | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
const user = useSelector((state: any) => state.api.user);

console.log("user: ", user)

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getLeaveById({id:user?._id});
      setLeaves(res.data?.data || []);
      console.log("leave by id res: ", res)
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user?._id){
    fetchLeaves();

    }
  }, [user]);

  const handleSuccess = () => {
    setSuccessMsg("Leave request submitted successfully!");
    setTab("my-leaves");
    fetchLeaves();
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-[#292c43]">
        <div className="max-w-xl mx-auto px-4 pt-8 pb-24">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Leave Management</h1>
            <p className="text-white/40 text-sm mt-0.5">Manage and track your leave requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { label: "Total",    value: stats.total,    color: "text-white" },
              { label: "Pending",  value: stats.pending,  color: "text-yellow-400" },
              { label: "Approved", value: stats.approved, color: "text-emerald-400" },
              { label: "Rejected", value: stats.rejected, color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#32364f] border border-white/8 rounded-2xl p-3 text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Success toast */}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3 animate-fade-in">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-emerald-400 text-sm font-medium">{successMsg}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-[#32364f] border border-white/8 rounded-2xl p-1 flex mb-6">
            {([
              { key: "my-leaves", label: "My Leaves" },
              { key: "request",   label: "New Request" },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  tab === key
                    ? "bg-white text-[#292c43] shadow"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {tab === "request" ? (
            <div className="bg-[#32364f] border border-white/10 rounded-3xl p-5 animate-fade-in">
              <h2 className="text-white font-bold text-base mb-4">Apply for Leave</h2>
              <RequestForm onSuccess={handleSuccess} onCancel={() => setTab("my-leaves")} />
            </div>
          ) : (
            <div className="animate-fade-in">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <svg className="w-8 h-8 animate-spin text-white/30" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-white/30 text-sm">Loading leaves...</p>
                </div>
              ) : leaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#32364f] border border-white/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm">No leave requests yet</p>
                  <button onClick={() => setTab("request")} className="text-white text-sm font-semibold hover:underline">
                    Apply for your first leave →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaves.map((leave) => (
                    <LeaveCard key={leave._id} leave={leave} onClick={() => setSelected(leave)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAB */}
        {tab === "my-leaves" && (
          <div className="fixed bottom-6 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:translate-x-[220px]">
            <button
              onClick={() => setTab("request")}
              className="flex items-center gap-2 bg-white text-[#292c43] font-bold text-sm px-5 py-3 rounded-2xl shadow-xl hover:bg-white/90 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Request
            </button>
          </div>
        )}
      </div>

      {selected && (
        <LeaveDetailDrawer leave={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
