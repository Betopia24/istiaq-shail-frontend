import React from "react";
import Link from "next/link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  icon,
  iconPosition = "right",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
    md: "h-10 px-5 text-xs sm:text-sm rounded-xl gap-2",
    lg: "h-11 px-6 text-sm rounded-xl gap-2",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#D49800] text-[#06143E] font-semibold shadow-[0_2px_10px_rgba(232,168,8,0.3)] hover:shadow-[0_4px_16px_rgba(232,168,8,0.4)] active:scale-[0.98]",
    secondary:
      "bg-[#06143E] hover:bg-[#0B1E48] active:bg-[#040C1E] text-white font-semibold border border-[#162758] shadow-xs active:scale-[0.98]",
    outline:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold border border-slate-300 hover:border-slate-400 active:scale-[0.98] shadow-2xs",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 font-semibold active:scale-[0.98]",
    danger:
      "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold shadow-xs active:scale-[0.98]",
  };

  const baseStyles =
    "inline-flex items-center justify-center font-heading transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none";

  const fullClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={fullClassName}>
        {icon && iconPosition === "left" && icon}
        <span>{children}</span>
        {icon && iconPosition === "right" && icon}
      </Link>
    );
  }

  return (
    <button className={fullClassName} disabled={disabled} {...props}>
      {icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
