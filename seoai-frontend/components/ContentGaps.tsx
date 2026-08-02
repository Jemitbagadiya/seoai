"use client";

import { motion } from "framer-motion";
import { Lightbulb, TrendingUp } from "lucide-react";

import type { ReportData } from "@/lib/types";

interface Props {
  data: ReportData;
}

// Cycle a few accent tones across cards so a long list of gaps stays
// scannable instead of one flat block of identical blue cards.
const tones = [
  { icon: "text-[var(--accent)]", bg: "bg-[var(--accent-soft)]" },
  { icon: "text-[var(--violet)]", bg: "bg-[var(--violet)]/10" },
  { icon: "text-[var(--success)]", bg: "bg-[var(--success-soft)]" },
];

/** Small ring showing gap count against a soft reference ceiling — a
 *  glance-able "how much opportunity is here" signal, not a score. */
function GapRing({ count }: { count: number }) {
  const ceiling = Math.max(6, count);
  const pct = Math.min(1, count / ceiling);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--border)" strokeWidth="5" />
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-[var(--foreground)]">{count}</span>
    </div>
  );
}

export default function ContentGaps({ data }: Props) {
  const gaps = data.content_gaps || [];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
            <TrendingUp size={20} className="text-[var(--accent)]" />
            Content gaps
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Topics your competitors miss &mdash; covering these is your ranking edge.
          </p>
        </div>

        {gaps.length > 0 && <GapRing count={gaps.length} />}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {gaps.map((gap, index) => {
          const tone = tones[index % tones.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-lg border border-[var(--border)] p-4 transition-shadow hover:shadow-md"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone.bg} ${tone.icon}`}>
                <Lightbulb size={16} />
              </div>

              <h3 className="mt-3 font-semibold text-[var(--foreground)]">{gap.topic}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{gap.reason}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
