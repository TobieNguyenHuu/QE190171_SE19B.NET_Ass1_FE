"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState, Loadable } from "@/components/ui/Spinner";

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useFetch(() => api.departments.get(id), [id]);

  return (
    <div>
      <Link href="/departments" className="text-sm text-muted hover:text-accent hover:underline">← All departments</Link>
      <div className="mt-4">
        <Loadable loading={loading} error={error} onRetry={reload}>
          {data && (
            <>
              <h1 className="text-2xl font-bold sm:text-3xl">{data.departmentName}</h1>
              <p className="mt-2 max-w-2xl text-muted">{data.departmentDescription}</p>

              <h2 className="mb-4 mt-10 text-xl font-bold">Projects ({data.projects.length})</h2>
              {data.projects.length === 0 ? (
                <EmptyState title="This department has no active projects">Add one from Manage → Projects.</EmptyState>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.projects.map((p) => (
                    <li key={p.projectId}><ProjectCard project={{ ...p, departmentName: data.departmentName }} /></li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Loadable>
      </div>
    </div>
  );
}
