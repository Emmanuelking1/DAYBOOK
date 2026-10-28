//#region node_modules/.nitro/vite/services/ssr/assets/format-DUScbKv6.js
function money(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function pct(value) {
	if (value == null || Number.isNaN(value)) return "—";
	return `${Math.round(value * 100)}%`;
}
function verifyLabel(status) {
	if (!status) return "No email";
	if (status === "verified") return "Verified";
	if (status === "risky") return "Risky";
	if (status === "invalid") return "Invalid";
	if (status === "unknown") return "Published";
	if (status === "suppressed") return "Suppressed";
	return status;
}
var SEARCH_STATUS = {
	queued: "Queued",
	discovering: "Discovering",
	ready_dedupe: "Deduplicating",
	deduping: "Deduplicating",
	ready_enrich: "Enriching",
	enriching: "Enriching",
	ready_verify: "Checking emails",
	verifying: "Checking emails",
	ready_score: "Scoring",
	scoring: "Scoring",
	completed: "Completed",
	failed: "Needs attention",
	cancelled: "Cancelled"
};
function searchStatusLabel(status) {
	return SEARCH_STATUS[status] ?? status;
}
function isOpenSearch(status) {
	return ![
		"completed",
		"failed",
		"cancelled"
	].includes(status);
}
//#endregion
export { verifyLabel as a, searchStatusLabel as i, money as n, pct as r, isOpenSearch as t };
