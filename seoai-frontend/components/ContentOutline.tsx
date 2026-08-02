"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ListTree } from "lucide-react";
import Card from "./ui/Card";
import type { ReportData } from "@/lib/types";

interface Props {
  data: ReportData;
}

export default function ContentOutline({ data }: Props) {
  const outline = data.content_outline || [];
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <Card hover={false}>
      <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
        <ListTree size={20} className="text-[var(--accent)]" />
        Content outline
      </h2>
      <p className="mb-5 text-sm text-[var(--muted)]">The heading structure your article should follow.</p>

      <div className="space-y-3">
        {outline.map((h1, index) => {
          const isOpen = !collapsed.has(index);

          return (
            <div key={index} className="rounded-lg border border-[var(--border)]">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 rounded-lg bg-[var(--accent-soft)] px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  <span className="mr-2 text-[var(--accent)]">{h1.level}</span>
                  {h1.text}
                </span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} className="text-[var(--accent)]" />
                </motion.span>
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
                    <div className="space-y-3 px-4 py-4">
                      {h1.notes && <p className="text-sm italic text-[var(--muted)]">{h1.notes}</p>}

                      {h1.subheadings?.map((h2, h2Index) => (
                        <div key={h2Index} className="ml-2 border-l-2 border-[var(--border)] pl-4">
                          <div className="rounded-md bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
                            <span className="mr-2 text-[var(--muted)]">{h2.level}</span>
                            {h2.text}
                          </div>

                          {h2.subheadings?.map((h3, h3Index) => (
                            <div
                              key={h3Index}
                              className="ml-4 mt-2 rounded-md border-l-2 border-[var(--accent)]/40 bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]"
                            >
                              <span className="mr-2 text-[var(--accent)]">{h3.level}</span>
                              {h3.text}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
