import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageTitle, c as TextArea, l as TextInput, n as Button, o as Panel, r as Field, t as Badge } from "./login-panel-zcwyaGS-.mjs";
import { C as updateSettings, d as getSettings, g as removeSuppression, n as addSuppression, s as deleteWorkspaceData, t as AppShell } from "./server-Dr3yu8tD.mjs";
import { n as money } from "./format-DUScbKv6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Dol7pXi3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {}) });
}
function Settings() {
	const [data, setData] = (0, import_react.useState)(null);
	const [description, setDescription] = (0, import_react.useState)("");
	const [spend, setSpend] = (0, import_react.useState)(25);
	const [email, setEmail] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("Do not contact");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	async function load() {
		const settings = await getSettings();
		setData(settings);
		setDescription(settings.serviceDescription);
		setSpend(settings.spendLimitCents / 100);
	}
	(0, import_react.useEffect)(() => {
		load().catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"));
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-danger",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Loading settings…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			eyebrow: "Settings",
			title: "Limits, sources, and do-not-contact",
			lede: "Secrets stay on the server. This screen shows provider status, not credentials."
		}),
		notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: notice
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Workspace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Approved service description",
							hint: "Drafts may quote this. They may not invent a stronger claim.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: description,
								onChange: (e) => setDescription(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Spend limit (USD)",
							hint: "Searches and model calls stop when estimated spend reaches this.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "number",
								min: 0,
								max: 1e3,
								value: spend,
								onChange: (e) => setSpend(Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								const result = await updateSettings({ data: {
									serviceDescription: description,
									spendLimitCents: Math.round(spend * 100)
								} });
								setNotice(result.ok ? "Settings saved." : result.error);
							},
							children: "Save settings"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Sources"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: data.providers.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: provider.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: provider.status === "Available" || provider.status === "Live" ? "good" : provider.status === "Not connected" || provider.status === "Unavailable" ? "warn" : "neutral",
								children: provider.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: provider.detail
						})] }, provider.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-6 font-medium",
						children: "Estimated usage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [data.usage.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								row.provider,
								" · ",
								row.units,
								" units"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: money(row.cents)
							})]
						}, row.provider)), !data.usage.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: "No usage yet."
						}) : null]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Suppression"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "A suppressed address never enters an export or a new draft."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "name@restaurant.example"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Reason",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								const result = await addSuppression({ data: {
									email,
									reason
								} });
								setNotice(result.ok ? "Added to the do-not-contact list." : result.error);
								if (result.ok) {
									setEmail("");
									await load();
								}
							},
							children: "Add suppression"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-line",
							children: [data.suppression.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [row.contact_key, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-muted",
									children: row.reason
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: async () => {
										await removeSuppression({ data: { email: row.contact_key } });
										await load();
									},
									children: "Remove"
								})]
							}, row.contact_key)), !data.suppression.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted",
								children: "No suppressed addresses."
							}) : null]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Retention"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "This workspace keeps live prospect records until you delete them. Sample addresses such as .example are not loaded."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Type DELETE to remove workspace data",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: confirm,
								onChange: (e) => setConfirm(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: async () => {
								const result = await deleteWorkspaceData({ data: { confirm } });
								setNotice(result.ok ? "Workspace data deleted." : result.error);
								if (result.ok) {
									setConfirm("");
									await load();
								}
							},
							children: "Delete my prospecting data"
						})
					]
				})
			]
		})
	] });
}
//#endregion
export { SettingsPage as component };
