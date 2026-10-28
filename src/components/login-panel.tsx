import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { Button, Field, TextInput } from "@/components/ui";

export function LoginPanel() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setPending(true);
    const path = mode === "up" ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email";
    const response = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        mode === "up"
          ? { email, password, name: name.trim() || email.split("@")[0] || "Daybook" }
          : { email, password, callbackURL: "/" },
      ),
    });
    const payload = (await response.json().catch(() => null)) as { message?: string; token?: string } | null;
    if (!response.ok) {
      setPending(false);
      setError(payload?.message || (mode === "up" ? "Could not create that account." : "Email or password did not match."));
      return;
    }
    const token = response.headers.get("set-auth-token") || payload?.token || "";
    if (token) window.sessionStorage.setItem("grok-auth.bearer-token", token);
    try {
      const session = await authClient.getSession();
      if (session.data?.user) {
        await navigate({ to: "/" });
        return;
      }
    } catch {
      /* fall through to a full load */
    }
    window.location.assign("/");
  }

  const gmail = GROK_PROVIDERS.find((provider) => provider.providerId === "grok-google");
  const otherProviders = GROK_PROVIDERS.filter((provider) => provider.providerId !== "grok-google");

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,480px)]">
      <section className="flex flex-col justify-center bg-ink px-6 py-8 text-paper md:px-12 md:py-14 lg:min-h-screen">
        <p className="text-sm font-medium tracking-wide">DAYBOOK</p>
        <h1 className="mt-4 max-w-xl font-display text-3xl font-medium md:mt-6 md:text-5xl">
          A prospecting desk for restaurant books.
        </h1>
      </section>
      <section className="flex items-center px-6 py-10 md:px-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl">Sign in</h2>
          <p className="mt-2 text-sm text-muted">The same Gmail button creates the workspace the first time, then signs you in.</p>
          {gmail ? (
            <Button className="mt-6 w-full" onClick={() => signIn(gmail.providerId, { callbackURL: "/" })}>
              Continue with Gmail
            </Button>
          ) : null}
          {otherProviders.map((provider) => (
            <Button
              key={provider.providerId}
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
            >
              Continue with {provider.label}
            </Button>
          ))}
          <div className="my-6 h-px bg-line" />
          <h3 className="font-display text-2xl">{mode === "in" ? "Or use email" : "Create an email account"}</h3>
          <form className="mt-4 space-y-4" onSubmit={submit}>
            {mode === "up" ? (
              <Field label="Name">
                <TextInput value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
            ) : null}
            <Field label="Email">
              <TextInput
                type="email"
                required
                value={email}
                autoComplete="email"
                placeholder="you@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                required
                value={password}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
              {pending ? "Please wait…" : mode === "in" ? "Sign in with email" : "Create account"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm text-pine"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError("");
            }}
          >
            {mode === "in" ? "Need an email account? Create one" : "Already have an email account? Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}
