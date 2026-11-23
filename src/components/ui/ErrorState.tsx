import React from "react";
import { AlertTriangle } from "lucide-react";
import { errorText } from "@/lib/auth/client";

/** A failed load, with the API's message and a retry button. */
export function ErrorState({ error, onRetry, className = "" }: { error: unknown; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={`rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3 ${className}`}>
      <AlertTriangle className="w-6 h-6 text-rose-500 mx-auto" />
      <p className="text-sm text-rose-800">{errorText(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="h-9 px-4 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 cursor-pointer">
          Try again
        </button>
      )}
    </div>
  );
}

/** Status and code of an RTK Query error (`error.status`, `error.data.code`), for branching on 402, 404, 410... */
export function apiErrorInfo(error: unknown): { status: number | null; code: string | null; fields: Record<string, string> } {
  const e = error as { status?: unknown; data?: { code?: string; fields?: Record<string, string> } } | undefined;
  return { status: typeof e?.status === "number" ? e.status : null, code: e?.data?.code ?? null, fields: e?.data?.fields ?? {} };
}
