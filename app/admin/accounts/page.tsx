"use client";

import { useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { reportSubmitError } from "@/lib/forms";
import { useAuth } from "@/lib/auth";
import { useFetch } from "@/lib/useFetch";
import { formatDate } from "@/lib/format";
import type { Account } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { FormFooter } from "@/components/forms/FormFooter";
import { Field } from "@/components/ui/Field";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Loadable } from "@/components/ui/Spinner";
import { btnSmall, inputCls } from "@/components/ui/styles";
import { useToast } from "@/components/ui/Toast";

function AccountForm({
  account, onSubmit, onCancel,
}: { account: Account; onSubmit: (fullName: string, role: number) => Promise<void>; onCancel: () => void }) {
  const toast = useToast();
  const [fullName, setFullName] = useState(account.fullName);
  const [role, setRole] = useState(account.role);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    else if (fullName.trim().length > 100) next.fullName = "Use at most 100 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(fullName.trim(), role);
    } catch (err) {
      reportSubmitError(err, setErrors, toast.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-muted">Email: <span className="font-medium text-ink">{account.email}</span></p>
      <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
        <input id="fullName" className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} autoFocus />
      </Field>
      <Field label="Role" htmlFor="role" error={errors.role}>
        <select id="role" className={inputCls} value={role} onChange={(e) => setRole(Number(e.target.value))}>
          <option value={0}>Staff</option>
          <option value={1}>Admin</option>
        </select>
      </Field>
      <FormFooter saving={saving} isEdit onCancel={onCancel} />
    </form>
  );
}

export default function AccountsPage() {
  const toast = useToast();
  const { user, isAdmin } = useAuth();
  // Staff never calls the endpoint (it would answer 403).
  const { data, loading, error, reload } = useFetch(
    () => (isAdmin ? api.accounts.list() : Promise.resolve([] as Account[])),
    [isAdmin],
  );
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Accounts" />
        <EmptyState title="Admins only">Your account (Staff) is not allowed to manage accounts.</EmptyState>
      </div>
    );
  }

  async function save(fullName: string, role: number) {
    if (!editing) return;
    await api.accounts.update(editing.accountId, { fullName, role });
    toast.success("Account updated");
    setEditing(null);
    reload();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.accounts.remove(deleting.accountId);
      toast.success("Account deleted");
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
        title="Accounts"
        description="Update an account’s role or delete it. An account that has created tasks cannot be deleted."
      />

      <Loadable loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 && <EmptyState title="No accounts yet" />}
        {data && data.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((a) => {
                  const isSelf = a.accountId === user?.accountId;
                  return (
                    <tr key={a.accountId}>
                      <td className="px-4 py-3 font-medium">
                        {a.fullName} {isSelf && <span className="text-xs font-normal text-muted">(you)</span>}
                      </td>
                      <td className="px-4 py-3 text-muted">{a.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${a.role === 1 ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                          {a.roleName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDate(a.createdDate)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button type="button" className={`${btnSmall} text-accent hover:bg-accent-soft`} onClick={() => setEditing(a)}>Edit</button>
                        <button
                          type="button"
                          className={`${btnSmall} text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40`}
                          disabled={isSelf}
                          title={isSelf ? "You cannot delete your own account" : undefined}
                          onClick={() => setDeleting(a)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Loadable>

      <Modal open={editing !== null} title="Edit account" onClose={() => setEditing(null)}>
        {editing && <AccountForm account={editing} onSubmit={save} onCancel={() => setEditing(null)} />}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete account?"
        message={<>“{deleting?.fullName}” ({deleting?.email}) will be removed permanently. This only works if the account has not created any task.</>}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
