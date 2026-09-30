"use client";

import { useState, type FormEvent } from "react";
import type { Department, Project, ProjectInput } from "@/lib/types";
import { PROJECT_STATUS } from "@/lib/constants";
import { reportSubmitError } from "@/lib/forms";
import { Field } from "@/components/ui/Field";
import { inputCls } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";
import { FormFooter } from "./FormFooter";

export function ProjectForm({
  initial, departments, onSubmit, onCancel,
}: {
  initial?: Project; departments: Department[];
  onSubmit: (input: ProjectInput) => Promise<void>; onCancel: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(initial?.projectName ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate?.slice(0, 10) ?? "");
  const [status, setStatus] = useState(initial?.status ?? 0);
  const [departmentId, setDepartmentId] = useState(initial?.departmentId ? String(initial.departmentId) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.projectName = "Project name is required.";
    else if (name.trim().length > 200) next.projectName = "Use at most 200 characters.";
    if (!startDate) next.startDate = "Start date is required.";
    if (startDate && endDate && endDate < startDate) next.endDate = "End date must be on or after the start date.";
    if (!departmentId) next.departmentId = "Choose a department.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({
        projectName: name.trim(),
        description: description.trim() || null,
        startDate,
        endDate: endDate || null,
        status,
        departmentId: Number(departmentId),
        isActive: initial?.isActive ?? true,
      });
    } catch (err) {
      reportSubmitError(err, setErrors, toast.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Name" htmlFor="projectName" error={errors.projectName}>
        <input id="projectName" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={200} autoFocus />
      </Field>
      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea id="description" className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date" htmlFor="startDate" error={errors.startDate}>
          <input id="startDate" type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End date (optional)" htmlFor="endDate" error={errors.endDate}>
          <input id="endDate" type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="status" error={errors.status}>
          <select id="status" className={inputCls} value={status} onChange={(e) => setStatus(Number(e.target.value))}>
            {PROJECT_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Department" htmlFor="departmentId" error={errors.departmentId}>
          <select id="departmentId" className={inputCls} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Select a department</option>
            {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
          </select>
        </Field>
      </div>
      <FormFooter saving={saving} isEdit={!!initial} onCancel={onCancel} />
    </form>
  );
}
