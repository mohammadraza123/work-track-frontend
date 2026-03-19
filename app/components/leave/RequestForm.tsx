"use client";

import { addLeave } from "@/app/lib/leaveApi";
import { diffDays } from "@/app/utils/leaveHelpers";
import { useState } from "react";


interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RequestForm({ onSuccess, onCancel }: Props) {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-[#292c43] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all";

  const submit = async () => {
    setError("");
    if (!reason.trim() || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }
    setLoading(true);
    try {
      await addLeave({ reason, startDate, endDate });
      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
          Reason
        </label>
        <textarea
          rows={3}
          placeholder="Describe your reason for leave..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/8">
          <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          <p className="text-white/60 text-sm">
            Duration:{" "}
            <span className="text-white font-semibold">
              {diffDays(startDate, endDate)} day(s)
            </span>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-white/15 text-white/60 text-sm font-semibold hover:bg-white/5 transition"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-white text-[#292c43] text-sm font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </div>
  );
}