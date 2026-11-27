"use client";

import React, { useState } from "react";
import { Download, Loader2, ShieldCheck, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { apiErrorInfo } from "@/components/ui/ErrorState";
import { authClient, errorText } from "@/lib/auth/client";
import { useAppSelector } from "@/redux/hook";
import { useGetBrandingQuery, useGetComplianceQuery, useUpdateComplianceMutation } from "@/redux/api/agency/agencyApi";

/** POST through this app's proxy (cookies carry the session; the proxy adds the token). */
async function post(path: string, body: unknown) {
  const response = await fetch(`/api/backend${path}`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw { status: response.status, data };
  return data;
}

/** After an erasure the session is gone on the server; clear this browser's too and leave. */
async function signOutAndLeave() {
  await authClient.logout().catch(() => undefined);
  window.location.assign("/?account=deleted");
}

const cardCls = "bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-5 shadow-2xs";
const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#092167]";

function ConfirmDialog({
  title,
  children,
  busy,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  busy: boolean;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading font-semibold text-lg text-rose-700">{title}</h3>
          <button type="button" onClick={onCancel} disabled={busy} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onCancel} disabled={busy} className="flex-1 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 h-10 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** The person's own data: a copy of it, and deleting the account (UK GDPR art. 15, 17, 20). */
export function PersonalDataSection() {
  const role = useAppSelector((s) => s.user?.user?.role);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await post("/me/delete", { password });
      toast.success("Your account has been deleted");
      await signOutAndLeave();
    } catch (err) {
      const info = err as { status?: number; data?: { message?: string } };
      setError(info.data?.message ?? "Could not delete the account. Try again.");
      setBusy(false);
    }
  };

  return (
    <div className={cardCls}>
      <div>
        <h3 className="font-heading font-medium text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Your data and privacy
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Get a copy of the personal data we hold about you, or delete your account.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/api/backend/me/export"
          className="h-10 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-3.5 h-3.5" /> Download my data
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 px-4 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete my account
        </button>
      </div>
      {role === "owner" && (
        <p className="text-[11px] text-slate-500">
          You own this agency: to close everything, delete the agency in <strong>Regional Compliance</strong>, or make someone else the owner first.
        </p>
      )}
      {open && (
        <ConfirmDialog
          title="Delete your account?"
          busy={busy}
          confirmLabel="Delete my account"
          onCancel={() => {
            setOpen(false);
            setError(null);
          }}
          onConfirm={remove}
        >
          <p className="text-sm text-slate-600">
            Your name, email, phone and profile are erased and you are signed out everywhere. This cannot be undone. Listings you created stay with
            your agency.
          </p>
          <label className="block text-xs font-medium text-slate-700">
            Your password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
        </ConfirmDialog>
      )}
    </div>
  );
}

const RETENTION_OPTIONS = [
  { value: 6, label: "6 months" },
  { value: 12, label: "12 months" },
  { value: 24, label: "24 months (default)" },
  { value: 36, label: "36 months" },
  { value: 60, label: "5 years" },
  { value: 0, label: "Keep (no automatic removal)" },
];

/** The agency's data: retention of buyer enquiries, a copy of everything, and deleting the agency (owner). */
export function AgencyDataSection() {
  const role = useAppSelector((s) => s.user?.user?.role);
  const isOwner = role === "owner";
  const canEdit = role === "owner" || role === "administrator";
  const compliance = useGetComplianceQuery(undefined, { skip: !canEdit });
  const branding = useGetBrandingQuery(undefined, { skip: !isOwner });
  const [updateCompliance, { isLoading: saving }] = useUpdateComplianceMutation();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmName, setConfirmName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canEdit) return null;
  const months = (compliance.data?.leadRetentionMonths as number | undefined) ?? 24;
  const agencyName = branding.data?.agencyName ?? "";

  const saveRetention = async (value: number) => {
    try {
      await updateCompliance({ leadRetentionMonths: value }).unwrap();
      toast.success("Retention setting saved");
    } catch (err) {
      toast.error(apiErrorInfo(err).status === 403 ? "Only the owner or an administrator can change this" : errorText(err));
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await post("/agency/delete", { password, confirmName });
      toast.success("The agency has been deleted");
      await signOutAndLeave();
    } catch (err) {
      const info = err as { data?: { message?: string } };
      setError(info.data?.message ?? "Could not delete the agency. Try again.");
      setBusy(false);
    }
  };

  return (
    <div className={cardCls}>
      <div>
        <h3 className="font-heading font-medium text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Data protection (UK GDPR)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">How long buyer enquiries are kept, a copy of your agency&apos;s data, and closing the agency.</p>
      </div>

      <label className="block text-xs font-medium text-slate-700 max-w-sm">
        Remove buyers&apos; personal details from enquiries after
        <select
          value={months}
          disabled={saving || compliance.isLoading}
          onChange={(e) => saveRetention(Number(e.target.value))}
          className={`${inputCls} mt-1 bg-white`}
        >
          {RETENTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="block text-[11px] text-slate-500 font-normal mt-1">
          The enquiry stays in your statistics; the buyer&apos;s name, email and phone are removed. Checked automatically every few hours.
        </span>
      </label>

      {isOwner && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <a
            href="/api/backend/agency/export"
            className="h-10 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Download all agency data
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete this agency
          </button>
        </div>
      )}

      {open && (
        <ConfirmDialog
          title="Delete this agency?"
          busy={busy}
          confirmLabel="Delete the agency"
          onCancel={() => {
            setOpen(false);
            setError(null);
          }}
          onConfirm={remove}
        >
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
            <li>The subscription is cancelled now.</li>
            <li>Listings, photos, PDFs and share links are removed.</li>
            <li>Buyers&apos; details in enquiries are erased.</li>
            <li>Team members&apos; accounts are erased (unless they work for another agency).</li>
            <li>Invoices are kept for 6 years, as UK tax law requires.</li>
          </ul>
          <p className="text-sm font-medium text-slate-800">This cannot be undone. Download your data first if you need it.</p>
          <label className="block text-xs font-medium text-slate-700">
            Type the agency name: <strong>{agencyName}</strong>
            <input value={confirmName} onChange={(e) => setConfirmName(e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            Your password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
        </ConfirmDialog>
      )}
    </div>
  );
}
