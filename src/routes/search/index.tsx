import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, PageTitle, Panel } from "@/components/ui";
import { money, searchStatusLabel } from "@/lib/prospecting/format";
import { getDashboard } from "@/lib/prospecting/server";

export const Route = createFileRoute("/search/")({ component: RunsPage });

function RunsPage() {
  return (
    <AppShell>
      <Runs />
    </AppShell>
  );
}

function Runs() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getDashboard>>["searches"]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getDashboard()
      .then((data) => setRows(data.searches))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load runs"));
  }, []);
  return (
    <div>
      <PageTitle
        eyebrow="Runs"
        title="Search progress"
        lede="Each run keeps its criteria, spend, and a log of what the pipeline actually did."
      />
      {error ? <p className="text-danger">{error}</p> : null}
      <div className="space-y-3">
        {rows.map((run) => (
          <Panel key={run.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link to="/search/$searchId" params={{ searchId: run.id }} className="font-medium">
                {run.industry}
                {run.region ? ` · ${run.region}` : ""}
                {run.city ? ` · ${run.city}` : ""}
              </Link>
              <p className="text-sm text-muted">
                {run.eligible} eligible · target {run.targetCount} · {money(run.spentCents)} estimated
                {run.isPilot ? " · pilot sample" : ""}
              </p>
            </div>
            <Badge tone={run.status === "completed" ? "good" : run.status === "failed" ? "bad" : "warn"}>
              {searchStatusLabel(run.status)}
            </Badge>
          </Panel>
        ))}
        {!rows.length && !error ? <p className="text-muted">No runs yet.</p> : null}
      </div>
    </div>
  );
}
