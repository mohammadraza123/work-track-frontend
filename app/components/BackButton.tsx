"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export default function BackButton({ label = "Back", href, className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => (href ? router.push(href) : router.back())}
      className={`flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group ${className}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="w-8 h-8 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center group-hover:bg-white/12 group-hover:border-white/20 transition-all"
        whileHover={{ rotateY: -20, scale: 1.08 }}
        style={{ transformStyle: "preserve-3d", perspective: 300 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </motion.span>
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}