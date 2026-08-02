"use client";

import { ExternalLink, Users } from "lucide-react";
import Badge from "./ui/Badge";
import type { ReportData } from "@/lib/types";

interface Props {
  data: ReportData;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function CompetitorTable({ data }: Props) {
  const competitors = data.competitor_analysis || [];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
        <Users size={20} className="text-[var(--accent)]" />
        Competitor analysis
      </h2>
      <p className="mb-5 text-sm text-[var(--muted)]">The top-ranking pages we analyzed for this keyword.</p>

      {/* Table on larger screens */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
              <th className="py-3 pr-4 font-medium">Page</th>
              <th className="py-3 pr-4 font-medium">Word count</th>
              <th className="py-3 font-medium">Key topics</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((item, index) => (
              <tr key={index} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-muted)]">
                <td className="py-3 pr-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] hover:underline"
                  >
                    {hostname(item.url)}
                    <ExternalLink size={13} />
                  </a>
                </td>
                <td className="py-3 pr-4 text-[var(--foreground)]">{item.word_count.toLocaleString()}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.key_topics.map((topic, i) => (
                      <Badge key={i} tone="neutral">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards on small screens */}
      <div className="space-y-3 md:hidden">
        {competitors.map((item, index) => (
          <div key={index} className="rounded-lg border border-[var(--border)] p-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] hover:underline"
            >
              {hostname(item.url)}
              <ExternalLink size={13} />
            </a>
            <p className="mt-1 text-xs text-[var(--muted)]">{item.word_count.toLocaleString()} words</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.key_topics.map((topic, i) => (
                <Badge key={i} tone="neutral">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
