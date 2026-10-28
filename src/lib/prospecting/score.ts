export const MODEL_VERSION = "rubric-v1";

export const RUBRIC = [
  { key: "industry", label: "Industry fit", weight: 30 },
  { key: "complexity", label: "Business size or operational complexity", weight: 20 },
  { key: "growth", label: "Evidence of growth or multiple locations", weight: 15 },
  { key: "decision", label: "Relevant decision-maker availability", weight: 15 },
  { key: "completeness", label: "Business data completeness", weight: 10 },
  { key: "contact", label: "Contact data quality", weight: 10 },
] as const;

export type Band = "high" | "potential" | "lower";
export type Confidence = "high" | "medium" | "low";

export type ScoreInput = {
  name: string;
  category: string;
  locationCount: number | null;
  employeeBand: string | null;
  hasWebsite: boolean;
  hasAddress: boolean;
  hasDomain: boolean;
  conflictNote: string | null;
  contact:
    | {
        contactType: "person" | "inbox";
        role: string;
        verification: "verified" | "risky" | "invalid" | "unknown" | "suppressed" | "none";
      }
    | null;
};

export type ScoreResult = {
  industryFit: number;
  operationalComplexity: number;
  growthSignals: number;
  decisionMaker: number;
  businessCompleteness: number;
  contactQuality: number;
  total: number;
  confidence: Confidence;
  band: Band;
  explanation: string;
  reasons: string[];
  missing: string[];
};

const DECISION_ROLES = ["owner", "founder", "general manager", "managing partner", "partner"];

export function bandFor(total: number): Band {
  if (total >= 80) return "high";
  if (total >= 60) return "potential";
  return "lower";
}

export function bandLabel(band: Band | string): string {
  if (band === "high") return "High priority";
  if (band === "potential") return "Potential";
  return "Lower priority";
}

function clamp(n: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(n)));
}

