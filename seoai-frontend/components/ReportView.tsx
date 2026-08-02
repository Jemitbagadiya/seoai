"use client";

import toast from "react-hot-toast";
import { Copy, FileDown, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import ReportSummary from "./ReportSummary";
import MetaPreview from "./MetaPreview";
import ContentOutline from "./ContentOutline";
import ContentGaps from "./ContentGaps";
import FaqSuggestions from "./FaqSuggestions";
import CompetitorTable from "./CompetitorTable";
import WordCountChart from "./WordCountChart";
import Button from "./ui/Button";
import { downloadPDF } from "@/lib/api";
import type { Report, ReportData } from "@/lib/types";

interface Props {
  report: Report;
}

function buildPlainTextBrief(keyword: string, data: ReportData) {
  const lines: string[] = [];
  lines.push(`SEO Content Brief: ${keyword}`);
  lines.push("");
  lines.push(`Meta title: ${data.meta_title ?? ""}`);
  lines.push(`Meta description: ${data.meta_description ?? ""}`);
  lines.push(`Target word count: ${data.target_word_count ?? ""}`);
  lines.push("");
  lines.push("Content outline:");

  (data.content_outline ?? []).forEach((h1) => {
    lines.push(`${h1.level}: ${h1.text}`);
    (h1.subheadings ?? []).forEach((h2) => {
      lines.push(`  ${h2.level}: ${h2.text}`);
      (h2.subheadings ?? []).forEach((h3) => {
        lines.push(`    ${h3.level}: ${h3.text}`);
      });
    });
  });

  if (data.content_gaps?.length) {
    lines.push("");
    lines.push("Content gaps:");
    data.content_gaps.forEach((gap) => lines.push(`- ${gap.topic}: ${gap.reason}`));
  }

  if (data.faq_suggestions?.length) {
    lines.push("");
    lines.push("FAQ suggestions:");
    data.faq_suggestions.forEach((faq) => lines.push(`- (${faq.importance}) ${faq.question}`));
  }

  return lines.join("\n");
}

export default function ReportView({ report }: Props) {
  const data = report.report_data;
  const router = useRouter();

  async function copyAll() {
    await navigator.clipboard.writeText(buildPlainTextBrief(report.keyword, data));
    toast.success("Full brief copied to clipboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">SEO content brief</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            For <span className="font-medium text-[var(--foreground)]">&ldquo;{report.keyword}&rdquo;</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={copyAll}>
            <Copy size={16} />
            Copy all
          </Button>
          <Button variant="secondary" onClick={() => downloadPDF(report.id)}>
            <FileDown size={16} />
            Download PDF
          </Button>
          <Button variant="ghost" onClick={() => router.push("/")}>
            <RotateCcw size={16} />
            New analysis
          </Button>
        </div>
      </div>

      <ReportSummary data={data} />
      <MetaPreview data={data} />
      <WordCountChart data={data} />
      <ContentOutline data={data} />
      <ContentGaps data={data} />
      <FaqSuggestions data={data} />
      <CompetitorTable data={data} />
    </div>
  );
}
