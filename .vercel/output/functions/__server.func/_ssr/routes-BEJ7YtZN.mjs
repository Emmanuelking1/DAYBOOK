import { o as __toESM } from "../_runtime.mjs";
import { i as bandLabel } from "./score-BunRsHRe.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Panel, p as verifyTone, t as Badge } from "./login-panel-zcwyaGS-.mjs";
import { l as getDashboard, t as AppShell } from "./server-Dr3yu8tD.mjs";
import { a as verifyLabel, i as searchStatusLabel, n as money, r as pct } from "./format-DUScbKv6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BEJ7YtZN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {}) });
}
function Dashboard() {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancel = false;
		getDashboard().then((value) => {
			if (!cancel) setData(value);
		}).catch((err) => {
			if (!cancel) setError(err instanceof Error ? err.message : "Could not load the workspace");
		});
		return () => {
			cancel = true;
		};
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-danger",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Overview"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-muted",
		children: "Opening the workspace…"
	})] });
	const stats = [
		{
			label: "Eligible businesses",
			value: String(data.totals.businesses)
		},
		{
			label: "Published emails",
			value: String(data.totals.published)
		},
		{
			label: "High priority",
			value: String(data.totals.highPriority)
		},
		{
			label: "Estimated spend",
			value: money(data.totals.spendCents)
		}
	];
	const rates = [
		["Business match", pct(data.rates.match)],
		["Contact found", pct(data.rates.contact)],
		["Check coverage", pct(data.rates.verificationCoverage)],
		["Invalid emails", pct(data.rates.invalid)],
		["Duplicates", pct(data.rates.duplicate)],
		["Qualified", pct(data.rates.qualified)],
		["Cost / qualified", data.rates.costPerQualifiedCents == null ? "—" : money(data.rates.costPerQualifiedCents)],
		["With evidence", pct(data.rates.completeness)]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-pine",
					children: "Workspace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl md:text-4xl",
					children: "What is ready to review"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-muted",
					children: "Searches use live OpenStreetMap listings for a city, then the restaurant website. A lower score means weaker evidence, not a confirmed poor fit. Missing emails stay blank."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/search/new",
				className: "inline-flex min-h-11 items-center rounded-full bg-pine px-4 text-sm font-medium text-pine-ink",
				children: "New search"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: stat.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl tabular-nums",
					children: stat.value
				})]
			}, stat.label))
		}),
		!data.totals.businesses ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 max-w-2xl text-muted",
			children: "No live leads yet. Start a search for a city. Daybook keeps the website and any email the business actually publishes."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Priority mix"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: [
						[
							"High priority",
							data.bands.high,
							"bg-pine"
						],
						[
							"Potential",
							data.bands.potential,
							"bg-ink"
						],
						[
							"Lower priority",
							data.bands.lower,
							"bg-warn"
						]
					].map(([label, count, color]) => {
						const max = Math.max(data.bands.high, data.bands.potential, data.bands.lower, 1);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: count
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-full bg-paper-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-2 rounded-full ${color}`,
								style: { width: `${count / max * 100}%` }
							})
						})] }, label);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: [
						data.totals.activeSearches,
						" active ",
						data.totals.activeSearches === 1 ? "run" : "runs",
						" ·",
						" ",
						data.totals.duplicates,
						" duplicates held out of the lead list"
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Quality"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-3",
				children: rates.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-sm text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-lg font-medium tabular-nums",
					children: value
				})] }, label))
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Recent runs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/search",
					className: "text-sm text-pine",
					children: "All runs"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: data.searches.slice(0, 4).map((search) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/search/$searchId",
						params: { searchId: search.id },
						className: "font-medium",
						children: [search.industry, search.region ? ` · ${search.region}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							search.eligible,
							" eligible of ",
							search.targetCount,
							" requested"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: search.status === "failed" ? "bad" : search.status === "completed" ? "good" : "warn",
						children: searchStatusLabel(search.status)
					})]
				}, search.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Highest scores"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/leads",
					className: "text-sm text-pine",
					children: "Lead list"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: data.topLeads.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/leads/$leadId",
							params: { leadId: lead.id },
							className: "font-medium",
							children: lead.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted",
							children: [
								lead.city,
								", ",
								lead.region,
								lead.domain ? ` · ${lead.domain}` : "",
								lead.email ? ` · ${lead.email}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: verifyTone(lead.verification),
								children: verifyLabel(lead.verification)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 text-right font-medium tabular-nums",
								children: lead.score ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: lead.band ? bandLabel(lead.band) : ""
							})
						]
					})]
				}, lead.id))
			})] })]
		})
	] });
}
//#endregion
export { DashboardPage as component };
