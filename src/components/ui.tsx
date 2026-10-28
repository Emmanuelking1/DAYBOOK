import type { ButtonHTMLAttributes, ReactNode, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-[transform,background-color,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-pine text-pine-ink",
        variant === "secondary" && "border border-line bg-card text-ink",
        variant === "ghost" && "text-ink",
        variant === "danger" && "bg-danger text-pine-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

const control =
  "min-h-11 w-full rounded-lg border border-line bg-card px-3 text-base text-ink outline-none placeholder:text-muted";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-32 py-3", props.className)} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, props.className)} />;
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn" | "bad" | "ink";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "bg-paper-2 text-muted",
        tone === "good" && "bg-pine/10 text-pine",
        tone === "warn" && "bg-warn/10 text-warn",
        tone === "bad" && "bg-danger/10 text-danger",
        tone === "ink" && "bg-ink text-paper",
      )}
    >
      {children}
    </span>
  );
}

export function verifyTone(status: string | null | undefined): "neutral" | "good" | "warn" | "bad" {
  if (status === "verified") return "good";
  if (status === "risky" || status === "unknown") return "warn";
  if (status === "invalid" || status === "suppressed") return "bad";
  return "neutral";
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-3xl border border-line bg-card p-5", className)}>{children}</section>;
}

export function PageTitle({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <header className="mb-6 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-medium text-pine">{eyebrow}</p> : null}
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">{title}</h1>
      {lede ? <p className="mt-2 text-base text-muted">{lede}</p> : null}
    </header>
  );
}
