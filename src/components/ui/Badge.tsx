import React from "react";

export type BadgeVariant =
  | "brand"
  | "navy"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "demo";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}) => {
  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-xs sm:text-sm gap-2",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    brand: "bg-[#FEF3C7] text-[#78350F] border-[#FDE68A]",
    navy: "bg-[#06143E] text-[#E8A808] border-[#162758]",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-300",
    warning: "bg-amber-50 text-amber-900 border-amber-300",
    danger: "bg-rose-50 text-rose-800 border-rose-300",
    info: "bg-blue-50 text-blue-800 border-blue-300",
    demo: "bg-amber-100/90 text-amber-950 border-amber-300 font-semibold uppercase tracking-wider text-[10px]",
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full shadow-2xs select-none transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
