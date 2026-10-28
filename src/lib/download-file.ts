function extension(filename: string) {
  const dot = filename.lastIndexOf(".");
  return dot > 0 ? filename.slice(dot) : ".txt";
}

function blobOf(content: string | Uint8Array, mime: string) {
  return new Blob([content as BlobPart], { type: mime });
}

type SavePicker = (options: {
  suggestedName?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;

function picker(): SavePicker | undefined {
  return (window as Window & { showSaveFilePicker?: SavePicker }).showSaveFilePicker;
}

/** Best-effort browser download. Never waits on a save dialog. */
export function startDownload(filename: string, content: string | Uint8Array, mime: string) {
  try {
    const url = URL.createObjectURL(blobOf(content, mime));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 20000);
  } catch {
    /* some previews block the click */
  }
}

export async function pickSave(filename: string, content: string | Uint8Array, mime: string) {
  const save = picker();
  if (typeof save !== "function") return "unavailable" as const;
  try {
    const type = mime.split(";")[0] || "application/octet-stream";
    const handle = await save({
      suggestedName: filename,
      types: [{ description: "File", accept: { [type]: [extension(filename)] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(blobOf(content, mime));
    await writable.close();
    return "saved" as const;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled" as const;
    return "unavailable" as const;
  }
}

export async function copyText(text: string) {
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
