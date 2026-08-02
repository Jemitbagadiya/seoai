"use client";

import { Search, Bot, FileDown } from "lucide-react";
import { motion } from "framer-motion";
import Card from "./ui/Card";

const features = [
  {
    icon: Search,
    title: "SERP analysis",
    desc: "See exactly what's ranking for your keyword right now, no manual digging required.",
  },
  {
    icon: Bot,
    title: "AI-written brief",
    desc: "Claude turns the research into a complete outline, meta tags, and word count target.",
  },
  {
    icon: FileDown,
    title: "Export in one click",
    desc: "Copy the whole brief or download a clean PDF to hand to a writer.",
  },
];

export default function Features() {
  return (
    <section className="mt-20 grid gap-6 md:grid-cols-3">
      {features.map((feature, i) => {
        const Icon = feature.icon;

        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon size={22} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[var(--foreground)]">{feature.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{feature.desc}</p>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
