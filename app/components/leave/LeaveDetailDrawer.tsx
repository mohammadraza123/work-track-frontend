import { Leave } from "@/app/types/leave";
import { diffDays, formatDate, statusConfig } from "@/app/utils/leaveHelpers";

interface Props {
  leave: Leave;
  onClose: () => void;
}

export default function LeaveDetailDrawer({ leave, onClose }: Props) {
  const cfg = statusConfig[leave.status];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#32364f] border border-white/10 rounded-3xl p-6 shadow-2xl animate-[slideUp_0.25s_ease]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition text-white/60"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Leave Details</h3>
        <p className="text-white/40 text-xs mb-5">ID: {leave._id}</p>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${cfg.bg} border ${cfg.border} mb-5`}>
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`font-semibold ${cfg.text}`}>{cfg.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Start Date", value: formatDate(leave.startDate) },
            { label: "End Date", value: formatDate(leave.endDate) },
            { label: "Duration", value: `${diffDays(leave.startDate, leave.endDate)} day(s)` },
            { label: "Applied On", value: formatDate(leave.createdAt) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#292c43] rounded-xl p-3 border border-white/8">
              <p className="text-white/40 text-xs mb-1">{label}</p>
              <p className="text-white text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#292c43] rounded-xl p-4 border border-white/8">
          <p className="text-white/40 text-xs mb-2">Reason</p>
          <p className="text-white text-sm leading-relaxed">{leave.reason}</p>
        </div>
      </div>
    </div>
  );
}