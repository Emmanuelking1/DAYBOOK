import { isRestaurantQuery, normDomain, normEmail, type SearchCriteria } from "@/lib/prospecting/catalog";
import http from "node:http";
import https from "node:https";

const PAGE_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const MAP_AGENT = "DaybookProspecting/1.0 (restaurant bookkeeping research)";
const SHARED_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "yelp.com",
  "tiktok.com",
  "linktr.ee",
  "linktree.com",
  "google.com",
  "goo.gl",
  "bit.ly",
  "squareup.com",
];
const JUNK_EMAIL_HOSTS = [
  "example.com",
  "example.org",
  "example.net",
  "sentry.io",
  "wixpress.com",
  "wix.com",
  "wixsite.com",
  "schema.org",
  "godaddy.com",
  "secureserver.net",
  "squarespace.com",
  "wordpress.com",
  "wordpress.org",
  "shopify.com",
  "myshopify.com",
  "cloudflare.com",
  "mysite.com",
  "domain.com",
  "email.com",
  "yourdomain.com",
  "google.com",
  "googleapis.com",
  "gstatic.com",
  "google-analytics.com",
  "googletagmanager.com",
  "schema.org",
  "w3.org",
  "github.com",
  "gravatar.com",
  "themeforest.net",
  "envato.com",
  "facebook.com",
  "fb.com",
  "instagram.com",
  "jquery.com",
  "bootstrapcdn.com",
  "fontawesome.com",
  "mailchimp.com",
  "list-manage.com",
  "amazonaws.com",
  "cloudfront.net",
  "doubleclick.net",
  "hotjar.com",
  "segment.io",
  "hubspot.com",
  "typekit.net",
  "adobe.com",
  "latofonts.com",
];
const GENERIC_LOCAL =
  /^(info|hello|contact|office|admin|reservations|reservation|booking|frontdesk|front-desk|team|mail|inquiry|enquiries|enquiry|catering|events|sales|support|order|orders|eat|hola|hi|guest|guests)$/i;

export type LiveEmail = { email: string; emailType: "professional" | "business" };

export type LiveListing = {
  key: string;
  name: string;
  category: string;
  address: string;
  city: string;
  region: string;
  country: string;
  website: string | null;
  domain: string | null;
  phone: string | null;
  emails: LiveEmail[];
  osmUrl: string;
  social: string[];
  locationCount: number | null;
  conflictNote: string | null;
  cuisine: string | null;
};

type NomResult = {
  name?: string;
  display_name?: string;
  osm_type?: string;
  osm_id?: number;
  address?: Record<string, string>;
  extratags?: Record<string, string>;
};

function amenityFor(industry: string): "restaurant" | "cafe" | "bar" | null {
  const text = industry.toLowerCase();
  const food = isRestaurantQuery(text) || /\bbar\b|coffee|kitchen/.test(text);
  if (!food) return null;
  if (/cafe|café|coffee/.test(text) && !/restaurant|dining|bistro|eatery|kitchen/.test(text)) return "cafe";
  if (/\bbar\b/.test(text) && !/restaurant|dining|food|kitchen/.test(text)) return "bar";
  return "restaurant";
}

export function classifyEmail(email: string): "professional" | "business" {
  const local = email.split("@")[0] ?? "";
  if (GENERIC_LOCAL.test(local)) return "business";
  if (/[._]/.test(local)) return "professional";
  return "business";
}

function isPublicHttp(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) {
    return false;
  }
  if (host === "metadata.google.internal") return false;
  const ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(host);
  if (ip) {
    const a = Number(ip[1]);
    const b = Number(ip[2]);
    if (a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
      return false;
    }
  }
  return true;
}

export function websiteUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 300) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!isPublicHttp(url)) return null;
    return url;
  } catch {
    return null;
  }
}

