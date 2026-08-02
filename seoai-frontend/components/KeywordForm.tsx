"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { analyzeKeyword } from "@/lib/api";
import Input from "./ui/Input";
import Button from "./ui/Button";
import GenerationOverlay from "./GenerationOverlay";

const EXAMPLE_KEYWORDS = [
  "best running shoes for flat feet",
  "how to start a podcast",
  "email marketing software for small business",
];

export default function KeywordForm() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function runAnalysis(target: string) {
    const trimmed = target.trim();

    if (!trimmed) {
      setError("Enter a keyword to generate a brief.");
      return;
    }

    setError("");

    try {
      setLoading(true);

      // Same request/response contract as before — POST /api/analyze,
      // then route to the saved report. Only the waiting experience changed.
      const report = await analyzeKeyword(trimmed);

      router.push(`/results/${report.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Couldn't generate that brief. Please try again.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runAnalysis(keyword);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5 sm:p-10 dark:shadow-black/30">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="keyword" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
          Enter your target keyword
        </label>

        <Input
          id="keyword"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. best running shoes for flat feet"
          icon={<Search size={18} />}
          error={error}
          disabled={loading}
        />

        <Button type="submit" fullWidth disabled={loading} className="mt-5 py-4 text-base">
          {loading ? "Generating\u2026" : "\u2728 Generate Brief"}
        </Button>

        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          Press Enter or click Generate &mdash; analysis usually takes 15&ndash;30 seconds.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[var(--muted)]">Try:</span>
          {EXAMPLE_KEYWORDS.map((example) => (
            <button
              key={example}
              type="button"
              disabled={loading}
              onClick={() => setKeyword(example)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </form>

      <AnimatePresence>{loading && <GenerationOverlay keyword={keyword.trim()} />}</AnimatePresence>
    </div>
  );
}
