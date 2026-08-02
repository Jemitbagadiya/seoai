"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Badge from "./ui/Badge";
import type { ReportData } from "@/lib/types";

interface Props {
  data: ReportData;
}

const importanceTone: Record<string, "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

/**
 * Renders `faq_suggestions` from the Claude brief schema (Section 3.4
 * of the SRS). The original frontend fetched this field but never
 * displayed it — this fills that gap without touching the API layer.
 */
export default function FaqSuggestions({ data }: Props) {
  const faqs = data.faq_suggestions || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
        <HelpCircle size={20} className="text-[var(--accent)]" />
        FAQ opportunities
      </h2>
      <p className="mb-5 text-sm text-[var(--muted)]">
        Questions worth answering directly in your article.
      </p>

      <div className="divide-y divide-[var(--border)]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="font-medium text-[var(--foreground)]">{faq.question}</span>

                <span className="flex shrink-0 items-center gap-3">
                  <Badge tone={importanceTone[faq.importance] ?? "neutral"} className="capitalize">
                    {faq.importance}
                  </Badge>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-[var(--muted)]" />
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-sm text-[var(--muted)]">
                      Consider covering this in a dedicated section or FAQ block &mdash; it&apos;s a
                      common question searchers ask around this topic.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
