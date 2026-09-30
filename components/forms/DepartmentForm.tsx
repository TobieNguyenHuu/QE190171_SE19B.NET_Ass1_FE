"use client";

import { useState, type FormEvent } from "react";
import type { Department, DepartmentInput } from "@/lib/types";
import { reportSubmitError } from "@/lib/forms";
import { Field } from "@/components/ui/Field";
import { inputCls } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";
import { FormFooter } from "./FormFooter";

export function DepartmentForm({
  initial, onSubmit, onCancel,
}: { initial?: Department; onSubmit: (input: DepartmentInput) => Promise<void>; onCancel: () => void }) {
  const toast = useToast();
  const [name, setName] = useState(initial?.departmentName ?? "");
  const [description, setDescription] = useState(initial?.departmentDescription ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.departmentName = "Department name is required.";
    else if (name.trim().length > 100) next.departmentName = "Use at most 100 characters.";
    if (!description.trim()) next.departmentDescription = "Description is required.";
    else if (description.trim().length > 300) next.departmentDescription = "Use at most 300 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({ departmentName: name.trim(), departmentDescription: description.trim(), isActive: initial?.isActive ?? true });
    } catch (err) {
      reportSubmitError(err, setErrors, toast.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Name" htmlFor="departmentName" error={errors.departmentName}>
        <input id="departmentName" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoFocus />
      </Field>
      <Field label="Description" htmlFor="departmentDescription" error={errors.departmentDescription} hint={`${description.length}/300`}>
        <textarea id="departmentDescription" className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
      </Field>
      <FormFooter saving={saving} isEdit={!!initial} onCancel={onCancel} />
    </form>
  );
}
