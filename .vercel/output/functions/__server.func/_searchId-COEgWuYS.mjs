import { o as __toESM } from "./_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Route$2 } from "./_ssr/router-BAntTsKt.mjs";
import { a as PageTitle, n as Button, o as Panel, t as Badge } from "./_ssr/login-panel-zcwyaGS-.mjs";
import { b as summarizeSearch, i as cancelSearch, r as advanceSearch, t as AppShell, v as resumeSearch, y as retrySearch } from "./_ssr/server-Dr3yu8tD.mjs";
import { i as searchStatusLabel, n as money, t as isOpenSearch } from "./_ssr/format-DUScbKv6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_searchId-COEgWuYS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RunPage() {
	const { searchId } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Run, { searchId }) });
}
function Run({ searchId }) {
	const [payload, setPayload] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [stuck, setStuck] = (0, import_react.useState)(false);
	const [summary, setSummary] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
				setPayload({
					search: result.search,
					usage: result.usage
				});
				if (!isOpenSearch(result.search.status)) return;
				if (result.search.status === last && result.search.status.endsWith("ing")) {
					setStuck(true);
					return;
				}
				last = result.search.status;
				await new Promise((resolve) => setTimeout(resolve, 400));
			}
		}
		loop().catch((err) => setError(err instanceof Error ? err.message : "The run failed"));
		return () => {
			stop = true;
		};
	}, [searchId]);
	async function act(kind) {
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
	if (error && !payload) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-danger",
		children: error
	});
	if (!payload) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Search run"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-muted",
		children: "Starting the pipeline…"
	})] });
	const { search, usage } = payload;
	const text = summary || search.summary;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			eyebrow: search.isPilot ? "Pilot sample" : "Search run",
			title: `${search.industry}${search.region ? ` in ${search.region}` : ""}`,
			lede: search.note || "Working through discovery, enrichment, checks, and scoring."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: search.status === "completed" ? "good" : search.status === "failed" ? "bad" : "warn",
					children: searchStatusLabel(search.status)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted tabular-nums",
					children: [
						money(search.spentCents),
						" of ",
						money(search.maxSpendCents)
					]
				}),
				isOpenSearch(search.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: busy,
					onClick: () => act("cancel"),
					children: "Cancel"
				}) : null,
				search.status === "failed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => act("retry"),
					children: "Retry failed step"
				}) : null,
				stuck ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: busy,
					onClick: () => act("resume"),
					children: "Resume stuck step"
				}) : null
			]
		}),
		search.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-danger",
			children: search.error
		}) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-danger",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				["Examined", search.examined],
				["Matched", search.matched],
				["Eligible", search.eligible],
				["Scored", search.completed]
			].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-3xl tabular-nums",
					children: value
				})]
			}, String(label)))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Pipeline"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 space-y-3",
				children: [search.progress.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-l-2 border-pine pl-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: entry.stage
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: entry.detail
					})]
				}, `${entry.stage}-${index}`)), !search.progress.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Waiting for the first step."
				}) : null]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Provider usage"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 divide-y divide-line",
					children: [usage.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [row.provider, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-muted",
							children: [
								row.operation,
								" · ",
								row.units,
								" units"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: money(row.estimated_cents)
						})]
					}, `${row.operation}-${index}`)), !usage.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "No paid steps yet."
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						search.duplicates,
						" duplicate",
						search.duplicates === 1 ? "" : "s",
						" held out before enrichment."
					]
				})
			] })]
		}),
		text ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Summary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: text
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				disabled: busy || search.status !== "completed",
				onClick: () => act("summary"),
				children: "Summarize stored counts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/leads",
				className: "inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-medium",
				children: "Review leads"
			})]
		})
	] });
}
//#endregion
export { RunPage as component };
