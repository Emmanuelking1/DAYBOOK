import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-D9eAs0w1.mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-panel-zcwyaGS-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-[transform,background-color,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", variant === "primary" && "bg-pine text-pine-ink", variant === "secondary" && "border border-line bg-card text-ink", variant === "ghost" && "text-ink", variant === "danger" && "bg-danger text-pine-ink", className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-sm font-medium text-ink",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-sm text-muted",
				children: hint
			}) : null
		]
	});
}
var control = "min-h-11 w-full rounded-lg border border-line bg-card px-3 text-base text-ink outline-none placeholder:text-muted";
function TextInput(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn(control, props.className)
	});
}
function TextArea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cn(control, "min-h-32 py-3", props.className)
	});
}
function SelectInput(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: cn(control, props.className)
	});
}
function Badge({ tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tone === "neutral" && "bg-paper-2 text-muted", tone === "good" && "bg-pine/10 text-pine", tone === "warn" && "bg-warn/10 text-warn", tone === "bad" && "bg-danger/10 text-danger", tone === "ink" && "bg-ink text-paper"),
		children
	});
}
function verifyTone(status) {
	if (status === "verified") return "good";
	if (status === "risky" || status === "unknown") return "warn";
	if (status === "invalid" || status === "suppressed") return "bad";
	return "neutral";
}
function Panel({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-3xl border border-line bg-card p-5", className),
		children
	});
}
function PageTitle({ eyebrow, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-6 max-w-3xl",
		children: [
			eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm font-medium text-pine",
				children: eyebrow
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium text-ink md:text-4xl",
				children: title
			}),
			lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-muted",
				children: lede
			}) : null
		]
	});
}
function LoginPanel() {
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setError("");
		if (password.length < 8) {
			setError("Use at least 8 characters.");
			return;
		}
		setPending(true);
		const result = mode === "up" ? await authClient.signUp.email({
			email,
			password,
			name: name.trim() || "Daybook"
		}) : await authClient.signIn.email({
			email,
			password
		});
		setPending(false);
		if (result.error) {
			setError(result.error.message ?? "Sign-in failed.");
			return;
		}
		window.location.assign("/");
	}
	const gmail = GROK_PROVIDERS.find((provider) => provider.providerId === "grok-google");
	const otherProviders = GROK_PROVIDERS.filter((provider) => provider.providerId !== "grok-google");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-screen bg-paper lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,480px)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-col justify-between bg-ink px-6 py-8 text-paper md:px-12 md:py-14 lg:min-h-screen",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide",
					children: "DAYBOOK"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 max-w-xl font-display text-3xl font-medium md:mt-6 md:text-5xl",
					children: "A prospecting desk for restaurant books."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-base text-paper/80",
					children: "Sign in with Gmail, search a city, and keep the websites and published emails you can stand behind."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 max-w-md text-sm text-paper/70",
				children: "Listings come from OpenStreetMap and the restaurant’s own site. A published email is not a mailbox check, and nothing is sent from this desk."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex items-center px-6 py-10 md:px-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "The same Gmail button creates the workspace the first time, then signs you in."
					}),
					gmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6 w-full",
						onClick: () => signIn(gmail.providerId, { callbackURL: "/" }),
						children: "Continue with Gmail"
					}) : null,
					otherProviders.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "mt-2 w-full",
						onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
						children: ["Continue with ", provider.label]
					}, provider.providerId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-6 h-px bg-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl",
						children: mode === "in" ? "Or use email" : "Create an email account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 space-y-4",
						onSubmit: submit,
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: name,
									onChange: (e) => setName(e.target.value),
									autoComplete: "name"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "email",
									required: true,
									value: email,
									autoComplete: "email",
									placeholder: "you@gmail.com",
									onChange: (e) => setEmail(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Password",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "password",
									required: true,
									value: password,
									autoComplete: mode === "up" ? "new-password" : "current-password",
									onChange: (e) => setPassword(e.target.value)
								})
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "secondary",
								className: "w-full",
								disabled: pending,
								children: pending ? "Please wait…" : mode === "in" ? "Sign in with email" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 text-sm text-pine",
						onClick: () => {
							setMode(mode === "in" ? "up" : "in");
							setError("");
						},
						children: mode === "in" ? "Need an email account? Create one" : "Already have an email account? Sign in"
					})
				]
			})
		})]
	});
}
//#endregion
export { PageTitle as a, TextArea as c, useCurrentUser as d, useCurrentUserState as f, LoginPanel as i, TextInput as l, Button as n, Panel as o, verifyTone as p, Field as r, SelectInput as s, Badge as t, cn as u };