export function scoreBusiness(input: ScoreInput): ScoreResult {
  const reasons: string[] = [];
  const missing: string[] = [];

  const restaurant = /restaurant|cantina|osteria|taqueria|bistro|supper|cafe|café|coffee|\bbar\b/.test(
    input.category.toLowerCase(),
  );
  const industryFit = restaurant ? 30 : 0;
  if (restaurant) {
    reasons.push(`${input.name} is categorized as ${input.category.toLowerCase()}, which matches the search.`);
  } else {
    reasons.push(`${input.name} is categorized as ${input.category}, which does not match restaurants.`);
  }

  let complexity = 0;
  if (input.employeeBand === "31-80") complexity = 16;
  else if (input.employeeBand === "11-30") complexity = 12;
  else if (input.employeeBand === "1-10") complexity = 6;
  else {
    complexity = 8;
    missing.push("Employee band is not recorded, so operational complexity uses a neutral midpoint.");
  }
  if ((input.locationCount ?? 0) >= 2) complexity += 4;
  complexity = clamp(complexity, 20);
  if (input.employeeBand) {
    reasons.push(`Recorded employee band is ${input.employeeBand}.`);
  }

  let growth = 0;
  if (input.conflictNote) {
    growth = 8;
    missing.push(input.conflictNote);
    missing.push("Growth uses a neutral midpoint because the location count conflicts.");
  } else if (input.locationCount == null) {
    growth = 8;
    missing.push("Location count is not recorded, so growth uses a neutral midpoint rather than a penalty.");
  } else if (input.locationCount >= 3) {
    growth = 15;
    reasons.push(`${input.locationCount} listed locations may increase bookkeeping complexity.`);
  } else if (input.locationCount === 2) {
    growth = 10;
    reasons.push("Two listed locations are on the record.");
  } else {
    growth = 0;
    reasons.push("One listed location is on the record. That is an observation, not evidence against a fit.");
  }

  let decision = 8;
  if (!input.contact) {
    missing.push("No contact is on the record. Decision-maker availability uses a neutral midpoint.");
  } else if (input.contact.contactType === "inbox") {
    decision = 6;
    reasons.push(`The only listed contact is a ${input.contact.role.toLowerCase()}, not a named person.`);
  } else if (DECISION_ROLES.some((r) => input.contact?.role.toLowerCase().includes(r))) {
    decision = 15;
    const role = input.contact.role.toLowerCase();
    reasons.push(`${/^[aeiou]/i.test(role) ? "An" : "A"} ${role} is listed.`);
  } else {
    decision = 10;
    reasons.push(`A named contact is listed (${input.contact.role}).`);
  }

  let completeness = 0;
  if (input.name) completeness += 2;
  if (input.hasAddress) completeness += 2;
  if (input.category) completeness += 2;
  if (input.hasWebsite) completeness += 2;
  else missing.push("No website is recorded.");
  if (input.hasDomain) completeness += 2;
  else if (input.hasWebsite) completeness += 0;

  let contactQuality = 5;
  const verification = input.contact?.verification ?? "none";
  if (!input.contact || verification === "none") {
    contactQuality = 5;
    missing.push("No email is on the record. Contact quality uses a neutral midpoint.");
  } else if (verification === "verified" && input.contact.contactType === "person") {
    contactQuality = 10;
    reasons.push("A person-specific email carries a sample attestation of valid.");
  } else if (verification === "verified") {
    contactQuality = 7;
    reasons.push("A shared business inbox carries a sample attestation of valid.");
  } else if (verification === "risky") {
    contactQuality = 4;
    reasons.push("The email attestation is uncertain and should be held for review.");
  } else if (verification === "unknown") {
    contactQuality = 3;
    missing.push("Email status is unknown. That is not treated as proof of a bad address.");
  } else if (verification === "invalid") {
    contactQuality = 0;
    reasons.push("The recorded email is marked invalid and is excluded from outreach.");
  } else if (verification === "suppressed") {
    contactQuality = 0;
    reasons.push("The address is suppressed and cannot be included in outreach.");
  }

  missing.push("No evidence establishes the current bookkeeping provider or a need for external bookkeeping.");

  const total =
    industryFit + complexity + growth + decision + completeness + contactQuality;
  const unknowns = missing.filter((m) => !m.startsWith("No evidence establishes")).length;
  const confidence: Confidence =
    input.conflictNote || unknowns >= 2 ? "low" : unknowns === 1 || verification !== "verified" ? "medium" : "high";

  const explanation = [...reasons, ...missing].join(" ");

  return {
    industryFit,
    operationalComplexity: complexity,
    growthSignals: growth,
    decisionMaker: decision,
    businessCompleteness: completeness,
    contactQuality,
    total,
    confidence,
    band: bandFor(total),
    explanation,
    reasons,
    missing,
  };
}

export const REVIEW_STATUSES = [
  { id: "not_reviewed", label: "Not reviewed" },
  { id: "approved", label: "Approved for outreach" },
  { id: "draft_created", label: "Draft created" },
  { id: "sent_externally", label: "Sent externally" },
  { id: "replied", label: "Replied" },
  { id: "follow_up", label: "Follow-up needed" },
  { id: "converted", label: "Converted" },
  { id: "not_interested", label: "Not interested" },
  { id: "opted_out", label: "Opted out" },
] as const;

export function reviewLabel(id: string): string {
  return REVIEW_STATUSES.find((s) => s.id === id)?.label ?? id;
}

export const SERVICE_DESCRIPTION =
  "Daybook helps independent restaurants with bookkeeping and keeping their financial records organized. We do not promise outcomes we cannot document.";

export function templateDraft(input: {
  businessName: string;
  firstName: string;
  city: string;
  region: string;
  serviceDescription: string;
}) {
  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hello,";
  const place = [input.city, input.region].filter(Boolean).join(", ") || "your area";
  const service = input.serviceDescription.trim() || SERVICE_DESCRIPTION;
  return {
    subject: `Bookkeeping support for ${input.businessName}`,
    body: `${greeting}\n\nI came across ${input.businessName} while researching restaurants in ${place}.\n\nI'm reaching out from Daybook. ${service}\n\nIf you're open to it, I'd be happy to learn how you're currently handling your bookkeeping and see whether we could be useful.\n\nWould you be available for a brief conversation?\n\nBest,\nDaybook`,
    warnings: [
      "This draft uses only the business name, contact name, and location stored on the lead, plus the approved service description.",
      "It does not claim a referral, a financial problem, or that the business needs bookkeeping.",
    ],
    evidenceRefs: [`Business name: ${input.businessName}`, `Location: ${place}`],
  };
}
