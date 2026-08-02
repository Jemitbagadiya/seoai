"use client";

import { motion } from "framer-motion";
import Skeleton from "./ui/Skeleton";

/**
 * Shown briefly on the results page while the saved report is
 * fetched by id. The heavy multi-step generation experience lives in
 * GenerationOverlay (shown earlier, while /api/analyze is running);
 * this is a fast, near-instant load, so a dashboard-shaped skeleton
 * reads better here than repeating the same step list.
 */
export default function LoadingProgress() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      role="status"
      aria-label="Loading report"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="mt-4 h-3 w-20" />
            <Skeleton className="mt-2 h-6 w-16" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-20 w-full" />
        <Skeleton className="mt-3 h-20 w-full" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-full" />
      </div>
    </motion.div>
  );
}
