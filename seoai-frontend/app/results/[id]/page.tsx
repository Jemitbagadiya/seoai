"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import LoadingProgress from "@/components/LoadingProgress";
import ReportView from "@/components/ReportView";
import ErrorState from "@/components/ui/ErrorState";
import { getReport } from "@/lib/api";
import type { Report } from "@/lib/types";

export default function ResultPage() {
  const params = useParams();
  const reportId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const raw = await getReport(Number(reportId));

      // report_data is stored as a JSON string in the database
      const parsed: Report = {
        ...raw,
        report_data: JSON.parse(raw.report_data),
      };

      setReport(parsed);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    // Standard fetch-on-mount: setState happens inside the async callback
    // after the network call resolves, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport();
  }, [fetchReport]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {loading && <LoadingProgress />}

        {!loading && error && (
          <ErrorState
            title="Couldn't load this report"
            description="It may still be processing, or the report ID doesn't exist."
            onRetry={fetchReport}
          />
        )}

        {!loading && !error && report && <ReportView report={report} />}
      </div>
    </main>
  );
}
