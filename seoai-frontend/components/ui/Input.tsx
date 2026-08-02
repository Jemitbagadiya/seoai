import { ReactNode } from "react";

interface InputProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

/**
 * Text input with an optional leading icon and inline error message.
 * Used by the keyword form and the history search box.
 */
export default function Input({
  value,
  placeholder,
  onChange,
  icon,
  error,
  disabled,
  id,
  ...rest
}: InputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            {icon}
          </span>
        )}

        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error && id ? `${id}-error` : undefined}
          {...rest}
          className={`w-full rounded-lg border bg-[var(--surface)] py-4 text-base text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-60 ${
            icon ? "pl-12 pr-5" : "px-5"
          } ${
            error
              ? "border-[var(--danger)] focus:ring-4 focus:ring-[var(--danger)]/15"
              : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15"
          }`}
        />
      </div>

      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="mt-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
