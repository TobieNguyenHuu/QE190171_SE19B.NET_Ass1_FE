"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MAIN = [
  { href: "/", label: "Home" },
  { href: "/departments", label: "Departments" },
  { href: "/search", label: "Search tasks" },
];
const MANAGE = [
  { href: "/departments/manage", label: "Departments" },
  { href: "/projects/manage", label: "Projects" },
  { href: "/tasks/manage", label: "Tasks" },
  { href: "/tags/manage", label: "Tags" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const link = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-paper hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">TaskTrack</Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN.map((item) => (
            <Link key={item.href} href={item.href} className={link(item.href)}>{item.label}</Link>
          ))}
          <details key={pathname} className="relative">
            <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-ink">
              Manage ▾
            </summary>
            <div className="absolute right-0 mt-1 w-44 rounded-lg border border-line bg-white p-1 shadow-lg">
              {MANAGE.map((item) => (
                <Link key={item.href} href={item.href} className={`block ${link(item.href)}`}>{item.label}</Link>
              ))}
            </div>
          </details>
        </nav>

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
            <p className="mt-3 px-3 text-xs font-medium text-muted">Manage</p>
            {MANAGE.map((item) => (
              <Link key={item.href} href={item.href} className={link(item.href)}>{item.label}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
