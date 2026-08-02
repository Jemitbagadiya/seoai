import Navbar from "@/components/Navbar";
import KeywordForm from "@/components/KeywordForm";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-dots opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm font-medium text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              Powered by live SERP data + Claude
            </span>

            <h1 className="mx-auto mt-8 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-6xl">
              A content brief in the time it takes to make coffee
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
              Enter a keyword. We analyze the top-ranking pages, find what they&apos;re
              missing, and hand you a writer-ready outline &mdash; no manual research required.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <KeywordForm />
          </div>

          <Features />
        </div>
      </section>
    </main>
  );
}
