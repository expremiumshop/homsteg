import { cn } from "@/lib/utils";

/**
 * ============================================================
 * BOTÕES E CAMPOS DA _kit — tokens --tk-*
 * ============================================================
 */

export function TkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "accent" | "whatsapp" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-6 text-base",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--tk-primary)] text-[var(--tk-primary-contrast)] hover:opacity-90",
    accent:
      "bg-[var(--tk-accent)] text-[var(--tk-accent-contrast)] hover:opacity-90",
    outline:
      "border-2 border-[var(--tk-primary)] text-[var(--tk-primary)] hover:bg-[color-mix(in_srgb,var(--tk-primary)_8%,transparent)]",
    whatsapp: "bg-green-600 text-white hover:bg-green-700",
    ghost:
      "text-[var(--tk-text)] hover:bg-[color-mix(in_srgb,var(--tk-text)_6%,transparent)]",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      style={{ borderRadius: "var(--tk-radius)" }}
      {...props}
    />
  );
}

export function TkInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full min-w-0 border bg-[var(--tk-surface)] px-4 text-sm outline-none transition placeholder:text-[var(--tk-muted)]",
        "focus:border-[var(--tk-primary)]",
        className,
      )}
      style={{ borderColor: "var(--tk-border)", borderRadius: "var(--tk-radius)" }}
      {...props}
    />
  );
}

export function TkTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-w-0 border bg-[var(--tk-surface)] p-4 text-sm outline-none transition placeholder:text-[var(--tk-muted)]",
        "focus:border-[var(--tk-primary)]",
        className,
      )}
      style={{ borderColor: "var(--tk-border)", borderRadius: "var(--tk-radius)" }}
      {...props}
    />
  );
}

export function TkCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border bg-[var(--tk-surface)] shadow-sm",
        className,
      )}
      style={{ borderColor: "var(--tk-border)", borderRadius: "var(--tk-card-radius)" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function TkBadge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "muted" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    primary:
      "bg-[var(--tk-primary)] text-[var(--tk-primary-contrast)]",
    accent:
      "bg-[var(--tk-accent)] text-[var(--tk-accent-contrast)]",
    muted: "bg-black/10 text-[var(--tk-text)]",
    danger: "bg-red-600 text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold sm:text-[11px]",
        tones[tone],
        className,
      )}
      style={{ borderRadius: "var(--tk-radius)" }}
    >
      {children}
    </span>
  );
}
