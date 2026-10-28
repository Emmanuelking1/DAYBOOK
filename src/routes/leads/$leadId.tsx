import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, Button, Field, Panel, SelectInput, TextArea, TextInput, verifyTone } from "@/components/ui";
import { FileOffer } from "@/components/file-offer";
import { startDownload } from "@/lib/download-file";
import { bandLabel, reviewLabel, verifyLabel } from "@/lib/prospecting/format";
import { draftEml, draftTextFile, fileSlug, mailToHref } from "@/lib/prospecting/files";
import { addSuppression, createDraft, getLead, refreshPublishedEmails, rescoreLead, updateDraft, updateLead } from "@/lib/prospecting/server";
import { REVIEW_STATUSES, RUBRIC } from "@/lib/prospecting/score";

export const Route = createFileRoute("/leads/$leadId")({ component: LeadPage });

function LeadPage() {
  const { leadId } = Route.useParams();
  return (
    <AppShell>
      <Lead leadId={leadId} />
    </AppShell>
  );
}

type LeadData = Extract<Awaited<ReturnType<typeof getLead>>, { ok: true }>["lead"];

function Lead({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<LeadData | null>(null);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("not_reviewed");
  const [tone, setTone] = useState("professional");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    const result = await getLead({ data: { id: leadId } });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setLead(result.lead);
    setNotes(result.lead.notes);
    setTags(result.lead.tags.join(", "));
    setStatus(result.lead.reviewStatus);
  }

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load the lead"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  useEffect(() => {
    if (!lead?.website || lead.siteScan === "none" || lead.siteScan === "failed" || lead.siteScan === "found") return;
    if (lead.contacts.some((contact) => contact.emails.length)) return;
    let cancel = false;
    refreshPublishedEmails({ data: { businessId: lead.id } })
      .then(() => {
        if (!cancel) return load();
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id, lead?.siteScan]);

  async function save() {
    setBusy(true);
    const result = await updateLead({
      data: {
        id: leadId,
        notes,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        reviewStatus: status,
      },
    });
    setBusy(false);
    setNotice(result.ok ? "Saved." : result.error);
    if (result.ok) await load();
  }

  async function draft() {
    setBusy(true);
    setNotice("");
    const result = await createDraft({ data: { businessId: leadId, tone } });
    setBusy(false);
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setNotice("Draft ready. Review it before anyone sends it.");
    await load();
  }

  async function scoreAgain() {
    setBusy(true);
    const result = await rescoreLead({ data: { id: leadId } });
    setBusy(false);
    setNotice(result.ok ? `Rescored at ${result.total}.` : result.error);
    if (result.ok) await load();
  }

  async function suppress(email: string) {
    setBusy(true);
    const result = await addSuppression({ data: { email, reason: "Suppressed from the lead record" } });
    setBusy(false);
    setNotice(result.ok ? "Suppressed. This address will not enter exports or new drafts." : result.error);
    if (result.ok) await load();
  }

  if (error) return <p className="text-danger">{error}</p>;
  if (!lead) return <p className="text-muted">Loading the record…</p>;
  const factors = lead.score
    ? [
        ["Industry fit", lead.score.industryFit, 30],
        ["Operational complexity", lead.score.operationalComplexity, 20],
        ["Growth signals", lead.score.growthSignals, 15],
        ["Decision maker", lead.score.decisionMaker, 15],
        ["Data completeness", lead.score.businessCompleteness, 10],
        ["Contact quality", lead.score.contactQuality, 10],
      ]
    : [];

  return (
    <div>
      <p className="mb-3 text-sm">
        <Link to="/leads" className="text-pine">
          All leads
        </Link>
      </p>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">{lead.name}</h1>
          <p className="mt-2 text-muted">
            {lead.address} · {lead.category}
          </p>
          {lead.website ? (
            <a className="text-sm text-pine" href={lead.website} target="_blank" rel="noopener noreferrer">
              {lead.website}
            </a>
          ) : (
            <p className="text-sm text-muted">No website published for this business</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-display text-4xl tabular-nums">{lead.score?.total ?? "—"}</p>
          <p className="text-sm text-muted">{lead.score ? `${bandLabel(lead.score.band)} · ${lead.score.confidence} confidence` : "Not scored"}</p>
        </div>
      </div>
      {lead.conflictNote ? (
        <Panel className="mt-4 border-warn/40">
          <p className="text-sm font-medium text-warn">Conflicting sources</p>
          <p className="mt-1 text-sm">{lead.conflictNote}</p>
        </Panel>
      ) : null}
      {notice ? <p className="mt-4 text-sm text-muted">{notice}</p> : null}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <Panel>
            <h2 className="font-display text-2xl">Contacts</h2>
            {lead.contacts.length ? (
              <ul className="mt-3 space-y-4">
                {lead.contacts.map((contact) => (
                  <li key={contact.id}>
                    <p className="font-medium">
                      {contact.name} · {contact.title}
                    </p>
                    <p className="text-sm text-muted">{contact.contact_type === "person" ? "Named person" : "Shared inbox"}</p>
                    {contact.emails.map((email) => (
                      <div key={email.id} className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm">{email.email}</span>
                        <Badge tone={verifyTone(email.verification_status)}>{verifyLabel(email.verification_status)}</Badge>
                        <span className="text-xs text-muted">{email.email_type}</span>
                        {email.verification_status !== "suppressed" ? (
                          <Button variant="ghost" className="min-h-9 px-2" disabled={busy} onClick={() => suppress(email.email)}>
                            Suppress
                          </Button>
                        ) : null}
                      </div>
                    ))}
                    {contact.emails.map((email) => (
                      <p key={`${email.id}-detail`} className="mt-1 text-sm text-muted">
                        {email.source} · {email.documented ? "documented" : "not documented"}
                        {email.predicted ? " · predicted" : ""} · {email.verification_provider ?? "No provider yet"}
                        {email.verification_detail ? ` — ${email.verification_detail}` : ""}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">
                {!lead.website
                  ? "No website was published, so there is no page to read for an email."
                  : lead.siteScan === "none"
                    ? "The website was opened. It does not publish an email address."
                    : lead.siteScan === "failed"
                      ? "The website could not be opened, so no email was guessed."
                      : "Checking the website for a published email…"}
              </p>
            )}
          </Panel>
          <Panel>
            <h2 className="font-display text-2xl">Evidence</h2>
            <ul className="mt-3 space-y-3">
              {lead.evidence.map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="font-medium">{item.claim}</p>
                  <p>{item.value}</p>
                  <p className="text-muted">
                    {item.source_label} · {item.provider} · {item.confidence} confidence · {item.source_ref}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="font-display text-2xl">Outreach</h2>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <Field label="Tone">
                <SelectInput value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option value="professional">Professional</option>
                  <option value="concise">Concise</option>
                  <option value="conversational">Conversational</option>
                </SelectInput>
              </Field>
              <Button disabled={busy || status === "opted_out"} onClick={draft}>
                Generate draft
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted">Drafts are not sent. Mark “Sent externally” only after you send one yourself.</p>
            <div className="mt-4 space-y-4">
              {lead.drafts.map((draft) => (
                <DraftEditor
                  key={draft.id}
                  draft={draft}
                  business={lead.name}
                  to={lead.contacts.flatMap((contact) => contact.emails).find((email) => email.verification_status !== "suppressed" && email.verification_status !== "invalid")?.email}
                  onSaved={load}
                />
              ))}
            </div>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Score</h2>
              <Button variant="ghost" disabled={busy} onClick={scoreAgain}>
                Recalculate
              </Button>
            </div>
            {lead.score ? (
              <>
                <ul className="mt-4 space-y-3">
                  {factors.map(([label, value, weight]) => (
                    <li key={String(label)}>
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span className="tabular-nums text-muted">
                          {value}/{weight}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-paper-2">
                        <div className="h-1.5 rounded-full bg-pine" style={{ width: `${(Number(value) / Number(weight)) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm">{lead.score.explanation}</p>
                <p className="mt-2 text-xs text-muted">{lead.score.modelVersion}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">No score yet.</p>
            )}
            <ul className="mt-4 space-y-1 text-xs text-muted">
              {RUBRIC.map((row) => (
                <li key={row.key}>
                  {row.label}: {row.weight}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="space-y-4">
            <Field label="Review status">
              <SelectInput value={status} onChange={(e) => setStatus(e.target.value)}>
                {REVIEW_STATUSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Tags" hint="Comma-separated.">
              <TextInput value={tags} onChange={(e) => setTags(e.target.value)} />
            </Field>
            <Field label="Notes">
              <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <Button disabled={busy} onClick={save}>
              Save record
            </Button>
            <p className="text-sm text-muted">Current state: {reviewLabel(lead.reviewStatus)}</p>
          </Panel>
          <Panel>
            <h2 className="font-display text-2xl">Activity</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {lead.activity.map((item, index) => (
                <li key={`${item.created_at}-${index}`}>
                  <span className="text-muted">{item.kind.replaceAll("_", " ")} · </span>
                  {item.detail}
                </li>
              ))}
              {!lead.activity.length ? <li className="text-muted">No edits yet.</li> : null}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function DraftEditor({
  draft,
  business,
  to,
  onSaved,
}: {
  draft: LeadData["drafts"][number];
  business: string;
  to?: string;
  onSaved: () => Promise<void>;
}) {
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState("");

  async function save(status: "draft" | "approved") {
    const result = await updateDraft({ data: { id: draft.id, subject, body, status } });
    setMessage(result.ok ? (status === "approved" ? "Approved. Still not sent." : "Draft saved.") : result.error);
    if (result.ok) await onSaved();
  }

  async function download(kind: "txt" | "eml") {
    const slug = fileSlug(business);
    const filename = kind === "txt" ? `${slug}.txt` : `${slug}.eml`;
    const mime = kind === "txt" ? "text/plain;charset=utf-8" : "message/rfc822";
    const content = kind === "txt"
      ? draftTextFile({ business, subject, body, status: draft.status })
      : draftEml({ business, to, subject, body });
    startDownload(filename, content, mime);
    setOffer(kind === "eml" ? "Downloading email file" : "Downloading file");
    setMessage("");
  }

  function send() {
    if (!to) {
      setMessage("This lead has no published email, so there is no address to send to.");
      return;
    }
    window.location.href = mailToHref(to, subject, body);
    setMessage("Your email app is opening with this draft. Send it from there. Daybook does not send it itself.");
  }

  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge tone={draft.status === "approved" ? "good" : "neutral"}>{draft.status === "approved" ? "Approved" : "Draft"}</Badge>
        <Badge tone="ink">{draft.origin === "grok" ? "Grok" : "Template"}</Badge>
        {draft.edited ? <Badge>Edited</Badge> : null}
      </div>
      <Field label="Subject">
        <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} />
      </Field>
      <div className="mt-3">
        <Field label="Message">
          <TextArea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-48" />
        </Field>
      </div>
      {draft.warnings.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
          {draft.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
      {offer ? <div className="mt-3"><FileOffer label={offer} /></div> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => save("draft")}>
          Save edits
        </Button>
        <Button onClick={() => save("approved")}>Approve draft</Button>
        <Button onClick={send}>Send email</Button>
        <Button variant="secondary" onClick={() => download("txt")}>
          Download text
        </Button>
        <Button variant="secondary" onClick={() => download("eml")}>
          Download email file
        </Button>
      </div>
    </div>
  );
}
