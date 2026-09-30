"use client";

import { useState, type FormEvent } from "react";
import type { Project, Tag, Task, TaskInput } from "@/lib/types";
import { TASK_PRIORITY, TASK_STATUS } from "@/lib/constants";
import { reportSubmitError } from "@/lib/forms";
import { Field } from "@/components/ui/Field";
import { inputCls } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";
import { TagPicker } from "@/components/TagPicker";
import { FormFooter } from "./FormFooter";

export function TaskForm({
  initial, projects, tags, onSubmit, onCancel,
}: {
  initial?: Task; projects: Project[]; tags: Tag[];
  onSubmit: (input: TaskInput) => Promise<void>; onCancel: () => void;
}) {
  const toast = useToast();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState(initial?.status ?? 0);
  const [priority, setPriority] = useState(initial?.priority ?? 1);
  const [dueDate, setDueDate] = useState(initial?.dueDate?.slice(0, 10) ?? "");
  const [projectId, setProjectId] = useState(initial?.projectId ? String(initial.projectId) : "");
  const [tagIds, setTagIds] = useState<number[]>(initial?.tags.map((t) => t.tagId) ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required.";
    else if (title.trim().length > 300) next.title = "Use at most 300 characters.";
    if (!projectId) next.projectId = "Choose a project.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        dueDate: dueDate || null,
        projectId: Number(projectId),
        tagIds,
      });
    } catch (err) {
      reportSubmitError(err, setErrors, toast.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Title" htmlFor="title" error={errors.title}>
        <input id="title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} autoFocus />
      </Field>
      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea id="description" className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="Project" htmlFor="projectId" error={errors.projectId}>
        <select id="projectId" className={inputCls} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">Select a project</option>
          {projects.map((p) => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Status" htmlFor="status" error={errors.status}>
          <select id="status" className={inputCls} value={status} onChange={(e) => setStatus(Number(e.target.value))}>
            {TASK_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Priority" htmlFor="priority" error={errors.priority}>
          <select id="priority" className={inputCls} value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
            {TASK_PRIORITY.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
          <input id="dueDate" type="date" className={inputCls} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Tags</p>
        <TagPicker tags={tags} value={tagIds} onChange={setTagIds} />
        {errors.tagIds && <p className="mt-1 text-xs text-red-600" role="alert">{errors.tagIds}</p>}
      </div>
      <FormFooter saving={saving} isEdit={!!initial} onCancel={onCancel} />
    </form>
  );
}
