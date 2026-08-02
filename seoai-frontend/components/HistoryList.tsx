"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Clock, FileSearch } from "lucide-react";
import { getReports } from "@/lib/api";
import type { ReportSummaryItem } from "@/lib/types";
import Input from "./ui/Input";
import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";

type SortOrder = "newest" | "oldest" | "az";

export default function HistoryList() {
  const router = useRouter();

  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount: setState happens inside the async callback
    // after the network call resolves, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReports();
  }, [loadReports]);

  const visibleReports = useMemo(() => {
    const filtered = reports.filter((r) =>
      r.keyword.toLowerCase().includes(query.trim().toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sort === "az") return a.keyword.localeCompare(b.keyword);
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [reports, query, sort]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-3 h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load your history"
        description="Check your connection and try again."
        onRetry={loadReports}
      />
    );
  }

  if (reports.length === 0) {
    return (
      <EmptyState
        icon={<FileSearch size={32} />}
        title="No reports yet"
        description="Generate your first SEO content brief and it'll show up here."
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:max-w-xs">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword"
            icon={<Search size={16} />}
            aria-label="Search report history"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="sort" className="text-[var(--muted)]">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Keyword A&ndash;Z</option>
          </select>
        </div>
      </div>

      {visibleReports.length === 0 ? (
        <EmptyState title="No matches" description={`Nothing found for "${query}".`} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {visibleReports.map((report, i) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card
                  className="group flex h-full cursor-pointer flex-col justify-between"
                  onClick={() => router.push(`/results/${report.id}`)}
                >
                  <div>
                    <h3 className="line-clamp-2 font-semibold text-[var(--foreground)]">{report.keyword}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <Clock size={13} />
                      {new Date(report.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                    View report
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
