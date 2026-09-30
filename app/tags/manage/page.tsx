"use client";

import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import type { TagInput, TagUsage } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { TagChip } from "@/components/badges";
import { TagForm } from "@/components/forms/TagForm";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnPrimary, btnSmall } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";

export default function ManageTagsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(api.tags.list);
  const [editing, setEditing] = useState<TagUsage | "new" | null>(null);
  const [deleting, setDeleting] = useState<TagUsage | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(input: TagInput) {
    if (editing && editing !== "new") {
      await api.tags.update(editing.tagId, input);
      toast.success("Tag updated");
    } else {
      await api.tags.create(input);
      toast.success("Tag created");
    }
    setEditing(null);
    reload();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.tags.remove(deleting.tagId);
      toast.success("Tag deleted");
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
        title="Manage tags"
        description="Create, edit or delete tags. A tag that is used by a task cannot be deleted."
        action={<button type="button" className={btnPrimary} onClick={() => setEditing("new")}>New tag</button>}
      />

      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 && <EmptyState title="No tags yet">Use “New tag” to add the first one.</EmptyState>}
        {data && data.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Tag</th>
                  <th className="px-4 py-3 font-medium">Color</th>
                  <th className="px-4 py-3 font-medium">Used by</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((t) => (
                  <tr key={t.tagId}>
                    <td className="px-4 py-3"><TagChip tag={t} /></td>
                    <td className="px-4 py-3 text-muted">{t.color ?? "—"}</td>
                    <td className="px-4 py-3 tabular-nums">{t.taskCount} {t.taskCount === 1 ? "task" : "tasks"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button type="button" className={`${btnSmall} text-accent hover:bg-accent-soft`} onClick={() => setEditing(t)}>Edit</button>
                      <button type="button" className={`${btnSmall} text-red-600 hover:bg-red-50`} onClick={() => setDeleting(t)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loadable>

      <Modal open={editing !== null} title={editing === "new" ? "New tag" : "Edit tag"} onClose={() => setEditing(null)}>
        <TagForm initial={editing && editing !== "new" ? editing : undefined} onSubmit={save} onCancel={() => setEditing(null)} />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete tag?"
        message={<>“{deleting?.tagName}” will be removed permanently. This only works if no task uses it.</>}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
