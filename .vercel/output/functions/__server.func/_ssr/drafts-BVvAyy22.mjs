import { o as __toESM } from "../_runtime.mjs";
import { a as zipStore, n as draftTextFile, r as fileSlug, t as draftEml } from "./files-C7QCvZDX.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageTitle, n as Button, o as Panel, t as Badge } from "./login-panel-zcwyaGS-.mjs";
import { f as listDrafts, t as AppShell } from "./server-Dr3yu8tD.mjs";
import { n as startDownload, t as FileOffer } from "./file-offer-D95Cf6h-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drafts-BVvAyy22.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DraftsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drafts, {}) });
}
function Drafts() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [offer, setOffer] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listDrafts().then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Could not load drafts"));
	}, []);
	async function save(filename, content, mime) {
		startDownload(filename, content, mime);
		const text = typeof content === "string" ? content : null;
		setOffer({
			name: filename,
			text,
			summary: text ? `If the browser did not save ${filename}, copy the text below.` : `If the browser did not save ${filename}, use the text download instead.`
		});
		setNotice("");
	}
	async function saveAll(kind) {
		if (!rows.length) return;
		if (kind === "txt") {
			await save("daybook-drafts.txt", rows.map((draft) => draftTextFile({
				business: draft.business_name,
				city: draft.city,
				subject: draft.subject,
				body: draft.body,
				status: draft.status
			})).join("\n----\n\n"), "text/plain;charset=utf-8");
			return;
		}
		await save("daybook-drafts.zip", zipStore(rows.map((draft) => ({
			name: `${fileSlug(draft.business_name)}-${fileSlug(draft.subject)}.txt`,
			text: draftTextFile({
				business: draft.business_name,
				city: draft.city,
				subject: draft.subject,
				body: draft.body,
				status: draft.status
			})
		}))), "application/zip");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			eyebrow: "Drafts",
			title: "Messages waiting for a person",
			lede: "Copy or save a draft, then send it from your own mailbox. Approving a draft does not send it."
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-danger",
			children: error
		}) : null,
		rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => saveAll("txt"),
				children: "Download all as text"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => saveAll("zip"),
				children: "Download all as zip"
			})]
		}) : null,
		notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: notice
		}) : null,
		offer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileOffer, {
			name: offer.name,
			text: offer.text,
			summary: offer.summary,
			onClose: () => setOffer(null)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [rows.map((draft) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: draft.status === "approved" ? "good" : "neutral",
							children: draft.status === "approved" ? "Approved" : "Draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ink",
							children: draft.origin === "grok" ? "Grok" : "Template"
						}),
						draft.edited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Edited" }) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-2xl",
					children: draft.subject
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						draft.business_name,
						" · ",
						draft.city,
						" · ",
						draft.tone
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 line-clamp-4 whitespace-pre-wrap text-sm",
					children: draft.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => save(`${fileSlug(draft.business_name)}.txt`, draftTextFile({
								business: draft.business_name,
								city: draft.city,
								subject: draft.subject,
								body: draft.body,
								status: draft.status
							}), "text/plain;charset=utf-8"),
							children: "Download text"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => save(`${fileSlug(draft.business_name)}.eml`, draftEml({
								business: draft.business_name,
								subject: draft.subject,
								body: draft.body
							}), "message/rfc822"),
							children: "Download email file"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/leads/$leadId",
							params: { leadId: draft.business_id },
							className: "inline-flex min-h-11 items-center text-sm text-pine",
							children: "Open lead"
						})
					]
				})
			] }, draft.id)), !rows.length && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "No drafts yet. Open a lead and generate one from its stored facts."
			}) : null]
		})
	] });
}
//#endregion
export { DraftsPage as component };
