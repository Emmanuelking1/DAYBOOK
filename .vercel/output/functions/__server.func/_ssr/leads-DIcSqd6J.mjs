import { o as __toESM } from "../_runtime.mjs";
import { i as leadsToCsv } from "./files-C7QCvZDX.mjs";
import { a as reviewLabel, i as bandLabel, n as REVIEW_STATUSES } from "./score-BunRsHRe.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageTitle, l as TextInput, n as Button, o as Panel, p as verifyTone, s as SelectInput, t as Badge } from "./login-panel-zcwyaGS-.mjs";
import { c as exportLeads, h as refreshPublishedEmails, m as mergeLead, p as listLeads, t as AppShell } from "./server-Dr3yu8tD.mjs";
import { n as startDownload, t as FileOffer } from "./file-offer-D95Cf6h-.mjs";
import { a as verifyLabel } from "./format-DUScbKv6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-DIcSqd6J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeadsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leads, {}) });
}
function Leads() {
	const [leads, setLeads] = (0, import_react.useState)([]);
	const [duplicates, setDuplicates] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [band, setBand] = (0, import_react.useState)("all");
	const [verification, setVerification] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [page, setPage] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [offer, setOffer] = (0, import_react.useState)(null);
	async function load() {
		const data = await listLeads();
		setLeads(data.leads);
		setDuplicates(data.duplicates);
	}
	(0, import_react.useEffect)(() => {
		load().catch((err) => setError(err instanceof Error ? err.message : "Could not load leads"));
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return leads.filter((lead) => {
			if (band !== "all" && lead.band !== band) return false;
			if (verification !== "all" && (lead.verification ?? "none") !== verification) return false;
			if (status !== "all" && lead.reviewStatus !== status) return false;
			if (!query) return true;
			return [
				lead.name,
				lead.city,
				lead.region,
				lead.email,
				...lead.emails,
				lead.contactName,
				lead.domain,
				lead.website
			].filter(Boolean).join(" ").toLowerCase().includes(query);
		});
	}, [
		leads,
		q,
		band,
		verification,
		status
	]);
	const pageSize = 8;
	const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const slice = filtered.slice(page * pageSize, page * pageSize + pageSize);
	function toggle(id) {
		setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	}
	async function readSites() {
		setNotice("");
		setBusy(true);
		try {
			const result = await refreshPublishedEmails();
			setNotice(result.found ? `Saved ${result.found} published email${result.found === 1 ? "" : "s"} from ${result.read} websites.${result.left ? ` ${result.left} sites are still unread. Run it again.` : ""}` : `Read ${result.read} websites and found no new published email. Blank addresses were not guessed.${result.left ? ` ${result.left} sites are still unread.` : ""}`);
			await load();
		} catch (err) {
			setNotice(err instanceof Error ? err.message : "Could not read the websites.");
		} finally {
			setBusy(false);
		}
	}
	async function download(ids) {
		setNotice("");
		const file = leadsToCsv(leads, ids);
		if (!file.count) {
			setOffer(null);
			setNotice("Nothing to download. Invalid, suppressed, and opted-out records stay out of the file.");
			return;
		}
		startDownload(file.filename, file.csv, "text/csv;charset=utf-8");
		setOffer({
			name: file.filename,
			text: file.csv,
			summary: `${file.count} leads, with websites and emails. Left out ${file.omitted}. If the browser did not save a file, copy the text below or use Save file.`
		});
		exportLeads({ data: { ids } }).catch(() => void 0);
	}
	async function mergeSelected() {
		if (selected.length !== 2) {
			setNotice("Select exactly two leads to merge.");
			return;
		}
		const result = await mergeLead({ data: {
			primaryId: selected[0],
			duplicateId: selected[1]
		} });
		if (!result.ok) {
			setNotice(result.error);
			return;
		}
		setSelected([]);
		setNotice("Merged. The second selection is now a duplicate and leaves the main list.");
		await load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			eyebrow: "Leads",
			title: "Review the evidence",
			lede: "Each row keeps the company website and every published email. Invalid and suppressed addresses stay out of the file. If the browser blocks the save, copy the file from the box that opens."
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-danger",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: q,
					onChange: (e) => {
						setQ(e.target.value);
						setPage(0);
					},
					placeholder: "Search name, city, email",
					"aria-label": "Search leads"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
					value: band,
					onChange: (e) => {
						setBand(e.target.value);
						setPage(0);
					},
					"aria-label": "Score band",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All scores"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "High priority"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "potential",
							children: "Potential"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "lower",
							children: "Lower priority"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
					value: verification,
					onChange: (e) => {
						setVerification(e.target.value);
						setPage(0);
					},
					"aria-label": "Email status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All email statuses"
					}), [
						"verified",
						"risky",
						"unknown",
						"invalid",
						"suppressed",
						"none"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item,
						children: verifyLabel(item === "none" ? null : item)
					}, item))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
					value: status,
					onChange: (e) => {
						setStatus(e.target.value);
						setPage(0);
					},
					"aria-label": "Review status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All review states"
					}), REVIEW_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item.id,
						children: item.label
					}, item.id))]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => download(),
					children: "Download list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => download(selected),
					disabled: !selected.length,
					children: "Download selected"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => void readSites(),
					disabled: busy,
					children: busy ? "Reading websites…" : "Find published emails"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: mergeSelected,
					children: "Merge two selected"
				})
			]
		}),
		notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: notice
		}) : null,
		offer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileOffer, {
			name: offer.name,
			text: offer.text,
			summary: offer.summary,
			mime: "text/csv;charset=utf-8",
			onClose: () => setOffer(null)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 md:hidden",
			children: slice.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCard, {
				lead,
				selected: selected.includes(lead.id),
				onToggle: () => toggle(lead.id)
			}, lead.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-x-auto rounded-3xl border border-line bg-card md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[760px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Business"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Website"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Review"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: slice.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: selected.includes(lead.id),
								onChange: () => toggle(lead.id),
								"aria-label": `Select ${lead.name}`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/leads/$leadId",
								params: { leadId: lead.id },
								className: "font-medium",
								children: lead.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									lead.city,
									", ",
									lead.region
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3",
							children: lead.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: lead.website,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-pine",
								children: lead.domain ?? "Website"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "No website"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-3",
							children: [lead.emails.length ? lead.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-[240px] truncate",
								children: email
							}, email)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "No published email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: verifyTone(lead.verification),
								children: verifyLabel(lead.verification)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-3 tabular-nums",
							children: [lead.score ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: lead.band ? bandLabel(lead.band) : ""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3",
							children: reviewLabel(lead.reviewStatus)
						})
					]
				}, lead.id)) })]
			})
		}),
		!slice.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-muted",
			children: "No leads match these filters."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted",
				children: [
					filtered.length,
					" leads · page ",
					page + 1,
					" of ",
					pages
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: page === 0,
					onClick: () => setPage((n) => n - 1),
					children: "Previous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: page + 1 >= pages,
					onClick: () => setPage((n) => n + 1),
					children: "Next"
				})]
			})]
		}),
		duplicates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Duplicates held out"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Same normalized domain as a record already kept. They were not enriched."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: duplicates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						item.name,
						" · ",
						item.city,
						" · ",
						item.domain
					] }, item.id))
				})
			]
		}) : null
	] });
}
function LeadCard({ lead, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/leads/$leadId",
					params: { leadId: lead.id },
					className: "font-medium",
					children: lead.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						lead.city,
						", ",
						lead.region
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: selected,
					onChange: onToggle,
					"aria-label": `Select ${lead.name}`
				})]
			}),
			lead.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: lead.website,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "mt-3 block truncate text-sm text-pine",
				children: lead.domain ?? lead.website
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "No website"
			}),
			lead.emails.length ? lead.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm",
				children: email
			}, email)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No published email"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: verifyTone(lead.verification),
					children: verifyLabel(lead.verification)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm tabular-nums",
					children: [
						lead.score ?? "—",
						" ",
						lead.band ? bandLabel(lead.band) : ""
					]
				})]
			})
		]
	});
}
//#endregion
export { LeadsPage as component };
