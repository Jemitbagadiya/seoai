"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Card from "./ui/Card";
import type { ReportData } from "@/lib/types";

interface Props {
  data: ReportData;
}

function CharacterBar({ length, limit }: { length: number; limit: number }) {
  const pct = Math.min(100, (length / limit) * 100);
  const over = length > limit;

  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
      <div
        className={`h-full rounded-full transition-all ${over ? "bg-[var(--danger)]" : "bg-[var(--success)]"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MetaField({ label, value, limit }: { label: string; value: string; limit: number }) {
  const [copied, setCopied] = useState(false);
  const over = value.length > limit;

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{label}</h3>

        <button
          onClick={copy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
        >
          {copied ? <Check size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--foreground)]">
        {value}
      </p>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={over ? "font-medium text-[var(--danger)]" : "text-[var(--muted)]"}>
          {value.length} / {limit} characters
        </span>
        {over && <span className="font-medium text-[var(--danger)]">Over limit</span>}
      </div>
      <CharacterBar length={value.length} limit={limit} />
    </div>
  );
}

export default function MetaPreview({ data }: Props) {
  const title = data.meta_title || "";
  const description = data.meta_description || "";

  return (
    <Card hover={false} className="space-y-8">
      <h2 className="text-xl font-bold text-[var(--foreground)]">Meta preview</h2>

      <MetaField label="Meta title" value={title} limit={60} />
      <MetaField label="Meta description" value={description} limit={155} />
    </Card>
  );
}
