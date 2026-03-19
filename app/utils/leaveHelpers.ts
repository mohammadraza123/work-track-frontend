export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const diffDays = (start: string, end: string) => {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(ms / 86400000) + 1;
};

export const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
    border: "border-yellow-400/20",
  },
  approved: {
    label: "Approved",
    bg: "bg-emerald-400/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    border: "border-emerald-400/20",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-400/10",
    text: "text-red-400",
    dot: "bg-red-400",
    border: "border-red-400/20",
  },
};