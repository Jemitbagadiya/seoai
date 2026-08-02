"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * `template.tsx` re-mounts on every navigation (unlike layout.tsx),
 * which is what makes a per-route enter animation possible in the
 * App Router without touching any page's own code.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
