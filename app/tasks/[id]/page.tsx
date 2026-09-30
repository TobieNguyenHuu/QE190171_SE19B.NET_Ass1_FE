"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { formatDate, formatDateTime } from "@/lib/format";
import { PriorityBadge, TagList, TaskStatusBadge } from "@/components/badges";
import { Loadable } from "@/components/ui/Spinner";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useFetch(() => api.tasks.get(id), [id]);

  return (
    <div>
      <Link href="/search" className="text-sm text-muted hover:text-accent hover:underline">← Search tasks</Link>
      <div className="mt-4">
        <Loadable loading={loading} error={error} onRetry={reload}>
          {data && (
            <>
              <h1 className="max-w-3xl text-2xl font-bold sm:text-3xl">{data.title}</h1>
              <dl className="mt-6 divide-y divide-line rounded-xl border border-line bg-white">
                <Row label="Task ID">{data.taskId}</Row>
                <Row label="Description">{data.description ? <span className="whitespace-pre-line">{data.description}</span> : "—"}</Row>
                <Row label="Status"><TaskStatusBadge value={data.status} /></Row>
                <Row label="Priority"><PriorityBadge value={data.priority} /></Row>
                <Row label="Project">
                  <Link href={`/projects/${data.projectId}`} className="text-accent hover:underline">{data.projectName}</Link>
                </Row>
                <Row label="Tags"><TagList tags={data.tags} /></Row>
                <Row label="Due date">{formatDate(data.dueDate)}</Row>
                <Row label="Created">{formatDateTime(data.createdDate)}</Row>
                <Row label="Last modified">{formatDateTime(data.modifiedDate)}</Row>
              </dl>
            </>
          )}
        </Loadable>
      </div>
    </div>
  );
}
