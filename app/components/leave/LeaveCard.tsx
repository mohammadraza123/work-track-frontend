import { Leave } from "@/app/types/leave";
import StatusBadge from "./StatusBadge";
import { diffDays, formatDate } from "@/app/utils/leaveHelpers";

interface Props {
  leave: Leave;
  onClick: () => void;
}

export default function LeaveCard({ leave, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[#32364f] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:bg-[#3a3e5c] transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-white font-medium text-sm leading-snug line-clamp-2 flex-1">
          {leave.reason}
        </p>
        <StatusBadge status={leave.status} />
      </div>
      <div className="flex items-center gap-4 text-white/40 text-xs">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          {diffDays(leave.startDate, leave.endDate)}d
        </span>
      </div>
    </button>
  );
}