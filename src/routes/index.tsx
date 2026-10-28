import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, Panel, verifyTone } from "@/components/ui";
import { bandLabel, money, pct, searchStatusLabel, verifyLabel } from "@/lib/prospecting/format";
import { getDashboard } from "@/lib/prospecting/server";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    getDashboard()
      .then((value) => {
        if (!cancel) setData(value);
      })
      .catch((err: unknown) => {
        if (!cancel) setError(err instanceof Error ? err.message : "Could not load the workspace");
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (error) return <p className="text-danger">{error}</p>;
  if (!data) {
    return (
      <div>
        <h1 className="font-display text-3xl">Overview</h1>
        <p className="mt-2 text-muted">Opening the workspace…</p>
      </div>
    );
  }

  const stats = [
    { label: "Eligible businesses", value: String(data.totals.businesses) },
    { label: "Published emails", value: String(data.totals.published) },
    { label: "High priority", value: String(data.totals.highPriority) },
    { label: "Estimated spend", value: money(data.totals.spendCents) },
  ];
  const rates = [
    ["Business match", pct(data.rates.match)],
    ["Contact found", pct(data.rates.contact)],
    ["Check coverage", pct(data.rates.verificationCoverage)],
    ["Invalid emails", pct(data.rates.invalid)],
    ["Duplicates", pct(data.rates.duplicate)],
    ["Qualified", pct(data.rates.qualified)],
    ["Cost / qualified", data.rates.costPerQualifiedCents == null ? "—" : money(data.rates.costPerQualifiedCents)],
    ["With evidence", pct(data.rates.completeness)],
  ] as const;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-pine">Workspace</p>
          <h1 className="font-display text-3xl md:text-4xl">What is ready to review</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Searches use live OpenStreetMap listings for a city, then the restaurant website. A lower score means weaker evidence, not a confirmed poor fit. Missing emails stay blank.
          </p>
        </div>
        <Link to="/search/new" className="inline-flex min-h-11 items-center rounded-full bg-pine px-4 text-sm font-medium text-pine-ink">
          New search
        </Link>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Panel key={stat.label} className="p-4">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{stat.value}</p>
          </Panel>
        ))}
      </div>
      {!data.totals.businesses ? (
        <p className="mt-4 max-w-2xl text-muted">No live leads yet. Start a search for a city. Daybook keeps the website and any email the business actually publishes.</p>
      ) : null}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel>
          <h2 className="font-display text-2xl">Priority mix</h2>
          <div className="mt-4 space-y-3">
            {(
              [
                ["High priority", data.bands.high, "bg-pine"],
                ["Potential", data.bands.potential, "bg-ink"],
                ["Lower priority", data.bands.lower, "bg-warn"],
              ] as const
            ).map(([label, count, color]) => {
              const max = Math.max(data.bands.high, data.bands.potential, data.bands.lower, 1);
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="tabular-nums text-muted">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-paper-2">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">
            {data.totals.activeSearches} active {data.totals.activeSearches === 1 ? "run" : "runs"} ·{" "}
            {data.totals.duplicates} duplicates held out of the lead list
          </p>
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">Quality</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {rates.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="text-lg font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent runs</h2>
            <Link to="/search" className="text-sm text-pine">
              All runs
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {data.searches.slice(0, 4).map((search) => (
              <li key={search.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <Link to="/search/$searchId" params={{ searchId: search.id }} className="font-medium">
                    {search.industry}
                    {search.region ? ` · ${search.region}` : ""}
                  </Link>
                  <p className="text-sm text-muted">
                    {search.eligible} eligible of {search.targetCount} requested
                  </p>
                </div>
                <Badge tone={search.status === "failed" ? "bad" : search.status === "completed" ? "good" : "warn"}>
                  {searchStatusLabel(search.status)}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Highest scores</h2>
            <Link to="/leads" className="text-sm text-pine">
              Lead list
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {data.topLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link to="/leads/$leadId" params={{ leadId: lead.id }} className="font-medium">
                    {lead.name}
                  </Link>
                  <p className="truncate text-sm text-muted">
                    {lead.city}, {lead.region}
                    {lead.domain ? ` · ${lead.domain}` : ""}
                    {lead.email ? ` · ${lead.email}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={verifyTone(lead.verification)}>{verifyLabel(lead.verification)}</Badge>
                  <span className="w-10 text-right font-medium tabular-nums">{lead.score ?? "—"}</span>
                  <span className="sr-only">{lead.band ? bandLabel(lead.band) : ""}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
