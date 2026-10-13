"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

const MAIN = [
  { href: "/", label: "Home" },
  { href: "/departments", label: "Departments" },
  { href: "/search", label: "Search tasks" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const link = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-paper hover:text-ink"
    }`;
  const adminActive = pathname.startsWith("/admin");

  const userArea = !ready ? null : user ? (
    <>
      <span className="px-2 text-sm text-muted">
        Signed in as <span className="font-medium text-ink">{user.fullName}</span>{" "}
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-ink">{user.roleName}</span>
      </span>
      <button type="button" className={btnSecondary} onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      <Link href="/login" className={btnSecondary}>Login</Link>
      <Link href="/register" className={btnPrimary}>Register</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">TaskTrack</Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN.map((item) => (
            <Link key={item.href} href={item.href} className={link(item.href)}>{item.label}</Link>
          ))}
          {user && (
            <Link href="/admin" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${adminActive ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-paper hover:text-ink"}`}>
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">{userArea}</div>

        <button
          type="button"
          className="rounded-md p-2 text-ink hover:bg-paper md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d={open ? "M5 5l12 12M17 5L5 17" : "M3 6h16M3 11h16M3 16h16"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="flex flex-col">
            {MAIN.map((item) => (
              <Link key={item.href} href={item.href} className={link(item.href)}>{item.label}</Link>
            ))}
            {user && <Link href="/admin" className={link("/admin")}>Admin</Link>}
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">{userArea}</div>
          </div>
        </nav>
      )}
    </header>
  );
}
