"use client";

import Link from "next/link";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { formatDate } from "@/lib/format";
import type { Project, ProjectInput } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { ProjectStatusBadge } from "@/components/badges";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnPrimary, btnSmall } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";

export default function ManageProjectsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => Promise.all([api.projects.list(), api.departments.list()]));
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);

  const projects = data?.[0] ?? [];
  const departments = data?.[1] ?? [];

  async function save(input: ProjectInput) {
    if (editing && editing !== "new") {
      await api.projects.update(editing.projectId, input);
      toast.success("Project updated");
    } else {
      await api.projects.create(input);
      toast.success("Project created");
    }
    setEditing(null);
    reload();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.projects.remove(deleting.projectId);
      toast.success("Project deleted");
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Manage projects"
        description="Create, edit or delete projects. A project with tasks cannot be deleted."
        action={<button type="button" className={btnPrimary} onClick={() => setEditing("new")}>New project</button>}
      />

      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && projects.length === 0 && <EmptyState title="No projects yet">Use “New project” to add the first one.</EmptyState>}
        {data && projects.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Start</th>
                  <th className="px-4 py-3 font-medium">End</th>
                  <th className="px-4 py-3 font-medium">Tasks</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((p) => (
                  <tr key={p.projectId} className="align-top">
                    <td className="min-w-[12rem] px-4 py-3 font-medium">
                      <Link href={`/projects/${p.projectId}`} className="hover:text-accent hover:underline">{p.projectName}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.departmentName}</td>
                    <td className="px-4 py-3"><ProjectStatusBadge value={p.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(p.startDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(p.endDate)}</td>
                    <td className="px-4 py-3 tabular-nums">{p.taskCount}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button type="button" className={`${btnSmall} text-accent hover:bg-accent-soft`} onClick={() => setEditing(p)}>Edit</button>
                      <button type="button" className={`${btnSmall} text-red-600 hover:bg-red-50`} onClick={() => setDeleting(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loadable>

      <Modal open={editing !== null} title={editing === "new" ? "New project" : "Edit project"} onClose={() => setEditing(null)}>
        <ProjectForm
          initial={editing && editing !== "new" ? editing : undefined}
          departments={departments}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete project?"
        message={<>“{deleting?.projectName}” will be removed permanently. This only works if it has no tasks.</>}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
