import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, p as useRouterState, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { a as hasGateSessionMarker } from "./server-D9eAs0w1.mjs";
import { a as ScrollText, c as LayoutDashboard, i as Settings, l as FileText, n as Users, o as Plus, s as Menu, t as X } from "../_libs/lucide-react.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { d as useCurrentUser, f as useCurrentUserState, i as LoginPanel, u as cn } from "./login-panel-zcwyaGS-.mjs";
import { t as authMiddleware } from "./middleware-ClawcxHI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Dr3yu8tD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		to: "/search/new",
		label: "New search",
		icon: Plus
	},
	{
		to: "/search",
		label: "Runs",
		icon: ScrollText
	},
	{
		to: "/leads",
		label: "Leads",
		icon: Users
	},
	{
		to: "/drafts",
		label: "Drafts",
		icon: FileText
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function activeNav(to, path) {
	if (to === "/") return path === "/";
	if (to === "/search") return path === "/search" || /^\/search\/(?!new$).+/.test(path);
	return path === to || path.startsWith(`${to}/`);
}
function NavLinks({ onNavigate }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item) => {
			const active = activeNav(item.to, path);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium", active ? "bg-ink text-paper" : "text-ink hover:bg-paper-2"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4",
					"aria-hidden": true
				}), item.label]
			}, item.to);
		})
	});
}
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const [open, setOpen] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-paper px-6 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl text-ink",
			children: "Daybook"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted",
			children: "Opening the workspace…"
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginPanel, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink md:grid md:grid-cols-[240px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden border-r border-line bg-card md:flex md:flex-col md:px-4 md:py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-none",
						children: "Daybook"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Prospecting desk"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 text-sm text-muted",
					children: "Evidence first. No invented contacts."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 px-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-line bg-card px-4 py-3 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-xl",
						children: "Daybook"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center rounded-full border border-line",
						"aria-label": open ? "Close menu" : "Open menu",
						onClick: () => setOpen((v) => !v),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-line bg-card px-4 py-4 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate: () => setOpen(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8",
					children
				})
			]
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5af9c423310d0831c9eeb3101dfd1397b74f12e028484c74b4ea37062bdac975"));
var createSearch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0053b995c337a30e430d60fb8d2bc5abe5a86d047667a04d5f8dd48c0539b0ef"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("85280c74b453ee0578b4616b42233804737e4b74fc675cbaab5bae5bc6381599"));
var advanceSearch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("990615f47baf1abee0b73919880beae642594ef5378833d8b2ca8e6ddb2dfd93"));
var resumeSearch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4012fe1152a2b4a117f56e5671b8f820b5f5cff6443d47e5e35d5d58ce3786d0"));
var retrySearch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c937830faeedaf5e9efee428497584df4028275c0df7808f011ab5e58ccb30fa"));
var cancelSearch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("59675f89aeaca80e7135e84396f38b18313d661428ad71606566c4826fad9069"));
var refreshPublishedEmails = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("6e45d54aef8a4f7cb3ea044a1358b55f29a94e9a6465171b13b9586c02f68843"));
var listLeads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1f595d6fa81ba82203708188909998f77527c33d7f97099e7c3b09ae7f0b1a03"));
var getLead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f0569d50972f56598475aac379fec8c90944ebd4201b12300394087709cbf314"));
var updateLead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e78edd106430518f15c9bbb38185a91cfefa2674a2d9f8c34a616a308edfac17"));
var mergeLead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("dbf0994a8f94953a72010382c2dce9687df781efc9e238b9880a7fb979610d25"));
var rescoreLead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6fc94ad8db6c3732969942e306be481a59ca49b95202abb4e4a9b14799151a02"));
var createDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8941941510558758acadca6de55e28bcc73c142264cd79706db23091f2c8f2b3"));
var updateDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6a9aa85f861e7e838efa88c8dd28c825abf15c46d7db955e54e6927f4f3efcc8"));
var listDrafts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1465d65bc1a3fab984c58522e4c64c2675d19fa35ad33edbd6df63db9ce5f65a"));
var addSuppression = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("40b9292eed26f4fdf57e3eed1969da06b8f279c405d97f4627ad62e282cfa7a4"));
var removeSuppression = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("348926b4168e6c9bd2c3a5d1ac18da3d88a2e83015369421c20f38c140ceafda"));
var exportLeads = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("3a00541b6884f9babd2d72708a8311912fa7dd962959c6b6b41da3794f6bec4d"));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ed59bb0c760cb1554be07e18a4a28a3896102232fdd90bdd21b770d6a84098db"));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f50af53b805137050b766774b763b244b703e5c9d62fdce4ef6e320227e78991"));
var deleteWorkspaceData = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cba302a43e0e65e8e0692a3542d30c2ab9d14ab781361be4aa9a9a3623856cce"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("548ec9d5fe7754d1c97755539434fb2f88a888976a765d9b373eaf2665753ad1"));
var summarizeSearch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3e068c9e09f947484f57851f7fd31c895d7dc8eb873bab35808862339569e368"));
//#endregion
export { updateSettings as C, updateLead as S, rescoreLead as _, createDraft as a, summarizeSearch as b, exportLeads as c, getSettings as d, listDrafts as f, removeSuppression as g, refreshPublishedEmails as h, cancelSearch as i, getDashboard as l, mergeLead as m, addSuppression as n, createSearch as o, listLeads as p, advanceSearch as r, deleteWorkspaceData as s, AppShell as t, getLead as u, resumeSearch as v, updateDraft as x, retrySearch as y };
