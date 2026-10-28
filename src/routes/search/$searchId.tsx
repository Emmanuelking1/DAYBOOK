import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, Button, PageTitle, Panel } from "@/components/ui";
import { isOpenSearch, money, searchStatusLabel } from "@/lib/prospecting/format";
import { advanceSearch, cancelSearch, resumeSearch, retrySearch, summarizeSearch, type SearchView } from "@/lib/prospecting/server";

export const Route = createFileRoute("/search/$searchId")({ component: RunPage });

type Payload = { search: SearchView; usage: { provider: string; operation: string; units: number; estimated_cents: number }[] };

function RunPage() {
  const { searchId } = Route.useParams();
  return (
    <AppShell>
      <Run searchId={searchId} />
    </AppShell>
  );
}

function Run({ searchId }: { searchId: string }) {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [stuck, setStuck] = useState(false);
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stop = false;
    async function loop() {
      let last = "";
      for (let i = 0; i < 12 && !stop; i += 1) {
        const result = await advanceSearch({ data: { id: searchId } });
        if (stop) return;
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setPayload({ search: result.search, usage: result.usage });
        if (!isOpenSearch(result.search.status)) return;
        if (result.search.status === last && result.search.status.endsWith("ing")) {
          setStuck(true);
          return;
        }
        last = result.search.status;
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    void loop().catch((err: unknown) => setError(err instanceof Error ? err.message : "The run failed"));
    return () => {
      stop = true;
    };
  }, [searchId]);

  async function act(kind: "cancel" | "retry" | "resume" | "summary") {
    setBusy(true);
    setError("");
    if (kind === "cancel") {
      const result = await cancelSearch({ data: { id: searchId } });
      if (!result.ok) setError(result.error);
    }
    if (kind === "retry") {
      const result = await retrySearch({ data: { id: searchId } });
      if (!result.ok) setError(result.error);
      else window.location.reload();
    }
    if (kind === "resume") {
      const result = await resumeSearch({ data: { id: searchId } });
      if (!result.ok) setError(result.error);
      else window.location.reload();
    }
    if (kind === "summary") {
      const result = await summarizeSearch({ data: { id: searchId } });
      if (!result.ok) setError(result.error);
      else setSummary(result.summary);
    }
    setBusy(false);
  }

  if (error && !payload) return <p className="text-danger">{error}</p>;
  if (!payload) {
    return (
      <div>
        <h1 className="font-display text-3xl">Search run</h1>
        <p className="mt-2 text-muted">Starting the pipeline…</p>
      </div>
    );
  }
  const { search, usage } = payload;
  const text = summary || search.summary;

  return (
    <div>
      <PageTitle
        eyebrow={search.isPilot ? "Pilot sample" : "Search run"}
        title={`${search.industry} in ${[search.city, search.region].filter(Boolean).join(", ")}`}
        lede={search.note || "Working through discovery, enrichment, checks, and scoring."}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone={search.status === "completed" ? "good" : search.status === "failed" ? "bad" : "warn"}>
          {searchStatusLabel(search.status)}
        </Badge>
        <span className="text-sm text-muted tabular-nums">{money(search.spentCents)} of {money(search.maxSpendCents)}</span>
        {isOpenSearch(search.status) ? (
          <Button variant="secondary" disabled={busy} onClick={() => act("cancel")}>
            Cancel
          </Button>
        ) : null}
        {search.status === "failed" ? (
          <Button disabled={busy} onClick={() => act("retry")}>
            Retry failed step
          </Button>
        ) : null}
        {stuck ? (
          <Button variant="secondary" disabled={busy} onClick={() => act("resume")}>
            Resume stuck step
          </Button>
        ) : null}
      </div>
      {search.error ? <p className="mb-4 text-sm text-danger">{search.error}</p> : null}
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Examined", search.examined],
          ["Matched", search.matched],
          ["Eligible", search.eligible],
          ["Scored", search.completed],
        ].map(([label, value]) => (
          <Panel key={String(label)} className="p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-2xl">Pipeline</h2>
          <ol className="mt-4 space-y-3">
            {search.progress.map((entry, index) => (
              <li key={`${entry.stage}-${index}`} className="border-l-2 border-pine pl-3">
                <p className="text-sm font-medium">{entry.stage}</p>
                <p className="text-sm text-muted">{entry.detail}</p>
              </li>
            ))}
            {!search.progress.length ? <li className="text-sm text-muted">Waiting for the first step.</li> : null}
          </ol>
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">Provider usage</h2>
          <ul className="mt-4 divide-y divide-line">
            {usage.map((row, index) => (
              <li key={`${row.operation}-${index}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>
                  {row.provider}
                  <span className="block text-muted">{row.operation} · {row.units} units</span>
                </span>
                <span className="tabular-nums">{money(row.estimated_cents)}</span>
              </li>
            ))}
            {!usage.length ? <li className="text-sm text-muted">No paid steps yet.</li> : null}
          </ul>
          <p className="mt-3 text-sm text-muted">
            {search.duplicates} duplicate{search.duplicates === 1 ? "" : "s"} held out before enrichment.
          </p>
        </Panel>
      </div>
      {text ? (
        <Panel className="mt-4">
          <h2 className="font-display text-2xl">Summary</h2>
          <p className="mt-2 text-sm">{text}</p>
        </Panel>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" disabled={busy || search.status !== "completed"} onClick={() => act("summary")}>
          Summarize stored counts
        </Button>
        <Link to="/leads" className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-medium">
          Review leads
        </Link>
      </div>
    </div>
  );
}
