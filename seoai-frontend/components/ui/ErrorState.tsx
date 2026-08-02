import { AlertTriangle } from "lucide-react";
import Button from "./Button";

/**
 * Friendly error card with a retry action, used wherever the SRS
 * error-handling table calls for "show friendly error card with
 * retry button" instead of a raw failure or blank screen.
 */
export default function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--danger-soft)] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--danger)]">
        <AlertTriangle size={22} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        {description && <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{description}</p>}
      </div>

      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
