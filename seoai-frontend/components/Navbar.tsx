"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Sparkles, Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)]">
            <Sparkles size={17} />
          </span>
          <span className="text-lg tracking-tight text-[var(--foreground)]">SEO Brief AI</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/history"
            aria-current={pathname === "/history" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/history"
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <History size={17} />
            <span className="hidden sm:inline">History</span>
          </Link>

          {pathname !== "/" && (
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">New brief</span>
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
