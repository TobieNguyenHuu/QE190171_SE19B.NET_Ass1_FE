"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { getToken, isTokenExpired } from "@/lib/session";
import { Spinner } from "@/components/ui/Spinner";

const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/departments", label: "Departments" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/tags", label: "Tags" },
];

/** Every /admin/* page is wrapped here: visitors without a valid token are sent to /login. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, ready, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    const token = getToken();
    if (!user || !token || isTokenExpired(token)) router.replace("/login");
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-sm text-muted" role="status">
        <Spinner /> Checking your session…
      </div>
    );
  }

  const tabs = isAdmin ? [...TABS, { href: "/admin/accounts", label: "Accounts" }] : TABS;
  return (
    <div>
      <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-line" aria-label="Admin">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? "border-accent text-accent-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
