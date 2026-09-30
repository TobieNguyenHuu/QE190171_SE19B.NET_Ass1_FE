"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { TASK_PRIORITY, TASK_STATUS } from "@/lib/constants";
import { PageHeader } from "@/components/PageHeader";
import { TaskTable } from "@/components/TaskTable";
import { Field } from "@/components/ui/Field";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnSecondary, inputCls } from "@/components/ui/styles";

const EMPTY = { title: "", status: "", priority: "", projectId: "", tagId: "" };

export default function SearchPage() {
  const [filters, setFilters] = useState(EMPTY);
  const [debouncedTitle, setDebouncedTitle] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTitle(filters.title), 300);
    return () => clearTimeout(timer);
  }, [filters.title]);

  const projects = useFetch(api.projects.list);
  const tags = useFetch(api.tags.list);
  const results = useFetch(
    () => api.tasks.search({ ...filters, title: debouncedTitle }),
    [debouncedTitle, filters.status, filters.priority, filters.projectId, filters.tagId],
  );

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <PageHeader title="Search tasks" description="Results update as you change the filters." />

      <div className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Field label="Title" htmlFor="title">
            <input id="title" type="search" className={inputCls} placeholder="Search by title" value={filters.title} onChange={set("title")} />
          </Field>
        </div>
        <Field label="Status" htmlFor="status">
          <select id="status" className={inputCls} value={filters.status} onChange={set("status")}>
            <option value="">Any status</option>
            {TASK_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Priority" htmlFor="priority">
          <select id="priority" className={inputCls} value={filters.priority} onChange={set("priority")}>
            <option value="">Any priority</option>
            {TASK_PRIORITY.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Project" htmlFor="projectId">
          <select id="projectId" className={inputCls} value={filters.projectId} onChange={set("projectId")}>
            <option value="">Any project</option>
            {projects.data?.map((p) => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
          </select>
        </Field>
        <Field label="Tag" htmlFor="tagId">
          <select id="tagId" className={inputCls} value={filters.tagId} onChange={set("tagId")}>
            <option value="">Any tag</option>
            {tags.data?.map((t) => <option key={t.tagId} value={t.tagId}>{t.tagName}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm text-muted" aria-live="polite">
          <span>{results.data ? `${results.data.length} ${results.data.length === 1 ? "task" : "tasks"} found` : " "}{results.refreshing ? " · updating…" : ""}</span>
          {hasFilters && (
            <button type="button" className={btnSecondary} onClick={() => { setFilters(EMPTY); setDebouncedTitle(""); }}>
              Clear filters
            </button>
          )}
        </div>
        <Loadable loading={results.loading} error={results.error} onRetry={results.reload}>
          {results.data && results.data.length === 0 && (
            <EmptyState title="No tasks match these filters">Try removing a filter or searching a shorter title.</EmptyState>
          )}
          {results.data && results.data.length > 0 && <TaskTable tasks={results.data} />}
        </Loadable>
      </div>
    </div>
  );
}
