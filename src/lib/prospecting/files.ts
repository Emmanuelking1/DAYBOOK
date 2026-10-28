import { reviewLabel } from "@/lib/prospecting/score";

export type CsvLead = {
  id: string;
  name: string;
  domain: string | null;
  city: string;
  region: string;
  category: string;
  address?: string | null;
  phone?: string | null;
  website: string | null;
  contactName: string | null;
  contactTitle: string | null;
  email: string | null;
  emails?: string[];
  emailType: string | null;
  verification: string | null;
  score: number | null;
  band: string | null;
  reviewStatus: string;
  suppressed: boolean;
  source: string;
  draftSubject: string | null;
  draftBody: string | null;
  draftStatus: string | null;
};

function csvCell(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

function pretty(value: string | null | undefined) {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function leadsToCsv(leads: CsvLead[], ids?: string[]) {
  const wanted = new Set((ids ?? []).filter(Boolean));
  const rows = leads.filter((lead) => {
    if (wanted.size && !wanted.has(lead.id)) return false;
    if (lead.verification === "invalid" || lead.verification === "suppressed" || lead.suppressed) return false;
    if (lead.reviewStatus === "opted_out") return false;
    return true;
  });
  const header = [
    "Business",
    "Category",
    "Address",
    "City",
    "State",
    "Website",
    "Domain",
    "Phone",
    "Email",
    "Email type",
    "Verification",
    "Score",
    "Priority",
    "Review",
    "Contact",
    "Title",
    "Source",
    "Draft status",
    "Draft subject",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const lead of rows) {
    const emails = lead.emails?.length ? lead.emails : lead.email ? [lead.email] : [""];
    emails.forEach((email, index) => {
      lines.push(
        [
          lead.name,
          lead.category,
          lead.address,
          lead.city,
          lead.region,
          lead.website,
          lead.domain,
          lead.phone,
          email,
          index === 0 ? pretty(lead.emailType) : "",
          index === 0 ? pretty(lead.verification) : "",
          index === 0 ? lead.score : "",
          index === 0 ? pretty(lead.band) : "",
          index === 0 ? reviewLabel(lead.reviewStatus) : "",
          lead.contactName,
          lead.contactTitle,
          lead.source,
          index === 0 ? pretty(lead.draftStatus) : "",
          index === 0 ? lead.draftSubject : "",
        ]
          .map(csvCell)
          .join(","),
      );
    });
  }
  return {
    filename: "daybook-leads.csv",
    csv: `\uFEFF${lines.join("\r\n")}\r\n`,
    count: rows.length,
    omitted: (wanted.size ? leads.filter((lead) => wanted.has(lead.id)).length : leads.length) - rows.length,
  };
}

export function mailToHref(to: string, subject: string, body: string) {
  const clipped = body.length > 1400 ? `${body.slice(0, 1400)}…` : body;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(clipped)}`;
}

export function fileSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "draft";
}

export function draftTextFile(input: { business: string; city?: string; subject: string; body: string; status?: string }) {
  const place = input.city ? `${input.business} · ${input.city}` : input.business;
  return `Daybook draft\n${place}\nStatus: ${input.status || "draft"}\nSubject: ${input.subject}\n\n${input.body.trim()}\n`;
}

export function draftEml(input: { business: string; to?: string | null; subject: string; body: string }) {
  const subject = input.subject.replace(/[\r\n]+/g, " ");
  const to = input.to?.trim() || "undisclosed-recipients:;";
  const stamp = new Date().toUTCString();
  return [
    "MIME-Version: 1.0",
    "X-Unsent: 1",
    `From: Daybook <drafts@daybook.local>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: ${stamp}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    input.body.replace(/\r?\n/g, "\r\n").trim(),
    "",
  ].join("\r\n");
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function zipStore(files: { name: string; text: string }[]) {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.text);
    const crc = crc32(data);
    const local = new Uint8Array(30 + name.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(8, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, name.length, true);
    local.set(name, 30);
    locals.push(local, data);
    const entry = new Uint8Array(46 + name.length);
    const entryView = new DataView(entry.buffer);
    entryView.setUint32(0, 0x02014b50, true);
    entryView.setUint16(4, 20, true);
    entryView.setUint16(6, 20, true);
    entryView.setUint32(16, crc, true);
    entryView.setUint32(20, data.length, true);
    entryView.setUint32(24, data.length, true);
    entryView.setUint16(28, name.length, true);
    entryView.setUint32(42, offset, true);
    entry.set(name, 46);
    central.push(entry);
    offset += local.length + data.length;
  }
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  const out = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const part of [...locals, ...central, end]) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return out;
}
