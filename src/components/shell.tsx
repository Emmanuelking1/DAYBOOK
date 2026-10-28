import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, LayoutDashboard, Menu, Plus, ScrollText, Settings, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ProfileMenu } from "@/components/profile-menu";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { LoginPanel } from "@/components/login-panel";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/search/new", label: "New search", icon: Plus },
  { to: "/search", label: "Runs", icon: ScrollText },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/drafts", label: "Drafts", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function activeNav(to: string, path: string) {
  if (to === "/") return path === "/";
  if (to === "/search") return path === "/search" || /^\/search\/(?!new$).+/.test(path);
  return path === to || path.startsWith(`${to}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = activeNav(item.to, path);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium",
              active ? "bg-ink text-paper" : "text-ink hover:bg-paper-2",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);

  if (isPending) {
    return (
      <main className="min-h-screen bg-paper px-6 py-12">
        <p className="font-display text-3xl text-ink">Daybook</p>
        <p className="mt-2 text-muted">Opening the workspace…</p>
      </main>
    );
  }

  if (!user) return <LoginPanel />;

  return (
    <div className="min-h-screen bg-paper text-ink md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line bg-card md:flex md:flex-col md:px-4 md:py-6">
        <Link to="/" className="px-3">
          <p className="font-display text-2xl leading-none">Daybook</p>
          <p className="mt-1 text-sm text-muted">Prospecting desk</p>
        </Link>
        <div className="mt-8 flex-1">
          <NavLinks />
        </div>
        <div className="mt-auto px-1">
          <ProfileMenu />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-line bg-card px-4 py-3 md:hidden">
          <Link to="/" className="font-display text-xl">
            Daybook
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>
        {open ? (
          <div className="border-b border-line bg-card px-4 py-4 md:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="mt-4">
              <ProfileMenu />
            </div>
          </div>
        ) : null}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