function hostKey(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function isSharedHost(hostname: string) {
  const host = hostKey(hostname);
  return SHARED_HOSTS.some((item) => host === item || host.endsWith(`.${item}`));
}

const PROFILE_HOSTS = ["facebook.com", "fb.com", "instagram.com", "twitter.com", "x.com", "linktr.ee", "linktree.com", "yelp.com", "tiktok.com"];

export function isPublicProfile(hostname: string) {
  const host = hostKey(hostname);
  return PROFILE_HOSTS.some((item) => host === item || host.endsWith(`.${item}`));
}

function usableEmail(value: string): string | null {
  let email = normEmail(value).replace(/^mailto:/, "").split("?")[0]?.trim() ?? "";
  email = email.replace(/\\+/g, "").replace(/^["'<(\[]+/, "").replace(/[>"'),;:\]]+$/g, "");
  if (!/^[a-z0-9][a-z0-9._%+-]{0,63}@[a-z0-9.-]+\.[a-z]{2,24}$/.test(email)) return null;
  if (email.length > 80) return null;
  const [local, host] = email.split("@");
  if (!local || !host) return null;
  if (/noreply|no-reply|donotreply|do-not-reply|wixpress|sentry/.test(local)) return null;
  if (JUNK_EMAIL_HOSTS.some((item) => host === item || host.endsWith(`.${item}`))) return null;
  if (/\.(png|jpe?g|gif|webp|svg|css|js)$/.test(host)) return null;
  return email;
}

function decodeCloudflare(hex: string) {
  const bytes = hex.match(/../g)?.map((pair) => Number.parseInt(pair, 16)) ?? [];
  if (bytes.length < 2 || bytes.some((byte) => Number.isNaN(byte))) return "";
  const key = bytes[0] ?? 0;
  return bytes
    .slice(1)
    .map((byte) => String.fromCharCode(byte ^ key))
    .join("");
}

export function emailsInPage(html: string, siteHost = "", profile = false): string[] {
  const decoded = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCharCode(Number(num)))
    .replace(
      /([a-z0-9._%+-]+)\s*(?:\[at\]|\(at\)|\{at\}|\sat\s)\s*([a-z0-9.-]+)\s*(?:\[dot\]|\(dot\)|\{dot\}|\sdot\s)\s*([a-z]{2,24})/gi,
      "$1@$2.$3",
    );
  const scores = new Map<string, number>();
  const keep = (raw: string, kind: "mailto" | "protected" | "schema" | "visible") => {
    const email = usableEmail(raw);
    if (!email) return;
    const host = email.split("@")[1] ?? "";
    let score = kind === "mailto" || kind === "protected" ? 4 : kind === "schema" ? 3 : 2;
    if (siteHost && (hostKey(host) === hostKey(siteHost) || hostKey(host).endsWith(`.${hostKey(siteHost)}`))) score += 3;
    else if (/^(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|msn|icloud|me|mac|aol|proton|protonmail|pm|comcast|sbcglobal|att|verizon|cox)\./.test(host)) score += 1;
    else if (kind === "visible") score -= 1;
    const prior = scores.get(email) ?? 0;
    if (score > prior) scores.set(email, score);
  };
  for (const match of decoded.matchAll(/data-cfemail=["']([0-9a-f]+)["']/gi)) keep(decodeCloudflare(match[1] ?? ""), "protected");
  for (const match of decoded.matchAll(/"email"\s*:\s*"([^"\\]+)"/gi)) keep(match[1] ?? "", "schema");
  for (const match of decoded.matchAll(/mailto:([^"'?\s>]+)/gi)) {
    let raw = match[1] ?? "";
    try {
      raw = decodeURIComponent(raw);
    } catch {
      /* keep the raw token */
    }
    keep(raw, "mailto");
  }
  const notes: string[] = [];
  for (const match of decoded.matchAll(/<meta\b[^>]*>/gi)) {
    const content = /content\s*=\s*["']([^"']+)["']/i.exec(match[0] ?? "");
    if (content?.[1]) notes.push(content[1]);
  }
  const visible = `${notes.join(" ")} ${decoded
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")}`;
  for (const match of visible.matchAll(/[a-z0-9][a-z0-9._%+-]{0,63}@[a-z0-9.-]+\.[a-z]{2,24}/gi)) keep(match[0] ?? "", "visible");
  const ranked = [...scores.entries()].filter(([, score]) => score >= (profile ? 3 : 2));
  ranked.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const strong = ranked.filter(([, score]) => score >= 4);
  return (strong.length ? strong : ranked).slice(0, 3).map(([email]) => email);
}

function requestPage(url: URL): Promise<{ status: number; headers: Headers; body: Buffer } | null> {
  return new Promise((resolve) => {
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      url,
      {
        method: "GET",
        rejectUnauthorized: false,
        headers: {
          "User-Agent": PAGE_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 8000,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        response.on("end", () => {
          const headers = new Headers();
          for (const [key, value] of Object.entries(response.headers)) {
            if (typeof value === "string") headers.set(key, value);
            else if (Array.isArray(value)) headers.set(key, value.join(", "));
          }
          resolve({ status: response.statusCode ?? 0, headers, body: Buffer.concat(chunks) });
        });
      },
    );
    req.on("timeout", () => req.destroy());
    req.on("error", () => resolve(null));
    req.end();
  });
}

async function fetchPublic(url: URL, redirects = 0): Promise<string> {
  const response = await requestPage(url);
  if (!response) return "";
  if (response.status >= 300 && response.status < 400 && redirects < 3) {
    const location = response.headers.get("location");
    if (!location) return "";
    const next = new URL(location, url);
    if (!isPublicHttp(next)) return "";
    return fetchPublic(next, redirects + 1);
  }
  if (response.status < 200 || response.status >= 300) return "";
  const type = response.headers.get("content-type") ?? "";
  if (type && !/text|html|xml|json/.test(type)) return "";
  const slice = response.body.byteLength > 1_500_000 ? response.body.subarray(0, 800_000) : response.body;
  return new TextDecoder().decode(slice);
}

function sameSite(a: URL, b: URL) {
  return hostKey(a.hostname) === hostKey(b.hostname);
}

function pagesToRead(home: URL, html: string): URL[] {
  const pages: URL[] = [];
  const seen = new Set<string>([home.href]);
  const add = (raw: string) => {
    if (pages.length >= 3) return;
    try {
      const next = new URL(raw, home);
      if (!isPublicHttp(next) || !sameSite(home, next) || seen.has(next.href)) return;
      seen.add(next.href);
      pages.push(next);
    } catch {
      /* skip a bad link */
    }
  };
  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const href = match[1] ?? "";
    if (/contact|about|connect|reach|location/i.test(href)) add(href);
  }
  add("/contact");
  add("/contact-us");
  add("/about");
  add("/about-us");
  return pages;
}

function profileLinks(html: string, base: URL): URL[] {
  const pages: URL[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    if (pages.length >= 3) break;
    let next: URL;
    try {
      next = new URL(match[1] ?? "", base);
    } catch {
      continue;
    }
    if (!isPublicHttp(next) || !isPublicProfile(next.hostname)) continue;
    if (/sharer|share\b|intent|dialog|login|signup/i.test(next.pathname)) continue;
    const key = `${hostKey(next.hostname)}${next.pathname.replace(/\/$/, "")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pages.push(next);
  }
  return pages;
}

function addProfile(pages: URL[], raw: string) {
  if (pages.length >= 3) return;
  const next = websiteUrl(raw);
  if (!next || !isPublicProfile(next.hostname)) return;
  const key = `${hostKey(next.hostname)}${next.pathname.replace(/\/$/, "")}`;
  if (pages.some((page) => `${hostKey(page.hostname)}${page.pathname.replace(/\/$/, "")}` === key)) return;
  pages.push(next);
}

export type SiteRead = { emails: string[]; status: "found" | "none" | "failed"; page: string };

export async function readPublishedEmails(website: string, extras: string[] = []): Promise<SiteRead> {
  const url = websiteUrl(website);
  const profiles: URL[] = [];
  for (const extra of extras) addProfile(profiles, extra);
  if (url && isPublicProfile(url.hostname)) addProfile(profiles, url.href);
  const company = url && !isPublicProfile(url.hostname) && !isSharedHost(url.hostname) ? url : null;
  if (!company && !profiles.length) {
    return { emails: [], status: url ? "none" : "failed", page: url?.href || "" };
  }

  let opened = false;
  if (company) {
    try {
      let html = await fetchPublic(company);
      if (!html && company.protocol === "https:") {
        const insecure = new URL(company.href);
        insecure.protocol = "http:";
        html = await fetchPublic(insecure);
      }
      if (html) {
        opened = true;
        const emails = emailsInPage(html, company.hostname);
        if (emails.length) return { emails, status: "found", page: company.href };
        for (const page of pagesToRead(company, html)) {
          const extra = await fetchPublic(page);
          const found = emailsInPage(extra, company.hostname);
          if (found.length) return { emails: found, status: "found", page: page.href };
        }
        for (const link of profileLinks(html, company)) addProfile(profiles, link.href);
      }
    } catch {
      /* the public profile pass still runs */
    }
  }

  for (const profile of profiles.slice(0, 3)) {
    const html = await fetchPublic(profile);
    if (!html) continue;
    opened = true;
    const emails = emailsInPage(html, profile.hostname, true);
    if (emails.length) return { emails, status: "found", page: profile.href };
  }
  return { emails: [], status: opened ? "none" : "failed", page: company?.href || profiles[0]?.href || "" };
}

async function fetchNominatim(params: URLSearchParams, attempt = 0): Promise<Response> {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { "User-Agent": MAP_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 429 && attempt < 1) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return fetchNominatim(params, attempt + 1);
  }
  return response;
}

function sameCity(placeCity: string, display: string, wanted: string) {
  const want = wanted.trim().toLowerCase();
  if (!want) return true;
  const city = placeCity.trim().toLowerCase().replace(/\./g, "");
  const target = want.replace(/\./g, "");
  if (city && city === target) return true;
  return display.includes(`, ${want},`) || display.includes(`, ${want} `);
}

function placeName(address: Record<string, string> | undefined, display: string) {
  const city = address?.city || address?.town || address?.village || address?.hamlet || "";
  const region = address?.state || "";
  const street = [address?.house_number, address?.road].filter(Boolean).join(" ");
  const locality = [city, region, address?.postcode].filter(Boolean).join(", ");
  const addressLine = [street, locality].filter(Boolean).join(", ") || display;
  return { city, region, addressLine };
}

function tagEmail(tags: Record<string, string> | undefined) {
  const raw = tags?.email || tags?.["contact:email"] || "";
  const email = usableEmail(raw);
  return email;
}

function socialFromTags(tags: Record<string, string>): string[] {
  const pages: URL[] = [];
  const pairs: [string, string][] = [
    ["contact:facebook", "https://www.facebook.com/"],
    ["facebook", "https://www.facebook.com/"],
    ["contact:instagram", "https://www.instagram.com/"],
    ["instagram", "https://www.instagram.com/"],
    ["contact:twitter", "https://x.com/"],
    ["twitter", "https://x.com/"],
  ];
  for (const [key, prefix] of pairs) {
    const raw = (tags[key] || "").trim();
    if (!raw) continue;
    addProfile(pages, /^https?:\/\//i.test(raw) ? raw : `${prefix}${raw.replace(/^@/, "")}`);
  }
  return pages.map((page) => page.toString());
}

export async function searchOpenStreetMap(criteria: SearchCriteria): Promise<{
  examined: number;
  matched: LiveListing[];
  note: string | null;
}> {
  if (!/united states|usa|u\.s\.a|u\.s\./i.test(criteria.country)) {
    return {
      examined: 0,
      matched: [],
      note: "Live listings in this desk cover the United States. No records were invented for another country.",
    };
  }
  const amenity = amenityFor(criteria.industry);
  if (!amenity) {
    return {
      examined: 0,
      matched: [],
      note: "Live listings cover restaurants, cafes, and bars. No records were invented for this industry.",
    };
  }
  if (!criteria.region.trim() || !criteria.city.trim()) {
    return {
      examined: 0,
      matched: [],
      note: "Enter a city and state. Live listings are pulled for that city. Nothing was invented for a whole state.",
    };
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    extratags: "1",
    limit: "40",
    amenity,
    country: "United States",
    state: criteria.region.trim(),
    city: criteria.city.trim(),
  });
  const response = await fetchNominatim(params);
  if (response.status === 429) {
    throw new Error("OpenStreetMap asked us to slow down. Nothing was saved. Retry in a moment.");
  }
  if (!response.ok) {
    throw new Error(`OpenStreetMap listings returned ${response.status}. Nothing was invented. Retry to continue.`);
  }
  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    throw new Error("OpenStreetMap returned an unexpected listings payload. Nothing was saved.");
  }
  let rows = payload as NomResult[];
  if (!rows.length) {
    const fallback = new URLSearchParams({
      format: "jsonv2",
      addressdetails: "1",
      extratags: "1",
      limit: "40",
      q: `${amenity} in ${criteria.city.trim()}, ${criteria.region.trim()}, United States`,
    });
    const again = await fetchNominatim(fallback);
    if (again.ok) {
      const second = (await again.json()) as unknown;
      if (Array.isArray(second)) rows = second as NomResult[];
    }
  }
  const exclusions = criteria.exclusions
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const wantedCity = criteria.city.trim().toLowerCase();
  const wantedRegion = criteria.region.trim().toLowerCase();
  const seen = new Set<string>();
  const prepared: LiveListing[] = [];

  for (const row of rows) {
    const name = (row.name || "").trim();
    const osmType = row.osm_type;
    const osmId = row.osm_id;
    if (!name || !osmType || !osmId) continue;
    const key = `osm:${osmType}:${osmId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const address = row.address ?? {};
    const countryCode = (address.country_code || "").toLowerCase();
    if (countryCode && countryCode !== "us") continue;
    const place = placeName(address, row.display_name || name);
    const display = (row.display_name || "").toLowerCase();
    if (wantedRegion && place.region && place.region.toLowerCase() !== wantedRegion && !display.includes(wantedRegion)) continue;
    if (!sameCity(place.city, display, wantedCity)) continue;
    if (exclusions.some((token) => name.toLowerCase().includes(token))) continue;
    const tags = row.extratags ?? {};
    const social = socialFromTags(tags);
    const site = websiteUrl(tags.website || tags["contact:website"] || tags.url || "") || (social[0] ? websiteUrl(social[0]) : null);
    if (criteria.requireWebsite && !site) continue;
    const domain = site && !isSharedHost(site.hostname) ? normDomain(site.hostname) : null;
    const email = tagEmail(tags);
    const cuisine = (tags.cuisine || "").split(";")[0]?.trim() || null;
    const label = amenity === "restaurant" ? "Restaurant" : amenity === "cafe" ? "Cafe" : "Bar";
    prepared.push({
      key,
      name,
      category: cuisine ? `${label} · ${cuisine}` : label,
      address: place.addressLine,
      city: place.city || criteria.city.trim(),
      region: place.region || criteria.region.trim(),
      country: "United States",
      website: site ? site.toString() : null,
      domain,
      phone: (tags.phone || tags["contact:phone"] || tags["contact:mobile"] || "").trim() || null,
      emails: email ? [{ email, emailType: classifyEmail(email) }] : [],
      osmUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
      social,
      locationCount: null,
      conflictNote: null,
      cuisine,
    });
  }

  const nameCounts = new Map<string, number>();
  for (const item of prepared) {
    const nameKey = item.name.toLowerCase().replace(/\s+/g, " ");
    nameCounts.set(nameKey, (nameCounts.get(nameKey) ?? 0) + 1);
  }
  for (const item of prepared) {
    const count = nameCounts.get(item.name.toLowerCase().replace(/\s+/g, " ")) ?? 1;
    if (count >= 2) {
      item.locationCount = count;
      item.conflictNote =
        "OpenStreetMap returned more than one listing with this name in the search. The count is only what this result page showed, not a confirmed company-wide total.";
    }
  }
  if (criteria.preferMultiple) {
    prepared.sort((a, b) => (b.locationCount ?? 0) - (a.locationCount ?? 0) || a.name.localeCompare(b.name));
  }

  const cityNote = `OpenStreetMap listings for ${criteria.city.trim()}, ${criteria.region.trim()}. Websites and emails are saved only when the listing or the business site publishes them.`;
  const capNote = rows.length >= 40 ? " The listings service returned its 40-result page, so the city may contain more." : "";
  return {
    examined: rows.length,
    matched: prepared,
    note: `${cityNote}${capNote}`.trim(),
  };
}
