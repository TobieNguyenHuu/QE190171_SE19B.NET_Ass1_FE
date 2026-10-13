"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useFetch } from "@/lib/useFetch";
import { PageHeader } from "@/components/PageHeader";
import { Loadable } from "@/components/ui/Spinner";

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const { data, loading, error, reload } = useFetch(() =>
    Promise.all([api.departments.list(), api.projects.list(), api.tasks.list(), api.tags.list()]),
  );

  const cards = [
    { href: "/admin/departments", label: "Departments", value: data?.[0].length ?? 0, hint: "Manage departments" },
    { href: "/admin/projects", label: "Projects", value: data?.[1].length ?? 0, hint: "Manage projects" },
    { href: "/admin/tasks", label: "Tasks", value: data?.[2].length ?? 0, hint: "Manage tasks" },
    { href: "/admin/tags", label: "Tags", value: data?.[3].length ?? 0, hint: "Manage tags" },
  ];

  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        description={`Welcome back, ${user?.fullName ?? ""}. Pick a section to create, edit or delete data.`}
      />

      <Loadable loading={loading} error={error} onRetry={reload}>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-xl border border-line bg-white p-5 transition-colors hover:border-accent">
              <span className="block text-3xl font-bold tabular-nums">{c.value}</span>
              <span className="mt-1 block text-sm font-medium">Total {c.label.toLowerCase()}</span>
              <span className="mt-3 block text-sm text-accent">{c.hint} →</span>
            </Link>
          ))}
        </section>
      </Loadable>

      {isAdmin && (
        <section className="mt-8">
          <Link href="/admin/accounts" className="inline-flex rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:border-accent">
            <span>
              <span className="block font-medium">Accounts</span>
              <span className="block text-sm text-muted">List accounts, change roles, delete accounts (Admin only) →</span>
            </span>
          </Link>
        </section>
      )}
    </div>
  );
}
