import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, Button, PageTitle, Panel, SelectInput, TextInput, verifyTone } from "@/components/ui";
import { FileOffer } from "@/components/file-offer";
import { startDownload } from "@/lib/download-file";
import { bandLabel, reviewLabel, verifyLabel } from "@/lib/prospecting/format";
import { leadsToCsv } from "@/lib/prospecting/files";
import { exportLeads, listLeads, mergeLead, refreshPublishedEmails, type LeadRow } from "@/lib/prospecting/server";
import { REVIEW_STATUSES } from "@/lib/prospecting/score";

export const Route = createFileRoute("/leads/")({ component: LeadsPage });

function LeadsPage() {
  return (
    <AppShell>
      <Leads />
    </AppShell>
  );
}

function Leads() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [duplicates, setDuplicates] = useState<{ id: string; name: string; domain: string | null; duplicateOf: string | null; city: string }[]>([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [band, setBand] = useState("all");
  const [verification, setVerification] = useState("all");
  const [status, setStatus] = useState("all");
  const [place, setPlace] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [offer, setOffer] = useState("");

  async function load() {
    const data = await listLeads();
    setLeads(data.leads);
    setDuplicates(data.duplicates);
  }

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        await load();
        for (let round = 0; round < 8 && !stop; round += 1) {
          const result = await refreshPublishedEmails({ data: {} });
          if (stop) return;
          if (result.read || result.found) await load();
          if (!result.pending) break;
        }
      } catch (err) {
        if (!stop) setError(err instanceof Error ? err.message : "Could not load leads");
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  const places = useMemo(() => {
    const seen = new Map<string, string>();
    for (const lead of leads) {
      const key = `${lead.city}|${lead.region}`;
      if (!seen.has(key)) seen.set(key, `${lead.city}, ${lead.region}`);
    }
    return [...seen.entries()];
  }, [leads]);
  const newest = leads[0] ? `${leads[0].city}|${leads[0].region}` : "all";
  const activePlace = place ?? newest;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return leads.filter((lead) => {
      if (activePlace !== "all" && `${lead.city}|${lead.region}` !== activePlace) return false;
      if (band !== "all" && lead.band !== band) return false;
      if (verification !== "all" && (lead.verification ?? "none") !== verification) return false;
      if (status !== "all" && lead.reviewStatus !== status) return false;
      if (!query) return true;
      return [lead.name, lead.city, lead.region, lead.email, ...lead.emails, lead.contactName, lead.domain, lead.website]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [leads, q, band, verification, status, activePlace]);

  const pageSize = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice(page * pageSize, page * pageSize + pageSize);

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function readSites() {
    setNotice("");
    setBusy(true);
    try {
      let found = 0;
      let read = 0;
      for (let round = 0; round < 8; round += 1) {
        const result = await refreshPublishedEmails({ data: { force: round === 0 } });
        found += result.found;
        read += result.read;
        if (result.read || result.found) await load();
        if (!result.pending && !result.left) break;
      }
      setNotice(
        found
          ? `Opened the websites and saved ${found} published email${found === 1 ? "" : "s"} from ${read} pages.`
          : read
            ? `Opened ${read} websites. An email is shown only when the page actually publishes one.`
            : "Every website with a missing email has already been opened.",
      );
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not read the websites.");
    } finally {
      setBusy(false);
    }
  }

  async function download(ids?: string[]) {
    setNotice("");
    const file = leadsToCsv(leads, ids);
    if (!file.count) {
      setOffer("");
      setNotice("Nothing to download. Invalid, suppressed, and opted-out records stay out of the file.");
      return;
    }
    startDownload(file.filename, file.csv, "text/csv;charset=utf-8");
    setOffer("Downloading CSV file");
    void exportLeads({ data: { ids } }).catch(() => undefined);
  }

  async function mergeSelected() {
    if (selected.length !== 2) {
      setNotice("Select exactly two leads to merge.");
      return;
    }
    const result = await mergeLead({ data: { primaryId: selected[0], duplicateId: selected[1] } });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setSelected([]);
    setNotice("Merged. The second selection is now a duplicate and leaves the main list.");
    await load();
  }

  return (
    <div>
      <PageTitle
        eyebrow="Leads"
        title="Review the evidence"
        lede="Each row keeps the company website and every published email. Invalid and suppressed addresses stay out of the file."
      />
      {error ? <p className="mb-4 text-danger">{error}</p> : null}
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <SelectInput
          value={activePlace}
          onChange={(e) => {
            setPlace(e.target.value);
            setPage(0);
          }}
          aria-label="City"
        >
          <option value="all">All cities</option>
          {places.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </SelectInput>
        <TextInput value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search name, city, email" aria-label="Search leads" />
        <SelectInput value={band} onChange={(e) => { setBand(e.target.value); setPage(0); }} aria-label="Score band">
          <option value="all">All scores</option>
          <option value="high">High priority</option>
          <option value="potential">Potential</option>
          <option value="lower">Lower priority</option>
        </SelectInput>
        <SelectInput value={verification} onChange={(e) => { setVerification(e.target.value); setPage(0); }} aria-label="Email status">
          <option value="all">All email statuses</option>
          {["verified", "risky", "unknown", "invalid", "suppressed", "none"].map((item) => (
            <option key={item} value={item}>
              {verifyLabel(item === "none" ? null : item)}
            </option>
          ))}
        </SelectInput>
        <SelectInput value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} aria-label="Review status">
          <option value="all">All review states</option>
          {REVIEW_STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => download()}>
          Download list
        </Button>
        <Button variant="secondary" onClick={() => download(selected)} disabled={!selected.length}>
          Download selected
        </Button>
        <Button variant="secondary" onClick={() => void readSites()} disabled={busy}>
          {busy ? "Reading websites…" : "Check websites again"}
        </Button>
        <Button variant="ghost" onClick={mergeSelected}>
          Merge two selected
        </Button>
      </div>
      {notice ? <p className="mb-4 text-sm text-muted">{notice}</p> : null}
      {offer ? <FileOffer label={offer} /> : null}
      <div className="space-y-3 md:hidden">
        {slice.map((lead) => (
          <LeadCard key={lead.id} lead={lead} selected={selected.includes(lead.id)} onToggle={() => toggle(lead.id)} />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-3xl border border-line bg-card md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3" />
              <th className="px-3 py-3 font-medium">Business</th>
              <th className="px-3 py-3 font-medium">Website</th>
              <th className="px-3 py-3 font-medium">Email</th>
              <th className="px-3 py-3 font-medium">Score</th>
              <th className="px-3 py-3 font-medium">Review</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((lead) => (
              <tr key={lead.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggle(lead.id)} aria-label={`Select ${lead.name}`} />
                </td>
                <td className="px-3 py-3">
                  <Link to="/leads/$leadId" params={{ leadId: lead.id }} className="font-medium">
                    {lead.name}
                  </Link>
                  <p className="text-muted">
                    {lead.city}, {lead.region}
                  </p>
                </td>
                <td className="px-3 py-3">
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-pine">
                      {lead.domain ?? "Website"}
                    </a>
                  ) : (
                    <span className="text-muted">No website</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {lead.emails.length ? (
                    lead.emails.map((email) => (
                      <p key={email} className="max-w-[240px] truncate">
                        {email}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted">{emailGap(lead)}</p>
                  )}
                  <Badge tone={verifyTone(lead.verification)}>{verifyLabel(lead.verification)}</Badge>
                </td>
                <td className="px-3 py-3 tabular-nums">
                  {lead.score ?? "—"}
                  <p className="text-muted">{lead.band ? bandLabel(lead.band) : ""}</p>
                </td>
                <td className="px-3 py-3">{reviewLabel(lead.reviewStatus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!slice.length ? <p className="mt-4 text-muted">No leads match these filters.</p> : null}
      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted">
          {filtered.length} leads · page {page + 1} of {pages}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 0} onClick={() => setPage((n) => n - 1)}>
            Previous
          </Button>
          <Button variant="secondary" disabled={page + 1 >= pages} onClick={() => setPage((n) => n + 1)}>
            Next
          </Button>
        </div>
      </div>
      {duplicates.length ? (
        <Panel className="mt-6">
          <h2 className="font-display text-2xl">Duplicates held out</h2>
          <p className="mt-1 text-sm text-muted">Same normalized domain as a record already kept. They were not enriched.</p>
          <ul className="mt-3 space-y-2 text-sm">
            {duplicates.map((item) => (
              <li key={item.id}>
                {item.name} · {item.city} · {item.domain}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}

function emailGap(lead: LeadRow) {
  if (!lead.website) return "No website";
  if (lead.siteScan === "none") return "No email on the website";
  if (lead.siteScan === "failed") return "Website could not be opened";
  return "Checking the website…";
}

function LeadCard({ lead, selected, onToggle }: { lead: LeadRow; selected: boolean; onToggle: () => void }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to="/leads/$leadId" params={{ leadId: lead.id }} className="font-medium">
            {lead.name}
          </Link>
          <p className="text-sm text-muted">
            {lead.city}, {lead.region}
          </p>
        </div>
        <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Select ${lead.name}`} />
      </div>
      {lead.website ? (
        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="mt-3 block truncate text-sm text-pine">
          {lead.domain ?? lead.website}
        </a>
      ) : (
        <p className="mt-3 text-sm text-muted">No website</p>
      )}
      {lead.emails.length ? (
        lead.emails.map((email) => (
          <p key={email} className="truncate text-sm">
            {email}
          </p>
        ))
      ) : (
        <p className="text-sm text-muted">{emailGap(lead)}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={verifyTone(lead.verification)}>{verifyLabel(lead.verification)}</Badge>
        <span className="text-sm tabular-nums">{lead.score ?? "—"} {lead.band ? bandLabel(lead.band) : ""}</span>
      </div>
    </Panel>
  );
}
