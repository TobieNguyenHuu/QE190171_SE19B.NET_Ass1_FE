"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnSecondary } from "@/components/ui/styles";

export default function DepartmentsPage() {
  const { data, loading, error, reload } = useFetch(api.departments.list);

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Pick a department to see its projects."
        action={<Link href="/admin/departments" className={btnSecondary}>Manage departments</Link>}
      />
      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 && <EmptyState title="No departments yet">Add the first one from Admin → Departments.</EmptyState>}
        {data && data.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((d) => (
              <li key={d.departmentId}>
                <Link
                  href={`/departments/${d.departmentId}`}
                  className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-colors hover:border-accent"
                >
                  <h2 className="font-semibold">{d.departmentName}</h2>
                  <p className="mt-2 text-sm text-muted">{d.departmentDescription}</p>
                  <p className="mt-auto pt-4 text-sm font-medium text-accent-ink">
                    {d.projectCount} {d.projectCount === 1 ? "project" : "projects"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Loadable>
    </div>
  );
}
