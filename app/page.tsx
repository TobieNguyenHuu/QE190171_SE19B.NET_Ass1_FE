"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { TASK_STATUS, TONE_DOT } from "@/lib/constants";
import type { Department, Project, Task } from "@/lib/types";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { ProjectCard } from "@/components/ProjectCard";

function StatusStrip({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const counts = TASK_STATUS.map((s) => ({ ...s, count: tasks.filter((t) => t.status === s.value).length }));
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-semibold">Where the work stands</h2>
      <p className="mt-1 text-sm text-muted">{total} active {total === 1 ? "task" : "tasks"} across all projects</p>
      <div
        className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={counts.map((c) => `${c.count} ${c.label}`).join(", ")}
      >
        {total > 0 &&
          counts.filter((c) => c.count > 0).map((c) => (
            <div key={c.value} className={TONE_DOT[c.tone]} style={{ width: `${(c.count / total) * 100}%` }} />
          ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
        {counts.map((c) => (
          <li key={c.value} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[c.tone]}`} aria-hidden="true" />
            <span className="text-muted">{c.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CountTile({ href, value, label }: { href: string; value: number; label: string }) {
  return (
    <Link href={href} className="rounded-xl border border-line bg-white px-4 py-3 transition-colors hover:border-accent">
      <span className="block text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </Link>
  );
}

function Dashboard({ departments, projects, tasks }: { departments: Department[]; projects: Project[]; tasks: Task[] }) {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid grid-cols-3 gap-3 self-start">
          <CountTile href="/departments" value={departments.length} label="Departments" />
          <CountTile href="/projects/manage" value={projects.length} label="Projects" />
          <CountTile href="/tasks/manage" value={tasks.length} label="Tasks" />
        </div>
        <StatusStrip tasks={tasks} />
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold">Active projects</h2>
          <Link href="/projects/manage" className="text-sm font-medium text-accent hover:underline">Manage projects</Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState title="No active projects yet">Create one from Manage → Projects.</EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.projectId}><ProjectCard project={p} /></li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function HomePage() {
  const { data, loading, error, reload } = useFetch(() =>
    Promise.all([api.departments.list(), api.projects.list(), api.tasks.list()]),
  );

  return (
    <div>
      <section className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Know where every task stands.</h1>
        <p className="mt-3 text-muted">
          TaskTrack groups work by department and project, so one look shows what is open, what is moving and what is done.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/search" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-ink">Search tasks</Link>
          <Link href="/departments" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-paper">Browse departments</Link>
        </div>
      </section>

      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && <Dashboard departments={data[0]} projects={data[1]} tasks={data[2]} />}
      </Loadable>
    </div>
  );
}
