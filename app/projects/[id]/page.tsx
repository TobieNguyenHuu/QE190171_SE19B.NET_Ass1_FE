"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { formatDate } from "@/lib/format";
import { ProjectStatusBadge } from "@/components/badges";
import { TaskTable } from "@/components/TaskTable";
import { EmptyState, Loadable } from "@/components/ui/Spinner";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useFetch(() => api.projects.get(id), [id]);

  return (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-accent hover:underline">← Home</Link>
      <div className="mt-4">
        <Loadable loading={loading} error={error} onRetry={reload}>
          {data && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold sm:text-3xl">{data.projectName}</h1>
                <ProjectStatusBadge value={data.status} />
              </div>
              <p className="mt-2 text-sm text-muted">
                <Link href={`/departments/${data.departmentId}`} className="hover:text-accent hover:underline">{data.departmentName}</Link>
                {" · "}{formatDate(data.startDate)} to {formatDate(data.endDate)}
              </p>
              {data.description && <p className="mt-4 max-w-2xl">{data.description}</p>}

              <h2 className="mb-4 mt-10 text-xl font-bold">Tasks ({data.tasks.length})</h2>
              {data.tasks.length === 0 ? (
                <EmptyState title="No tasks in this project yet">Add one from Manage → Tasks.</EmptyState>
              ) : (
                <TaskTable tasks={data.tasks} showProject={false} />
              )}
            </>
          )}
        </Loadable>
      </div>
    </div>
  );
}
