import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, o as Panel } from "./login-panel-zcwyaGS-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/file-offer-D95Cf6h-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function extension(filename) {
	const dot = filename.lastIndexOf(".");
	return dot > 0 ? filename.slice(dot) : ".txt";
}
function blobOf(content, mime) {
	return new Blob([content], { type: mime });
}
function picker() {
	return window.showSaveFilePicker;
}
/** Best-effort browser download. Never waits on a save dialog. */
function startDownload(filename, content, mime) {
	try {
		const url = URL.createObjectURL(blobOf(content, mime));
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		anchor.rel = "noopener";
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 2e4);
	} catch {}
}
async function pickSave(filename, content, mime) {
	const save = picker();
	if (typeof save !== "function") return "unavailable";
	try {
		const writable = await (await save({
			suggestedName: filename,
			types: [{
				description: "File",
				accept: { [mime.split(";")[0] || "application/octet-stream"]: [extension(filename)] }
			}]
		})).createWritable();
		await writable.write(blobOf(content, mime));
		await writable.close();
		return "saved";
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
		return "unavailable";
	}
}
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const area = document.createElement("textarea");
			area.value = text;
			area.setAttribute("readonly", "true");
			area.style.position = "fixed";
			area.style.left = "-9999px";
			document.body.appendChild(area);
			area.select();
			const ok = document.execCommand("copy");
			area.remove();
			return ok;
		} catch {
			return false;
		}
	}
}
function FileOffer({ name, text, summary, mime = "text/plain;charset=utf-8", onClose }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	async function copy() {
		if (!text) return;
		const ok = await copyText(text);
		setCopied(ok);
		setNote(ok ? "" : "Copy was blocked. Select the text below and copy it yourself.");
	}
	async function save() {
		if (!text) return;
		const result = await pickSave(name, text, mime);
		if (result === "saved") {
			setNote("Saved on this device.");
			return;
		}
		if (result === "cancelled") {
			setNote("Save cancelled. The text below is still here.");
			return;
		}
		startDownload(name, text, mime);
		setNote("If nothing saved, copy the text below.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: summary
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void copy(),
							children: copied ? "Copied" : "Copy file"
						}) : null,
						text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => void save(),
							children: "Save file"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: onClose,
							children: "Close"
						})
					]
				})]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: note
			}) : null,
			text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				readOnly: true,
				value: text,
				"aria-label": name,
				className: "mt-3 h-40 w-full resize-y rounded-2xl border border-line bg-paper p-3 font-mono text-xs"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "This file is binary. If nothing saved, download the text version instead."
			})
		]
	});
}
//#endregion
export { startDownload as n, FileOffer as t };
