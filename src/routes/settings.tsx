import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, Button, Field, PageTitle, Panel, TextArea, TextInput } from "@/components/ui";
import { money } from "@/lib/prospecting/format";
import {
  addSuppression,
  deleteWorkspaceData,
  getSettings,
  removeSuppression,
  updateSettings,
} from "@/lib/prospecting/server";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <AppShell>
      <Settings />
    </AppShell>
  );
}

function Settings() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getSettings>> | null>(null);
  const [description, setDescription] = useState("");
  const [spend, setSpend] = useState(25);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Do not contact");
  const [confirm, setConfirm] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const settings = await getSettings();
    setData(settings);
    setDescription(settings.serviceDescription);
    setSpend(settings.spendLimitCents / 100);
  }

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load settings"));
  }, []);

  if (error) return <p className="text-danger">{error}</p>;
  if (!data) return <p className="text-muted">Loading settings…</p>;

  return (
    <div>
      <PageTitle
        eyebrow="Settings"
        title="Limits, sources, and do-not-contact"
        lede="Secrets stay on the server. This screen shows provider status, not credentials."
      />
      {notice ? <p className="mb-4 text-sm text-muted">{notice}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="space-y-4">
          <h2 className="font-display text-2xl">Workspace</h2>
          <Field label="Approved service description" hint="Drafts may quote this. They may not invent a stronger claim.">
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Spend limit (USD)" hint="Searches and model calls stop when estimated spend reaches this.">
            <TextInput type="number" min={0} max={1000} value={spend} onChange={(e) => setSpend(Number(e.target.value))} />
          </Field>
          <Button
            onClick={async () => {
              const result = await updateSettings({
                data: { serviceDescription: description, spendLimitCents: Math.round(spend * 100) },
              });
              setNotice(result.ok ? "Settings saved." : result.error);
            }}
          >
            Save settings
          </Button>
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">Sources</h2>
          <ul className="mt-3 space-y-3">
            {data.providers.map((provider) => (
              <li key={provider.name}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{provider.name}</p>
                  <Badge tone={provider.status === "Available" || provider.status === "Live" ? "good" : provider.status === "Not connected" || provider.status === "Unavailable" ? "warn" : "neutral"}>
                    {provider.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{provider.detail}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-medium">Estimated usage</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {data.usage.map((row) => (
              <li key={row.provider} className="flex justify-between">
                <span>
                  {row.provider} · {row.units} units
                </span>
                <span className="tabular-nums">{money(row.cents)}</span>
              </li>
            ))}
            {!data.usage.length ? <li className="text-muted">No usage yet.</li> : null}
          </ul>
        </Panel>
        <Panel className="space-y-3">
          <h2 className="font-display text-2xl">Suppression</h2>
          <p className="text-sm text-muted">A suppressed address never enters an export or a new draft.</p>
          <Field label="Email">
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@restaurant.example" />
          </Field>
          <Field label="Reason">
            <TextInput value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <Button
            onClick={async () => {
              const result = await addSuppression({ data: { email, reason } });
              setNotice(result.ok ? "Added to the do-not-contact list." : result.error);
              if (result.ok) {
                setEmail("");
                await load();
              }
            }}
          >
            Add suppression
          </Button>
          <ul className="divide-y divide-line">
            {data.suppression.map((row) => (
              <li key={row.contact_key} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>
                  {row.contact_key}
                  <span className="block text-muted">{row.reason}</span>
                </span>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await removeSuppression({ data: { email: row.contact_key } });
                    await load();
                  }}
                >
                  Remove
                </Button>
              </li>
            ))}
            {!data.suppression.length ? <li className="text-sm text-muted">No suppressed addresses.</li> : null}
          </ul>
        </Panel>
        <Panel className="space-y-3">
          <h2 className="font-display text-2xl">Retention</h2>
          <p className="text-sm text-muted">
            This workspace keeps live prospect records until you delete them. Sample addresses such as .example are not loaded.
          </p>
          <Field label="Type DELETE to remove workspace data">
            <TextInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </Field>
          <Button
            variant="danger"
            onClick={async () => {
              const result = await deleteWorkspaceData({ data: { confirm } });
              setNotice(result.ok ? "Workspace data deleted." : result.error);
              if (result.ok) {
                setConfirm("");
                await load();
              }
            }}
          >
            Delete my prospecting data
          </Button>
        </Panel>
      </div>
    </div>
  );
}
