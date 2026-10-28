//#region node_modules/.nitro/vite/services/ssr/assets/files-C7QCvZDX.js
function csvCell(value) {
	const text = value == null ? "" : String(value);
	if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
	return text;
}
function leadsToCsv(leads, ids) {
	const wanted = new Set((ids ?? []).filter(Boolean));
	const rows = leads.filter((lead) => {
		if (wanted.size && !wanted.has(lead.id)) return false;
		if (lead.verification === "invalid" || lead.verification === "suppressed" || lead.suppressed) return false;
		if (lead.reviewStatus === "opted_out") return false;
		return true;
	});
	return {
		filename: "daybook-leads.csv",
		csv: `\uFEFF${[[
			"business",
			"domain",
			"city",
			"region",
			"category",
			"website",
			"contact",
			"title",
			"email",
			"email_type",
			"verification",
			"score",
			"band",
			"review_status",
			"source",
			"draft_status",
			"draft_subject",
			"draft_body"
		].join(","), ...rows.map((lead) => [
			lead.name,
			lead.domain,
			lead.city,
			lead.region,
			lead.category,
			lead.website,
			lead.contactName,
			lead.contactTitle,
			lead.emails?.length ? lead.emails.join("; ") : lead.email,
			lead.emailType,
			lead.verification,
			lead.score,
			lead.band,
			lead.reviewStatus,
			lead.source,
			lead.draftStatus,
			lead.draftSubject,
			lead.draftBody
		].map(csvCell).join(","))].join("\r\n")}\r\n`,
		count: rows.length,
		omitted: (wanted.size ? leads.filter((lead) => wanted.has(lead.id)).length : leads.length) - rows.length
	};
}
function fileSlug(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "draft";
}
function draftTextFile(input) {
	return `Daybook draft\n${input.city ? `${input.business} · ${input.city}` : input.business}\nStatus: ${input.status || "draft"}\nSubject: ${input.subject}\n\n${input.body.trim()}\n`;
}
function draftEml(input) {
	const subject = input.subject.replace(/[\r\n]+/g, " ");
	const to = input.to?.trim() || "undisclosed-recipients:;";
	const stamp = (/* @__PURE__ */ new Date()).toUTCString();
	return [
		"MIME-Version: 1.0",
		"X-Unsent: 1",
		`From: Daybook <drafts@daybook.local>`,
		`To: ${to}`,
		`Subject: ${subject}`,
		`Date: ${stamp}`,
		"Content-Type: text/plain; charset=utf-8",
		"Content-Transfer-Encoding: 8bit",
		"",
		input.body.replace(/\r?\n/g, "\r\n").trim(),
		""
	].join("\r\n");
}
function crc32(bytes) {
	let crc = 4294967295;
	for (const byte of bytes) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit += 1) crc = crc >>> 1 ^ 3988292384 & -(crc & 1);
	}
	return (crc ^ 4294967295) >>> 0;
}
function zipStore(files) {
	const encoder = new TextEncoder();
	const locals = [];
	const central = [];
	let offset = 0;
	for (const file of files) {
		const name = encoder.encode(file.name);
		const data = encoder.encode(file.text);
		const crc = crc32(data);
		const local = new Uint8Array(30 + name.length);
		const view = new DataView(local.buffer);
		view.setUint32(0, 67324752, true);
		view.setUint16(4, 20, true);
		view.setUint16(8, 0, true);
		view.setUint32(14, crc, true);
		view.setUint32(18, data.length, true);
		view.setUint32(22, data.length, true);
		view.setUint16(26, name.length, true);
		local.set(name, 30);
		locals.push(local, data);
		const entry = new Uint8Array(46 + name.length);
		const entryView = new DataView(entry.buffer);
		entryView.setUint32(0, 33639248, true);
		entryView.setUint16(4, 20, true);
		entryView.setUint16(6, 20, true);
		entryView.setUint32(16, crc, true);
		entryView.setUint32(20, data.length, true);
		entryView.setUint32(24, data.length, true);
		entryView.setUint16(28, name.length, true);
		entryView.setUint32(42, offset, true);
		entry.set(name, 46);
		central.push(entry);
		offset += local.length + data.length;
	}
	const centralSize = central.reduce((sum, part) => sum + part.length, 0);
	const end = /* @__PURE__ */ new Uint8Array(22);
	const endView = new DataView(end.buffer);
	endView.setUint32(0, 101010256, true);
	endView.setUint16(8, files.length, true);
	endView.setUint16(10, files.length, true);
	endView.setUint32(12, centralSize, true);
	endView.setUint32(16, offset, true);
	const out = new Uint8Array(offset + centralSize + end.length);
	let cursor = 0;
	for (const part of [
		...locals,
		...central,
		end
	]) {
		out.set(part, cursor);
		cursor += part.length;
	}
	return out;
}
//#endregion
export { zipStore as a, leadsToCsv as i, draftTextFile as n, fileSlug as r, draftEml as t };
