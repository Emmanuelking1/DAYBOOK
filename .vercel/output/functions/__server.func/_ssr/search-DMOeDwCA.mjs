import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageTitle, o as Panel, t as Badge } from "./login-panel-zcwyaGS-.mjs";
import { l as getDashboard, t as AppShell } from "./server-Dr3yu8tD.mjs";
import { i as searchStatusLabel, n as money } from "./format-DUScbKv6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DMOeDwCA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RunsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Runs, {}) });
}
function Runs() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getDashboard().then((data) => setRows(data.searches)).catch((err) => setError(err instanceof Error ? err.message : "Could not load runs"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			eyebrow: "Runs",
			title: "Search progress",
			lede: "Each run keeps its criteria, spend, and a log of what the pipeline actually did."
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-danger",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [rows.map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/search/$searchId",
					params: { searchId: run.id },
					className: "font-medium",
					children: [
						run.industry,
						run.region ? ` · ${run.region}` : "",
						run.city ? ` · ${run.city}` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						run.eligible,
						" eligible · target ",
						run.targetCount,
						" · ",
						money(run.spentCents),
						" estimated",
						run.isPilot ? " · pilot sample" : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: run.status === "completed" ? "good" : run.status === "failed" ? "bad" : "warn",
					children: searchStatusLabel(run.status)
				})]
			}, run.id)), !rows.length && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "No runs yet."
			}) : null]
		})
	] });
}
//#endregion
export { RunsPage as component };
