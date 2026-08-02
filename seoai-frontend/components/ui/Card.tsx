"use client";

import { motion } from "framer-motion";
import { ReactNode, KeyboardEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Base surface used across the dashboard. A single 1px border plus
 * a soft shadow that only intensifies on hover keeps a large grid
 * of cards feeling calm rather than noisy (Linear/Vercel-style).
 * When `onClick` is provided the card becomes a keyboard-operable
 * button (Enter/Space) rather than a mouse-only click target.
 */
export default function Card({ children, className = "", hover = true, onClick }: CardProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow ${
        hover ? "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
