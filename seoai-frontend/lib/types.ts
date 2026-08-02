/**
 * Shared types mirroring the Claude output schema from SRS Section 3.4
 * and the /api/reports response shape. Centralised here so every
 * report component (summary, outline, gaps, FAQ, competitors) agrees
 * on the same structure instead of each re-declaring `any`.
 */

export interface OutlineH3 {
  level: string;
  text: string;
}

export interface OutlineH2 {
  level: string;
  text: string;
  notes?: string;
  subheadings?: OutlineH3[];
}

export interface OutlineH1 {
  level: string;
  text: string;
  notes?: string;
  subheadings?: OutlineH2[];
}

export interface ContentGap {
  topic: string;
  reason: string;
}

export interface FaqSuggestion {
  question: string;
  importance: "high" | "medium" | "low" | string;
}

export interface CompetitorAnalysis {
  url: string;
  word_count: number;
  key_topics: string[];
}

export interface ReportData {
  meta_title: string;
  meta_description: string;
  target_word_count: number;
  content_outline: OutlineH1[];
  content_gaps: ContentGap[];
  faq_suggestions: FaqSuggestion[];
  competitor_analysis: CompetitorAnalysis[];
}

export interface Report {
  id: number;
  keyword: string;
  created_at: string;
  report_data: ReportData;
  competitor_urls?: string[];
  status?: string;
}

/** Shape returned directly by GET /api/reports/{id} — report_data is
 *  still a JSON string at this point, matching the DB column type. */
export interface RawReport extends Omit<Report, "report_data"> {
  report_data: string;
}

export interface ReportSummaryItem {
  id: number;
  keyword: string;
  created_at: string;
}
