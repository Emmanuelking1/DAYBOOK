import { o as __toESM } from "../_runtime.mjs";
import { r as RUBRIC } from "./score-BunRsHRe.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageTitle, l as TextInput, n as Button, o as Panel, r as Field, s as SelectInput } from "./login-panel-zcwyaGS-.mjs";
import { o as createSearch, t as AppShell } from "./server-Dr3yu8tD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-BN-ceDGp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATES = [
	"Alabama",
	"Alaska",
	"Arizona",
	"Arkansas",
	"California",
	"Colorado",
	"Connecticut",
	"Delaware",
	"District of Columbia",
	"Florida",
	"Georgia",
	"Hawaii",
	"Idaho",
	"Illinois",
	"Indiana",
	"Iowa",
	"Kansas",
	"Kentucky",
	"Louisiana",
	"Maine",
	"Maryland",
	"Massachusetts",
	"Michigan",
	"Minnesota",
	"Mississippi",
	"Missouri",
	"Montana",
	"Nebraska",
	"Nevada",
	"New Hampshire",
	"New Jersey",
	"New Mexico",
	"New York",
	"North Carolina",
	"North Dakota",
	"Ohio",
	"Oklahoma",
	"Oregon",
	"Pennsylvania",
	"Rhode Island",
	"South Carolina",
	"South Dakota",
	"Tennessee",
	"Texas",
	"Utah",
	"Vermont",
	"Virginia",
	"Washington",
	"West Virginia",
	"Wisconsin",
	"Wyoming"
];
var ROLES = [
	"Owner",
	"Founder",
	"General manager",
	"Managing partner",
	"Business inbox"
];
function NewSearchPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewSearch, {}) });
}
function NewSearch() {
	const navigate = useNavigate();
	const [industry, setIndustry] = (0, import_react.useState)("Independent restaurants");
	const [region, setRegion] = (0, import_react.useState)("Texas");
	const [city, setCity] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)(25);
	const [roles, setRoles] = (0, import_react.useState)([
		"Owner",
		"Founder",
		"General manager"
	]);
	const [professional, setProfessional] = (0, import_react.useState)(true);
	const [business, setBusiness] = (0, import_react.useState)(true);
	const [website, setWebsite] = (0, import_react.useState)(true);
	const [multi, setMulti] = (0, import_react.useState)(true);
	const [exclusions, setExclusions] = (0, import_react.useState)("");
	const [spend, setSpend] = (0, import_react.useState)(25);
	const [simulate, setSimulate] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	function toggleRole(role) {
		setRoles((current) => current.includes(role) ? current.filter((r) => r !== role) : [...current, role]);
	}
	async function submit(event) {
		event.preventDefault();
		setError("");
		const emailTypes = [professional ? "professional" : "", business ? "business" : ""].filter(Boolean);
		setPending(true);
		const result = await createSearch({ data: {
			industry,
			country: "United States",
			region,
			city,
			targetCount: target,
			contactRoles: roles,
			emailTypes,
			preferMultiple: multi,
			requireWebsite: website,
			exclusions,
			maxSpendCents: Math.round(spend * 100),
			simulateFailure: simulate
		} });
		setPending(false);
		if (!result.ok) {
			setError(result.error);
			return;
		}
		await navigate({
			to: "/search/$searchId",
			params: { searchId: result.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
		eyebrow: "New search",
		title: "Define the market",
		lede: "Target count is a goal. The run keeps restaurants OpenStreetMap returns for that city, then reads each company website for a published email."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Industry",
							hint: "Live search covers restaurants, cafes, and bars. Other industries return no records.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: industry,
								onChange: (e) => setIndustry(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Country",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: "United States",
								readOnly: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "State",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectInput, {
								value: region,
								onChange: (e) => setRegion(e.target.value),
								children: STATES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							hint: "Required. Results are the live page for this city, not every restaurant in the state.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: city,
								onChange: (e) => setCity(e.target.value),
								placeholder: "Austin",
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Target count",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "number",
								min: 1,
								max: 200,
								value: target,
								onChange: (e) => setTarget(Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Maximum spend",
							hint: "Map lookups are free. This cap still stops paid draft and summary calls.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "number",
								min: 0,
								max: 1e3,
								value: spend,
								onChange: (e) => setSpend(Number(e.target.value))
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "mb-2 text-sm font-medium",
					children: "Preferred contacts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: ROLES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: roles.includes(role),
							onChange: () => toggleRole(role)
						}), role]
					}, role))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "sr-only",
							children: "Rules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							label: "Person-specific emails",
							checked: professional,
							onChange: setProfessional
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							label: "Business inboxes",
							checked: business,
							onChange: setBusiness
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							label: "Require a website",
							checked: website,
							onChange: setWebsite
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							label: "Prefer multiple locations",
							checked: multi,
							onChange: setMulti
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Exclusions",
					hint: "Comma-separated words. Matching names are left out, not rewritten.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: exclusions,
						onChange: (e) => setExclusions(e.target.value),
						placeholder: "cantina"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					label: "Demonstrate a recoverable provider timeout",
					checked: simulate,
					onChange: setSimulate
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending,
					children: pending ? "Queuing…" : "Start search"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Scoring rubric"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Weights are a starting assumption, recomputed in application code."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: RUBRIC.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: row.weight
					})]
				}, row.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "80–100 high priority · 60–79 potential · below 60 lower priority."
			})
		] })]
	})] });
}
function Check({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-11 items-center gap-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked)
		}), label]
	});
}
//#endregion
export { NewSearchPage as component };
