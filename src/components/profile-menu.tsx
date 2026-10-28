import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getProfile, saveProfile } from "@/lib/prospecting/server";
import { Button, Field, TextInput } from "@/components/ui";

function shownName(sessionName: string | null, email: string | null, saved: string) {
  const custom = saved.trim();
  if (custom) return custom;
  const session = sessionName?.trim() ?? "";
  if (session && !/^(grok user|dev user)$/i.test(session)) return session;
  if (email) return email;
  return "Profile";
}

function readPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that photo."));
        return;
      }
      const scale = Math.max(size / image.width, size / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      URL.revokeObjectURL(url);
      let quality = 0.82;
      let data = canvas.toDataURL("image/jpeg", quality);
      while (data.length > 80_000 && quality > 0.45) {
        quality -= 0.1;
        data = canvas.toDataURL("image/jpeg", quality);
      }
      if (!data.startsWith("data:image/jpeg;base64,")) {
        reject(new Error("Could not prepare that photo."));
        return;
      }
      resolve(data);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Use a JPEG, PNG, or WebP photo."));
    };
    image.src = url;
  });
}

export function ProfileMenu() {
  const user = useCurrentUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const picked = useRef(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const gate = typeof window !== "undefined" && hasGateSessionMarker();

  useEffect(() => {
    if (!user) return;
    let cancel = false;
    getProfile()
      .then((profile) => {
        if (cancel || picked.current) return;
        setName(profile.name || (user.displayName && !/^(grok user|dev user)$/i.test(user.displayName) ? user.displayName : ""));
        setAvatar(profile.avatar || user.profileImageUrl || "");
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [user]);

  async function persist(nextName: string, nextAvatar: string) {
    setSaving(true);
    setNote("");
    try {
      const result = await saveProfile({ data: { name: nextName, avatar: nextAvatar } });
      setNote(result.ok ? "Profile saved." : result.error);
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not save the profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;
  const label = shownName(user.displayName, user.primaryEmail, name);
  const photo = avatar || (!picked.current ? user.profileImageUrl : "") || "";

  return (
    <div>
      <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left hover:bg-paper-2" onClick={() => setOpen((value) => !value)}>
        {photo ? (
          <img src={photo} alt="" className="size-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-medium text-paper">
            {label.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{label}</span>
          <span className="block truncate text-xs text-muted">{user.primaryEmail ?? "Profile"}</span>
        </span>
      </button>
      {open ? (
        <form
          className="mt-2 space-y-3 rounded-2xl border border-line bg-paper p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void persist(name, avatar);
          }}
        >
          <div className="flex items-center gap-3">
            {photo ? (
              <img src={photo} alt="" className="size-16 rounded-full object-cover" />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-ink text-lg font-medium text-paper">
                {label.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium">Profile photo</p>
              <p className="text-xs text-muted">JPEG, PNG, or WebP</p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              picked.current = true;
              void readPhoto(file)
                .then((data) => {
                  setAvatar(data);
                  return persist(name, data);
                })
                .catch((error: unknown) => {
                  setNote(error instanceof Error ? error.message : "Could not read that photo.");
                });
            }}
          />
          <Button type="button" variant="secondary" className="w-full" disabled={saving} onClick={() => fileRef.current?.click()}>
            {saving ? "Saving photo…" : "Upload photo"}
          </Button>
          {photo ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={saving}
              onClick={() => {
                picked.current = true;
                setAvatar("");
                void persist(name, "");
              }}
            >
              Remove photo
            </Button>
          ) : null}
          <Field label="Name">
            <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" />
          </Field>
          {note ? <p className="text-sm text-muted">{note}</p> : null}
          <Button type="submit" className="w-full" disabled={saving}>
            Save profile
          </Button>
          {!gate ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={signingOut}
              onClick={() => {
                setSigningOut(true);
                void signOut().catch(() => setSigningOut(false));
              }}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
