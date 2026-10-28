import { bandLabel, reviewLabel } from "@/lib/prospecting/score";

export { bandLabel, reviewLabel };

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function pct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

export function verifyLabel(status: string | null | undefined) {
  if (!status) return "No email";
  if (status === "verified") return "Verified";
  if (status === "risky") return "Risky";
  if (status === "invalid") return "Invalid";
  if (status === "unknown") return "Published";
  if (status === "suppressed") return "Suppressed";
  return status;
}

const SEARCH_STATUS: Record<string, string> = {
  queued: "Queued",
  discovering: "Discovering",
  ready_dedupe: "Deduplicating",
  deduping: "Deduplicating",
  ready_enrich: "Enriching",
  enriching: "Enriching",
  ready_verify: "Checking emails",
  verifying: "Checking emails",
  ready_score: "Scoring",
  scoring: "Scoring",
  completed: "Completed",
  failed: "Needs attention",
  cancelled: "Cancelled",
};

export function searchStatusLabel(status: string) {
  return SEARCH_STATUS[status] ?? status;
}

export function isOpenSearch(status: string) {
  return !["completed", "failed", "cancelled"].includes(status);
}
