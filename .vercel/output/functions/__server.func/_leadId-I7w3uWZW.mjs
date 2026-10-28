import { o as __toESM } from "./_runtime.mjs";
import { n as draftTextFile, r as fileSlug, t as draftEml } from "./_ssr/files-C7QCvZDX.mjs";
import { a as reviewLabel, i as bandLabel, n as REVIEW_STATUSES, r as RUBRIC } from "./_ssr/score-BunRsHRe.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as Route$4 } from "./_ssr/router-BAntTsKt.mjs";
import { c as TextArea, l as TextInput, n as Button, o as Panel, p as verifyTone, r as Field, s as SelectInput, t as Badge } from "./_ssr/login-panel-zcwyaGS-.mjs";
import { S as updateLead, _ as rescoreLead, a as createDraft, n as addSuppression, t as AppShell, u as getLead, x as updateDraft } from "./_ssr/server-Dr3yu8tD.mjs";
import { n as startDownload, t as FileOffer } from "./_ssr/file-offer-D95Cf6h-.mjs";
import { a as verifyLabel } from "./_ssr/format-DUScbKv6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_leadId-I7w3uWZW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeadPage() {
	const { leadId } = Route$4.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lead, { leadId }) });
}
function Lead({ leadId }) {
	const [lead, setLead] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("not_reviewed");
	const [tone, setTone] = (0, import_react.useState)("professional");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
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
	(0, import_react.useEffect)(() => {
		load().catch((err) => setError(err instanceof Error ? err.message : "Could not load the lead"));
	}, [leadId]);
	async function save() {
		setBusy(true);
		const result = await updateLead({ data: {
			id: leadId,
			notes,
			tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
			reviewStatus: status
		} });
		setBusy(false);
		setNotice(result.ok ? "Saved." : result.error);
		if (result.ok) await load();
	}
	async function draft() {
		setBusy(true);
		setNotice("");
		const result = await createDraft({ data: {
			businessId: leadId,
			tone
		} });
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
	async function suppress(email) {
		setBusy(true);
		const result = await addSuppression({ data: {
			email,
			reason: "Suppressed from the lead record"
		} });
		setBusy(false);
		setNotice(result.ok ? "Suppressed. This address will not enter exports or new drafts." : result.error);
		if (result.ok) await load();
	}
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-danger",
		children: error
	});
	if (!lead) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Loading the record…"
	});
	const factors = lead.score ? [
		[
			"Industry fit",
			lead.score.industryFit,
			30
		],
		[
			"Operational complexity",
			lead.score.operationalComplexity,
			20
		],
		[
			"Growth signals",
			lead.score.growthSignals,
			15
		],
		[
			"Decision maker",
			lead.score.decisionMaker,
			15
		],
		[
			"Data completeness",
			lead.score.businessCompleteness,
			10
		],
		[
			"Contact quality",
			lead.score.contactQuality,
			10
		]
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/leads",
				className: "text-pine",
				children: "All leads"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl md:text-4xl",
					children: lead.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted",
					children: [
						lead.address,
						" · ",
						lead.category
					]
				}),
				lead.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-sm text-pine",
					href: lead.website,
					target: "_blank",
					rel: "noopener noreferrer",
					children: lead.website
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No website published for this business"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl tabular-nums",
					children: lead.score?.total ?? "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: lead.score ? `${bandLabel(lead.score.band)} · ${lead.score.confidence} confidence` : "Not scored"
				})]
			})]
		}),
		lead.conflictNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4 border-warn/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-warn",
				children: "Conflicting sources"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm",
				children: lead.conflictNote
			})]
		}) : null,
		notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: notice
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Contacts"
					}), lead.contacts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-4",
						children: lead.contacts.map((contact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									contact.name,
									" · ",
									contact.title
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: contact.contact_type === "person" ? "Named person" : "Shared inbox"
							}),
							contact.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: email.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: verifyTone(email.verification_status),
										children: verifyLabel(email.verification_status)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: email.email_type
									}),
									email.verification_status !== "suppressed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "min-h-9 px-2",
										disabled: busy,
										onClick: () => suppress(email.email),
										children: "Suppress"
									}) : null
								]
							}, email.id)),
							contact.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									email.source,
									" · ",
									email.documented ? "documented" : "not documented",
									email.predicted ? " · predicted" : "",
									" · ",
									email.verification_provider ?? "No provider yet",
									email.verification_detail ? ` — ${email.verification_detail}` : ""
								]
							}, `${email.id}-detail`))
						] }, contact.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No contact was stored. That is missing data, not a poor-fit verdict."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Evidence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: lead.evidence.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: item.claim
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.value }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted",
									children: [
										item.source_label,
										" · ",
										item.provider,
										" · ",
										item.confidence,
										" confidence · ",
										item.source_ref
									]
								})
							]
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Outreach"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
									value: tone,
									onChange: (e) => setTone(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "professional",
											children: "Professional"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "concise",
											children: "Concise"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "conversational",
											children: "Conversational"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || status === "opted_out",
								onClick: draft,
								children: "Generate draft"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Drafts are not sent. Mark “Sent externally” only after you send one yourself."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-4",
							children: lead.drafts.map((draft) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftEditor, {
								draft,
								business: lead.name,
								to: lead.contacts.flatMap((contact) => contact.emails).find((email) => email.verification_status !== "suppressed" && email.verification_status !== "invalid")?.email,
								onSaved: load
							}, draft.id))
						})
					] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Score"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								disabled: busy,
								onClick: scoreAgain,
								children: "Recalculate"
							})]
						}),
						lead.score ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-3",
								children: factors.map(([label, value, weight]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums text-muted",
										children: [
											value,
											"/",
											weight
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 h-1.5 rounded-full bg-paper-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 rounded-full bg-pine",
										style: { width: `${Number(value) / Number(weight) * 100}%` }
									})
								})] }, String(label)))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm",
								children: lead.score.explanation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: lead.score.modelVersion
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "No score yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-1 text-xs text-muted",
							children: RUBRIC.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								row.label,
								": ",
								row.weight
							] }, row.key))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Review status",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectInput, {
									value: status,
									onChange: (e) => setStatus(e.target.value),
									children: REVIEW_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.label
									}, item.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tags",
								hint: "Comma-separated.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: tags,
									onChange: (e) => setTags(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
									value: notes,
									onChange: (e) => setNotes(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy,
								onClick: save,
								children: "Save record"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["Current state: ", reviewLabel(lead.reviewStatus)]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: [lead.activity.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [item.kind.replaceAll("_", " "), " · "]
						}), item.detail] }, `${item.created_at}-${index}`)), !lead.activity.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: "No edits yet."
						}) : null]
					})] })
				]
			})]
		})
	] });
}
function DraftEditor({ draft, business, to, onSaved }) {
	const [subject, setSubject] = (0, import_react.useState)(draft.subject);
	const [body, setBody] = (0, import_react.useState)(draft.body);
	const [message, setMessage] = (0, import_react.useState)("");
	const [offer, setOffer] = (0, import_react.useState)(null);
	async function save(status) {
		const result = await updateDraft({ data: {
			id: draft.id,
			subject,
			body,
			status
		} });
		setMessage(result.ok ? status === "approved" ? "Approved. Still not sent." : "Draft saved." : result.error);
		if (result.ok) await onSaved();
	}
	async function download(kind) {
		const slug = fileSlug(business);
		const filename = kind === "txt" ? `${slug}.txt` : `${slug}.eml`;
		const mime = kind === "txt" ? "text/plain;charset=utf-8" : "message/rfc822";
		const content = kind === "txt" ? draftTextFile({
			business,
			subject,
			body,
			status: draft.status
		}) : draftEml({
			business,
			to,
			subject,
			body
		});
		startDownload(filename, content, mime);
		setOffer({
			name: filename,
			text: content,
			summary: `If the browser did not save ${filename}, copy the text below. It was not emailed.`
		});
		setMessage("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-2",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Subject",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: subject,
					onChange: (e) => setSubject(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Message",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						className: "min-h-48"
					})
				})
			}),
			draft.warnings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 list-disc space-y-1 pl-4 text-sm text-muted",
				children: draft.warnings.map((warning) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: warning }, warning))
			}) : null,
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: message
			}) : null,
			offer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileOffer, {
					name: offer.name,
					text: offer.text,
					summary: offer.summary,
					onClose: () => setOffer(null)
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => save("draft"),
						children: "Save edits"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save("approved"),
						children: "Approve draft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => download("txt"),
						children: "Download text"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => download("eml"),
						children: "Download email file"
					})
				]
			})
		]
	});
}
//#endregion
export { LeadPage as component };
