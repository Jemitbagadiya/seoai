import Navbar from "@/components/Navbar";
import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">Report history</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">All the briefs you&apos;ve generated, in one place.</p>

        <div className="mt-8">
          <HistoryList />
        </div>
      </div>
    </main>
  );
}
