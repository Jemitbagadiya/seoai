"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import Card from "./ui/Card";
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

interface TooltipPayloadItem {
  value: number;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[var(--foreground)]">{label}</p>
      <p className="text-[var(--muted)]">{payload[0].value.toLocaleString()} words</p>
    </div>
  );
}

/**
 * Visualizes competitor word counts against the recommended target so
 * the "target_word_count" number from the brief has something to
 * compare against at a glance, instead of sitting alone in a stat card.
 */
export default function WordCountChart({ data }: Props) {
  const competitors = data.competitor_analysis || [];

  if (competitors.length === 0) return null;

  const chartData = competitors.map((item) => ({
    name: hostname(item.url),
    words: item.word_count,
  }));

  return (
    <Card hover={false}>
      <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
        <BarChart3 size={20} className="text-[var(--accent)]" />
        Word count vs. target
      </h2>
      <p className="mb-5 text-sm text-[var(--muted)]">
        How each top-ranking page compares to your{" "}
        <span className="font-medium text-[var(--foreground)]">
          {data.target_word_count?.toLocaleString()}-word
        </span>{" "}
        target.
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--accent-soft)" }} />
            {data.target_word_count && (
              <ReferenceLine
                y={data.target_word_count}
                stroke="var(--accent)"
                strokeDasharray="6 4"
                label={{ value: "Target", position: "right", fill: "var(--accent)", fontSize: 11 }}
              />
            )}
            <Bar dataKey="words" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
