"use client";

import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { TASK_STATUS } from "@/lib/constants";
import type { Task, TaskInput } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { TaskTable } from "@/components/TaskTable";
import { TaskForm } from "@/components/forms/TaskForm";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnPrimary, btnSmall, inputCls } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";

export default function ManageTasksPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() =>
    Promise.all([api.tasks.list(), api.projects.list(), api.tags.list()]),
  );
  const [editing, setEditing] = useState<Task | "new" | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [busy, setBusy] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const tasks = data?.[0] ?? [];
  const projects = data?.[1] ?? [];
  const tags = data?.[2] ?? [];
  const visible = statusFilter === "" ? tasks : tasks.filter((t) => String(t.status) === statusFilter);

  async function save(input: TaskInput) {
    if (editing && editing !== "new") {
      await api.tasks.update(editing.taskId, input);
      toast.success("Task updated");
    } else {
      await api.tasks.create(input);
      toast.success("Task created");
    }
    setEditing(null);
    reload();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.tasks.remove(deleting.taskId);
      toast.success("Task deleted");
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
        title="Manage tasks"
        description="Create, edit or delete tasks. Deleted tasks disappear from every list."
        action={<button type="button" className={btnPrimary} onClick={() => setEditing("new")}>New task</button>}
      />

      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <label htmlFor="statusFilter" className="text-sm font-medium">Show</label>
              <select id="statusFilter" className={`${inputCls} !w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                {TASK_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <span className="text-sm text-muted">{visible.length} of {tasks.length} tasks</span>
            </div>

            {tasks.length === 0 && <EmptyState title="No tasks yet">Use “New task” to add the first one.</EmptyState>}
            {tasks.length > 0 && visible.length === 0 && <EmptyState title="No tasks with this status" />}
            {visible.length > 0 && (
              <TaskTable
                tasks={visible}
                actions={(task) => (
                  <>
                    <button type="button" className={`${btnSmall} text-accent hover:bg-accent-soft`} onClick={() => setEditing(task)}>Edit</button>
                    <button type="button" className={`${btnSmall} text-red-600 hover:bg-red-50`} onClick={() => setDeleting(task)}>Delete</button>
                  </>
                )}
              />
            )}
          </>
        )}
      </Loadable>

      <Modal open={editing !== null} title={editing === "new" ? "New task" : "Edit task"} onClose={() => setEditing(null)}>
        <TaskForm
          initial={editing && editing !== "new" ? editing : undefined}
          projects={projects}
          tags={tags}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete task?"
        message={<>“{deleting?.title}” will no longer appear in any list.</>}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
