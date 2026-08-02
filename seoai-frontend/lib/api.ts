import type { RawReport, ReportSummaryItem } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * POST /api/analyze — runs the full SerpAPI + scraping + Claude
 * pipeline server-side and returns the saved report. Unchanged from
 * the original implementation: same endpoint, method, and body shape.
 */
export async function analyzeKeyword(keyword: string): Promise<RawReport> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to analyze keyword");
  }

  return await response.json();
}

/** GET /api/reports/{id} — fetches one previously generated report. */
export async function getReport(id: number): Promise<RawReport> {
  const response = await fetch(`${API_URL}/api/reports/${id}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch report");
  }

  return await response.json();
}

/** GET /api/reports — fetches report history summaries. */
export async function getReports(): Promise<ReportSummaryItem[]> {
  const response = await fetch(`${API_URL}/api/reports`);

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return await response.json();
}

/** GET /api/reports/{id}/pdf — opens the generated PDF in a new tab. */
export function downloadPDF(id: number): void {
  window.open(`${API_URL}/api/reports/${id}/pdf`, "_blank");
}
