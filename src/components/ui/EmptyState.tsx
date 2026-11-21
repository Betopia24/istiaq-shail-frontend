import React from "react";
import Link from "next/link";
import { FolderOpen, LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-14 text-center max-w-xl mx-auto space-y-5 shadow-2xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#E8A808] flex items-center justify-center mx-auto shadow-2xs border border-amber-100">
        <Icon className="w-7 h-7 stroke-[2]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading font-semibold text-lg sm:text-xl text-slate-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {primaryAction &&
            (primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-heading font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {primaryAction.icon && (
                  <primaryAction.icon className="w-4 h-4 text-[#E8A808]" />
                )}
                <span>{primaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-heading font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {primaryAction.icon && (
                  <primaryAction.icon className="w-4 h-4 text-[#E8A808]" />
                )}
                <span>{primaryAction.label}</span>
              </button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="w-full sm:w-auto h-11 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center justify-center cursor-pointer"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto h-11 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center justify-center cursor-pointer"
              >
                {secondaryAction.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
