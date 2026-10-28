import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge, Button, PageTitle, Panel } from "@/components/ui";
import { FileOffer } from "@/components/file-offer";
import { startDownload } from "@/lib/download-file";
import { draftEml, draftTextFile, fileSlug, mailToHref, zipStore } from "@/lib/prospecting/files";
import { listDrafts } from "@/lib/prospecting/server";

export const Route = createFileRoute("/drafts")({ component: DraftsPage });

function DraftsPage() {
  return (
    <AppShell>
      <Drafts />
    </AppShell>
  );
}

function Drafts() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listDrafts>>>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [offer, setOffer] = useState("");

  useEffect(() => {
    listDrafts()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load drafts"));
  }, []);

  function save(filename: string, content: string | Uint8Array, mime: string) {
    startDownload(filename, content, mime);
    setOffer(filename.endsWith(".csv") ? "Downloading CSV file" : "Downloading file");
    setNotice("");
  }

  async function saveAll(kind: "txt" | "zip") {
    if (!rows.length) return;
    if (kind === "txt") {
      const text = rows
        .map((draft) => draftTextFile({ business: draft.business_name, city: draft.city, subject: draft.subject, body: draft.body, status: draft.status }))
        .join("\n----\n\n");
      await save("daybook-drafts.txt", text, "text/plain;charset=utf-8");
      return;
    }
    const zip = zipStore(
      rows.map((draft) => ({
        name: `${fileSlug(draft.business_name)}-${fileSlug(draft.subject)}.txt`,
        text: draftTextFile({ business: draft.business_name, city: draft.city, subject: draft.subject, body: draft.body, status: draft.status }),
      })),
    );
    await save("daybook-drafts.zip", zip, "application/zip");
  }

  return (
    <div>
      <PageTitle
        eyebrow="Drafts"
        title="Messages waiting for a person"
        lede="Send a draft from your own mailbox, or download it. Approving a draft does not send it by itself."
      />
      {error ? <p className="text-danger">{error}</p> : null}
      {rows.length ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => saveAll("txt")}>
            Download all as text
          </Button>
          <Button variant="secondary" onClick={() => saveAll("zip")}>
            Download all as zip
          </Button>
        </div>
      ) : null}
      {notice ? <p className="mb-3 text-sm text-muted">{notice}</p> : null}
      {offer ? <FileOffer label={offer} /> : null}
      <div className="space-y-3">
        {rows.map((draft) => (
          <Panel key={draft.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={draft.status === "approved" ? "good" : "neutral"}>
                {draft.status === "approved" ? "Approved" : "Draft"}
              </Badge>
              <Badge tone="ink">{draft.origin === "grok" ? "Grok" : "Template"}</Badge>
              {draft.edited ? <Badge>Edited</Badge> : null}
            </div>
            <h2 className="mt-3 font-display text-2xl">{draft.subject}</h2>
            <p className="mt-1 text-sm text-muted">
              {draft.business_name} · {draft.city} · {draft.tone}
            </p>
            <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm">{draft.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.email ? (
                <a href={mailToHref(draft.email, draft.subject, draft.body)} className="inline-flex min-h-11 items-center rounded-full bg-pine px-4 text-sm font-medium text-pine-ink">
                  Send email
                </a>
              ) : (
                <p className="text-sm text-muted">No published email to send to.</p>
              )}
              <Button
                variant="secondary"
                onClick={() =>
                  save(
                    `${fileSlug(draft.business_name)}.txt`,
                    draftTextFile({ business: draft.business_name, city: draft.city, subject: draft.subject, body: draft.body, status: draft.status }),
                    "text/plain;charset=utf-8",
                  )
                }
              >
                Download text
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  save(
                    `${fileSlug(draft.business_name)}.eml`,
                    draftEml({ business: draft.business_name, subject: draft.subject, body: draft.body }),
                    "message/rfc822",
                  )
                }
              >
                Download email file
              </Button>
              <Link to="/leads/$leadId" params={{ leadId: draft.business_id }} className="inline-flex min-h-11 items-center text-sm text-pine">
                Open lead
              </Link>
            </div>
          </Panel>
        ))}
        {!rows.length && !error ? (
          <p className="text-muted">No drafts yet. Open a lead and generate one from its stored facts.</p>
        ) : null}
      </div>
    </div>
  );
}