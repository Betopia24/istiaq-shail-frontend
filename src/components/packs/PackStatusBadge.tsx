import React from "react";
import { Loader2, CheckCircle2, Clock, AlertTriangle, Globe, Archive } from "lucide-react";
import { PackStatus } from "@/types/packs";

interface PackStatusBadgeProps {
  status: PackStatus | string;
  size?: "sm" | "md";
  className?: string;
}

export const PackStatusBadge: React.FC<PackStatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const normalized = status.toLowerCase() as PackStatus;

  const sizeClass =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1 font-semibold"
      : "text-xs px-2.5 py-1 gap-1.5 font-medium";

  switch (normalized) {
    case "generating":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClass} ${className}`}
        >
          <Loader2 className="w-3 h-3 animate-spin text-[#E8A808]" />
          <span>Generating</span>
        </span>
      );

    case "ready":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClass} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Ready</span>
        </span>
      );

    case "failed":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClass} ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>Failed</span>
        </span>
      );

    case "live":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-800 border border-blue-300 ${sizeClass} ${className}`}
        >
          <Globe className="w-3 h-3 text-blue-600" />
          <span>Live / Public</span>
        </span>
      );

    case "archived":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-300 ${sizeClass} ${className}`}
        >
          <Archive className="w-3 h-3 text-slate-500" />
          <span>Archived</span>
        </span>
      );

    case "draft":
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass} ${className}`}
        >
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Draft</span>
        </span>
      );
  }
};

export default PackStatusBadge;
