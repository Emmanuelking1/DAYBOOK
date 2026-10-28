export type SampleStatus = "verified" | "risky" | "invalid" | "unknown";

export type CatalogContact = {
  name: string;
  firstName: string;
  title: string;
  contactType: "person" | "inbox";
  role: string;
  email: string;
  emailType: "professional" | "business";
  sampleStatus: SampleStatus;
  sampleDetail: string;
};

export type CatalogEvidence = {
  claim: string;
  value: string;
  confidence: "high" | "medium" | "low";
  sourceLabel: string;
};

export type CatalogBusiness = {
  key: string;
  name: string;
  domain: string | null;
  category: string;
  city: string;
  region: string;
  country: string;
  address: string;
  website: string | null;
  locationCount: number | null;
  employeeBand: string | null;
  conflictNote: string | null;
  contacts: CatalogContact[];
  evidence: CatalogEvidence[];
};

const attest = "Pilot catalog attestation. Not a live mailbox check.";

export const CATALOG: CatalogBusiness[] = [
  {
    key: "mesa-rye",
    name: "Mesa & Rye",
    domain: "mesarye.example",
    category: "Independent restaurant",
    city: "Austin",
    region: "Texas",
    country: "United States",
    address: "1402 E Cesar Chavez St, Austin, TX",
    website: "https://mesarye.example",
    locationCount: 3,
    employeeBand: "31-80",
    conflictNote: null,
    contacts: [
      {
        name: "Elena Voss",
        firstName: "Elena",
        title: "Owner",
        contactType: "person",
        role: "Owner",
        email: "elena.voss@mesarye.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Three listed dining rooms in Austin.",
        confidence: "high",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Elena Voss is listed as owner.",
        confidence: "high",
        sourceLabel: "Pilot catalog · contacts",
      },
      {
        claim: "Category",
        value: "Independent restaurant.",
        confidence: "high",
        sourceLabel: "Pilot catalog · profile",
      },
    ],
  },
  {
    key: "mesa-rye-south",
    name: "Mesa and Rye — South Congress",
    domain: "mesarye.example",
    category: "Independent restaurant",
    city: "Austin",
    region: "Texas",
    country: "United States",
    address: "1800 S Congress Ave, Austin, TX",
    website: "https://mesarye.example",
    locationCount: 3,
    employeeBand: "31-80",
    conflictNote: null,
    contacts: [
      {
        name: "Front desk",
        firstName: "",
        title: "Business inbox",
        contactType: "inbox",
        role: "Business inbox",
        email: "hello@mesarye.example",
        emailType: "business",
        sampleStatus: "risky",
        sampleDetail: `${attest} Shared inbox. Delivery was not confirmed.`,
      },
    ],
    evidence: [
      {
        claim: "Duplicate signal",
        value: "Same normalized domain as Mesa & Rye.",
        confidence: "high",
        sourceLabel: "Pilot catalog · identity",
      },
    ],
  },
  {
    key: "lantern",
    name: "Lantern Supper Club",
    domain: "lanternsupper.example",
    category: "Independent restaurant",
    city: "Austin",
    region: "Texas",
    country: "United States",
    address: "908 E 6th St, Austin, TX",
    website: "https://lanternsupper.example",
    locationCount: 1,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "House inbox",
        firstName: "",
        title: "General manager inbox",
        contactType: "inbox",
        role: "General manager",
        email: "gm@lanternsupper.example",
        emailType: "business",
        sampleStatus: "risky",
        sampleDetail: `${attest} Role inbox with uncertain delivery.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "One listed location.",
        confidence: "high",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Contact type",
        value: "Only a general-manager role inbox is listed. No named person.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "harbor",
    name: "Harbor & Hatch",
    domain: "harborhatch.example",
    category: "Independent restaurant",
    city: "Houston",
    region: "Texas",
    country: "United States",
    address: "55 Kipp St, Houston, TX",
    website: "https://harborhatch.example",
    locationCount: 2,
    employeeBand: "31-80",
    conflictNote: null,
    contacts: [
      {
        name: "Marcus Hale",
        firstName: "Marcus",
        title: "Founder",
        contactType: "person",
        role: "Founder",
        email: "marcus.hale@harborhatch.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Two listed locations.",
        confidence: "high",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Marcus Hale is listed as founder.",
        confidence: "high",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "kiln",
    name: "Kiln Street Kitchen",
    domain: null,
    category: "Independent restaurant",
    city: "Dallas",
    region: "Texas",
    country: "United States",
    address: "414 N Bishop Ave, Dallas, TX",
    website: null,
    locationCount: 1,
    employeeBand: "1-10",
    conflictNote: null,
    contacts: [
      {
        name: "Priya Raman",
        firstName: "Priya",
        title: "Owner",
        contactType: "person",
        role: "Owner",
        email: "priya.raman@kilnstreet.example",
        emailType: "professional",
        sampleStatus: "unknown",
        sampleDetail: `${attest} No conclusive sample result.`,
      },
    ],
    evidence: [
      {
        claim: "Website",
        value: "No website is recorded.",
        confidence: "high",
        sourceLabel: "Pilot catalog · profile",
      },
      {
        claim: "Size",
        value: "Employee band 1–10. One location.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · profile",
      },
    ],
  },
  {
    key: "sagebird",
    name: "Sagebird",
    domain: "sagebird.example",
    category: "Independent restaurant",
    city: "San Antonio",
    region: "Texas",
    country: "United States",
    address: "221 E Houston St, San Antonio, TX",
    website: "https://sagebird.example",
    locationCount: 2,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Jonah Peck",
        firstName: "Jonah",
        title: "General manager",
        contactType: "person",
        role: "General manager",
        email: "jonah.peck@sagebird.example",
        emailType: "professional",
        sampleStatus: "unknown",
        sampleDetail: `${attest} No conclusive sample result.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Two listed locations.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Jonah Peck is listed as general manager.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "paper-lantern",
    name: "Paper Lantern",
    domain: "paperlantern.example",
    category: "Independent restaurant",
    city: "Austin",
    region: "Texas",
    country: "United States",
    address: "77 Red River St, Austin, TX",
    website: "https://paperlantern.example",
    locationCount: null,
    employeeBand: "11-30",
    conflictNote:
      "Listings disagree on location count: one reports 2 sites, another reports 4. Neither value was chosen.",
    contacts: [
      {
        name: "Reservations",
        firstName: "",
        title: "Business inbox",
        contactType: "inbox",
        role: "Business inbox",
        email: "reservations@paperlantern.example",
        emailType: "business",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this shared business inbox as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Source A reports 2 locations.",
        confidence: "low",
        sourceLabel: "Pilot catalog · listing A",
      },
      {
        claim: "Location count",
        value: "Source B reports 4 locations.",
        confidence: "low",
        sourceLabel: "Pilot catalog · listing B",
      },
    ],
  },
  {
    key: "birch",
    name: "Birch & Bone",
    domain: "birchbone.example",
    category: "Independent restaurant",
    city: "Denver",
    region: "Colorado",
    country: "United States",
    address: "3200 Tejon St, Denver, CO",
    website: "https://birchbone.example",
    locationCount: 1,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Ada Lind",
        firstName: "Ada",
        title: "Owner",
        contactType: "person",
        role: "Owner",
        email: "ada.lind@birchbone.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "One listed location.",
        confidence: "high",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Ada Lind is listed as owner.",
        confidence: "high",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "civic",
    name: "Civic Table",
    domain: "civictable.example",
    category: "Independent restaurant",
    city: "Denver",
    region: "Colorado",
    country: "United States",
    address: "1550 Platte St, Denver, CO",
    website: "https://civictable.example",
    locationCount: 1,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Chris Adelman",
        firstName: "Chris",
        title: "Managing partner",
        contactType: "person",
        role: "Managing partner",
        email: "chris.adelman@civictable.example",
        emailType: "professional",
        sampleStatus: "invalid",
        sampleDetail: `${attest} Sample file marks this address invalid.`,
      },
    ],
    evidence: [
      {
        claim: "Decision maker",
        value: "Chris Adelman is listed as managing partner.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · contacts",
      },
      {
        claim: "Email",
        value: "The recorded address is marked invalid in the sample file.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · attestation",
      },
    ],
  },
  {
    key: "northline",
    name: "Northline Osteria",
    domain: "northline.example",
    category: "Independent restaurant",
    city: "Chicago",
    region: "Illinois",
    country: "United States",
    address: "2100 N Milwaukee Ave, Chicago, IL",
    website: "https://northline.example",
    locationCount: 4,
    employeeBand: "31-80",
    conflictNote: null,
    contacts: [
      {
        name: "Helena Cho",
        firstName: "Helena",
        title: "Managing partner",
        contactType: "person",
        role: "Managing partner",
        email: "helena.cho@northline.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
      {
        name: "Samir Ortiz",
        firstName: "Samir",
        title: "General manager",
        contactType: "person",
        role: "General manager",
        email: "samir.ortiz@northline.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Four listed locations.",
        confidence: "high",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Helena Cho is listed as managing partner. Samir Ortiz is listed as general manager.",
        confidence: "high",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "halsted",
    name: "Halsted Room",
    domain: "halstedroom.example",
    category: "Independent restaurant",
    city: "Chicago",
    region: "Illinois",
    country: "United States",
    address: "900 N Halsted St, Chicago, IL",
    website: "https://halstedroom.example",
    locationCount: 1,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Studio inbox",
        firstName: "",
        title: "Business inbox",
        contactType: "inbox",
        role: "Business inbox",
        email: "hello@halstedroom.example",
        emailType: "business",
        sampleStatus: "unknown",
        sampleDetail: `${attest} No conclusive sample result.`,
      },
    ],
    evidence: [
      {
        claim: "Contact type",
        value: "Only a shared business inbox is listed.",
        confidence: "high",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "sable",
    name: "Sable & Spruce",
    domain: "sablespruce.example",
    category: "Independent restaurant",
    city: "Portland",
    region: "Oregon",
    country: "United States",
    address: "1205 SE Division St, Portland, OR",
    website: "https://sablespruce.example",
    locationCount: 2,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Noah Ivers",
        firstName: "Noah",
        title: "Founder",
        contactType: "person",
        role: "Founder",
        email: "noah.ivers@sablespruce.example",
        emailType: "professional",
        sampleStatus: "risky",
        sampleDetail: `${attest} Sample file is uncertain about this address.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Two listed locations.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Noah Ivers is listed as founder.",
        confidence: "medium",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
  {
    key: "dockhouse",
    name: "Dockhouse",
    domain: "dockhouse.example",
    category: "Independent restaurant",
    city: "Brooklyn",
    region: "New York",
    country: "United States",
    address: "88 Franklin St, Brooklyn, NY",
    website: "https://dockhouse.example",
    locationCount: 1,
    employeeBand: null,
    conflictNote: null,
    contacts: [
      {
        name: "Office",
        firstName: "",
        title: "Business inbox",
        contactType: "inbox",
        role: "Business inbox",
        email: "office@dockhouse.example",
        emailType: "business",
        sampleStatus: "unknown",
        sampleDetail: `${attest} No conclusive sample result.`,
      },
    ],
    evidence: [
      {
        claim: "Size",
        value: "Employee band is not recorded.",
        confidence: "low",
        sourceLabel: "Pilot catalog · profile",
      },
    ],
  },
  {
    key: "redbird",
    name: "Redbird Cantina",
    domain: "redbirdcantina.example",
    category: "Independent restaurant",
    city: "Houston",
    region: "Texas",
    country: "United States",
    address: "812 White Oak Dr, Houston, TX",
    website: "https://redbirdcantina.example",
    locationCount: 1,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Lina Ortega",
        firstName: "Lina",
        title: "Owner",
        contactType: "person",
        role: "Owner",
        email: "lina.ortega@redbirdcantina.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Category",
        value: "Independent restaurant, cantina format.",
        confidence: "high",
        sourceLabel: "Pilot catalog · profile",
      },
    ],
  },
  {
    key: "quiet-fork",
    name: "The Quiet Fork",
    domain: "quietfork.example",
    category: "Independent restaurant",
    city: "Austin",
    region: "Texas",
    country: "United States",
    address: "1600 E 12th St, Austin, TX",
    website: "https://quietfork.example",
    locationCount: 2,
    employeeBand: "11-30",
    conflictNote: null,
    contacts: [
      {
        name: "Ruth Keller",
        firstName: "Ruth",
        title: "Owner",
        contactType: "person",
        role: "Owner",
        email: "ruth.keller@quietfork.example",
        emailType: "professional",
        sampleStatus: "verified",
        sampleDetail: `${attest} Sample file marks this person-specific address as valid.`,
      },
    ],
    evidence: [
      {
        claim: "Location count",
        value: "Two listed locations.",
        confidence: "high",
        sourceLabel: "Pilot catalog · locations",
      },
      {
        claim: "Decision maker",
        value: "Ruth Keller is listed as owner.",
        confidence: "high",
        sourceLabel: "Pilot catalog · contacts",
      },
    ],
  },
];

export type SearchCriteria = {
  industry: string;
  country: string;
  region: string;
  city: string;
  targetCount: number;
  contactRoles: string[];
  emailTypes: Array<"professional" | "business">;
  preferMultiple: boolean;
  requireWebsite: boolean;
  exclusions: string;
  maxSpendCents: number;
  simulateFailure: boolean;
};

export const PILOT_CRITERIA: SearchCriteria = {
  industry: "Independent restaurants",
  country: "United States",
  region: "",
  city: "",
  targetCount: 25,
  contactRoles: ["Owner", "Founder", "General manager", "Managing partner"],
  emailTypes: ["professional", "business"],
  preferMultiple: true,
  requireWebsite: true,
  exclusions: "",
  maxSpendCents: 2500,
  simulateFailure: false,
};

export function normDomain(domain: string | null | undefined): string | null {
  if (!domain) return null;
  return domain.trim().toLowerCase().replace(/^www\./, "") || null;
}

export function normEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isRestaurantQuery(industry: string): boolean {
  return /restaurant|food|hospitality|dining|cafe|café|bistro/.test(industry.toLowerCase());
}

export function selectCatalog(criteria: SearchCriteria): {
  examined: number;
  matched: CatalogBusiness[];
  excluded: { name: string; reason: string }[];
  note: string | null;
} {
  if (!isRestaurantQuery(criteria.industry)) {
    return {
      examined: CATALOG.length,
      matched: [],
      excluded: [],
      note: "The pilot catalog only includes independent restaurants. No records were invented for this industry.",
    };
  }
  if (!/united states|\busa\b|^us$/.test(criteria.country.trim().toLowerCase())) {
    return {
      examined: CATALOG.length,
      matched: [],
      excluded: [],
      note: "The pilot catalog only covers the United States. No records were invented for this country.",
    };
  }

  const terms = criteria.exclusions
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const region = criteria.region.trim().toLowerCase();
  const city = criteria.city.trim().toLowerCase();
  const excluded: { name: string; reason: string }[] = [];
  const matched: CatalogBusiness[] = [];

  for (const biz of CATALOG) {
    if (region && biz.region.toLowerCase() !== region && !biz.region.toLowerCase().includes(region)) {
      excluded.push({ name: biz.name, reason: "Outside selected region" });
      continue;
    }
    if (city && biz.city.toLowerCase() !== city && !biz.city.toLowerCase().includes(city)) {
      excluded.push({ name: biz.name, reason: "Outside selected city" });
      continue;
    }
    if (criteria.requireWebsite && !biz.website) {
      excluded.push({ name: biz.name, reason: "No website on record" });
      continue;
    }
    const hay = `${biz.name} ${biz.category} ${biz.city}`.toLowerCase();
    const hit = terms.find((t) => hay.includes(t));
    if (hit) {
      excluded.push({ name: biz.name, reason: `Exclusion “${hit}”` });
      continue;
    }
    matched.push(biz);
  }

  matched.sort((a, b) => {
    if (criteria.preferMultiple) {
      const al = a.locationCount ?? -1;
      const bl = b.locationCount ?? -1;
      if (bl !== al) return bl - al;
    }
    return a.name.localeCompare(b.name);
  });

  return { examined: CATALOG.length, matched, excluded, note: null };
}
