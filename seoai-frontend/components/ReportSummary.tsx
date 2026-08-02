"use client";

import { FileText, Clock3, Trophy, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import AnimatedNumber from "./ui/AnimatedNumber";
import type { ReportData } from "@/lib/types";

interface Props {
  data: ReportData;
}

export default function ReportSummary({ data }: Props) {
  const wordCount = data.target_word_count || 0;
  const readingTime = Math.ceil(wordCount / 200);
  const competitors = data.competitor_analysis?.length || 0;
  const sections = data.content_outline?.length || 0;

  const stats = [
    { icon: FileText, title: "Target word count", value: wordCount, suffix: "" },
    { icon: Clock3, title: "Est. reading time", value: readingTime, suffix: " min" },
    { icon: Trophy, title: "Pages analyzed", value: competitors, suffix: "" },
    { icon: BarChart3, title: "Outline sections", value: sections, suffix: "" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, i) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Card className="group p-5">
              <Icon className="text-[var(--accent)] transition-transform duration-300 group-hover:scale-110" size={24} />

              <p className="mt-4 text-sm font-medium text-[var(--muted)]">{item.title}</p>

              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                {item.value}{item.suffix}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
