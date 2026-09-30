"use client";

import { useState, type FormEvent } from "react";
import type { TagInput, TagUsage } from "@/lib/types";
import { reportSubmitError } from "@/lib/forms";
import { Field } from "@/components/ui/Field";
import { inputCls } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";
import { FormFooter } from "./FormFooter";

export function TagForm({
  initial, onSubmit, onCancel,
}: { initial?: TagUsage; onSubmit: (input: TagInput) => Promise<void>; onCancel: () => void }) {
  const toast = useToast();
  const [name, setName] = useState(initial?.tagName ?? "");
  const [color, setColor] = useState(initial?.color ?? "#3B82F6");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.tagName = "Tag name is required.";
    else if (name.trim().length > 50) next.tagName = "Use at most 50 characters.";
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) next.color = "Pick a valid color.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({ tagName: name.trim(), color: color.toUpperCase() });
    } catch (err) {
      reportSubmitError(err, setErrors, toast.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Name" htmlFor="tagName" error={errors.tagName}>
        <input id="tagName" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={50} autoFocus />
      </Field>
      <Field label="Color" htmlFor="color" error={errors.color}>
        <div className="flex items-center gap-3">
          <input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-white p-1" />
          <span className="text-sm text-muted">{color.toUpperCase()}</span>
        </div>
      </Field>
      <FormFooter saving={saving} isEdit={!!initial} onCancel={onCancel} />
    </form>
  );
}
