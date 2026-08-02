"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ScanSearch,
  ListTree,
  Sparkles as SparklesIcon,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";

interface Step {
  label: string;
  detail: string;
  icon: typeof Search;
  /** Roughly when this step should feel "active", in seconds since start. */
  at: number;
}

// Timing mirrors the SRS's own estimate for a typical run (~15-30s):
// step 1 immediately, step 2 around 3s in, step 3 around 10s in. The
// remaining steps are spaced out so the sequence keeps moving even if
// the real request runs long, without ever claiming to be done early.
const STEPS: Step[] = [
  { label: "Preparing request", detail: "Validating your keyword", icon: Search, at: 0 },
  { label: "Fetching Google results", detail: "Pulling the current top 10 rankings", icon: ScanSearch, at: 2 },
  { label: "Analyzing competitor pages", detail: "Reading headings, word counts and FAQs", icon: ListTree, at: 6 },
  { label: "Finding content gaps", detail: "Spotting what the top pages miss", icon: FileCheck2, at: 12 },
  { label: "Generating your content brief", detail: "Claude is drafting the outline", icon: SparklesIcon, at: 18 },
];

const TOTAL_ESTIMATE = 26; // seconds, used only to drive the progress bar

export default function GenerationOverlay({ keyword }: { keyword: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    return () => clearInterval(id);
  }, []);

  const activeIndex = STEPS.reduce(
    (acc, step, i) => (elapsed >= step.at ? i : acc),
    0
  );
  const progressPct = Math.min(96, (elapsed / TOTAL_ESTIMATE) * 100);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm"
    >
      {/* Ambient scanning grid — the signature visual for "analysis in progress" */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-grid-dots opacity-40">
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100vh" }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-[var(--accent)]/10 to-transparent"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl sm:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          Generating brief
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
          &ldquo;{keyword}&rdquo;
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This usually takes 15&ndash;30 seconds. Please don&apos;t close this tab.
        </p>

        <div className="mt-8 space-y-1">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < activeIndex;
            const isActive = i === activeIndex;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors ${
                  isActive ? "bg-[var(--accent-soft)]" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isDone
                      ? "border-transparent bg-[var(--success-soft)] text-[var(--success)]"
                      : isActive
                        ? "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isDone ? (
                      <motion.span key="done" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <CheckCircle2 size={18} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pending"
                        animate={isActive ? { scale: [1, 1.12, 1] } : {}}
                        transition={isActive ? { duration: 1.4, repeat: Infinity } : {}}
                      >
                        <Icon size={17} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isActive || isDone ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="truncate text-xs text-[var(--muted)]"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-[var(--accent)]"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
            <span>{Math.min(99, Math.round(progressPct))}%</span>
            <span>{Math.round(elapsed)}s elapsed</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
