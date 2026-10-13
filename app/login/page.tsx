"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { btnPrimary, inputCls } from "@/components/ui/styles";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Messages passed through the query string: ?expired=1 (token expired) / ?registered=1 (just signed up).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired")) setNotice("Your session has expired. Please log in again.");
    else if (params.get("registered")) setNotice("Registration successful. You can log in now.");
  }, []);

  // Already logged in -> go straight to the dashboard.
  useEffect(() => {
    if (ready && user) router.replace("/admin");
  }, [ready, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setFormError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold sm:text-3xl">Log in</h1>
      <p className="mt-1 text-sm text-muted">Log in to create, edit and delete departments, projects, tasks and tags.</p>

      {notice && (
        <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{notice}</p>
      )}
      {formError && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{formError}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <input id="password" type="password" autoComplete="current-password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <button type="submit" className={`${btnPrimary} w-full`} disabled={saving}>
          {saving && <Spinner className="h-4 w-4 text-white" />} Log in
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        No account yet? <Link href="/register" className="font-medium text-accent hover:underline">Register</Link>
      </p>
    </div>
  );
}
