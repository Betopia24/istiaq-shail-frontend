import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
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
    sm: "h-9 px-4 text-xs rounded-lg gap-1.5",
    md: "h-11 px-6 text-sm rounded-xl gap-2",
    lg: "h-12 px-7 text-sm rounded-xl gap-2",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-semibold shadow-[0_3px_12px_rgba(232,168,8,0.35)] hover:shadow-[0_5px_18px_rgba(232,168,8,0.45)] active:scale-[0.98]",
    secondary:
      "bg-[#092167] hover:bg-[#06143E] active:bg-[#030b24] text-white font-semibold border border-[#1E3B87] shadow-xs active:scale-[0.98]",
    outline:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-medium border border-slate-300 hover:border-slate-400 active:scale-[0.98] shadow-2xs",
    ghost:
      "bg-transparent hover:bg-slate-100/70 text-slate-700 font-medium active:scale-[0.98]",
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
