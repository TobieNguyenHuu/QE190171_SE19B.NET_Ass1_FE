"use client";

import Link from "next/link";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import type { Department, DepartmentInput } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { DepartmentForm } from "@/components/forms/DepartmentForm";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnPrimary, btnSmall } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";

export default function ManageDepartmentsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(api.departments.list);
  const [editing, setEditing] = useState<Department | "new" | null>(null);
  const [deleting, setDeleting] = useState<Department | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(input: DepartmentInput) {
    if (editing && editing !== "new") {
      await api.departments.update(editing.departmentId, input);
      toast.success("Department updated");
    } else {
      await api.departments.create(input);
      toast.success("Department created");
    }
    setEditing(null);
    reload();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.departments.remove(deleting.departmentId);
      toast.success("Department deleted");
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
        title="Manage departments"
        description="Create, edit or delete departments. A department with projects cannot be deleted."
        action={<button type="button" className={btnPrimary} onClick={() => setEditing("new")}>New department</button>}
      />

      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 && <EmptyState title="No departments yet">Use “New department” to add the first one.</EmptyState>}
        {data && data.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Projects</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((d) => (
                  <tr key={d.departmentId} className="align-top">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/departments/${d.departmentId}`} className="hover:text-accent hover:underline">{d.departmentName}</Link>
                    </td>
                    <td className="min-w-[16rem] px-4 py-3 text-muted">{d.departmentDescription}</td>
                    <td className="px-4 py-3 tabular-nums">{d.projectCount}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button type="button" className={`${btnSmall} text-accent hover:bg-accent-soft`} onClick={() => setEditing(d)}>Edit</button>
                      <button type="button" className={`${btnSmall} text-red-600 hover:bg-red-50`} onClick={() => setDeleting(d)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loadable>

      <Modal open={editing !== null} title={editing === "new" ? "New department" : "Edit department"} onClose={() => setEditing(null)}>
        <DepartmentForm initial={editing && editing !== "new" ? editing : undefined} onSubmit={save} onCancel={() => setEditing(null)} />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete department?"
        message={<>“{deleting?.departmentName}” will be removed permanently. This only works if it has no projects.</>}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
