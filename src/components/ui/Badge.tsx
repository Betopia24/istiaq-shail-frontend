import React from "react";
import { Sparkles } from "lucide-react";

export type BadgeVariant =
  | "brand"
  | "navy"
  | "neutral"
  | "success"
  | "warning"
  | "demo";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  icon,
  children,
  className = "",
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    brand: "bg-[#FEF3C7] text-[#8C6605] border-[#FDE68A]",
    navy: "bg-[#092167] text-white border-[#1E3B87]",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60",
    demo: "bg-amber-100/80 text-amber-900 border-amber-300 font-medium uppercase tracking-wider text-[10px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-2xs transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
