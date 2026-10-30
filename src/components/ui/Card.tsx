import React from "react";

export type CardVariant = "white" | "slate" | "navy" | "featured";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "white",
  hoverEffect = true,
  children,
  className = "",
  ...props
}) => {
  const variantStyles: Record<CardVariant, string> = {
    white: "bg-white text-slate-900 border border-slate-200/90 shadow-xs",
    slate: "bg-slate-50/90 text-slate-900 border border-slate-200/90 shadow-xs",
    navy: "bg-[#091D4E] text-white border border-[#1E3B87] shadow-xl",
    featured:
      "bg-gradient-to-br from-[#06143E] via-[#091D4E] to-[#0A132C] text-white border-2 border-[#E8A808] shadow-[0_12px_40px_rgba(232,168,8,0.25)]",
  };

  const hoverStyles = hoverEffect
    ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    : "transition-shadow";

  return (
    <div
      className={`@container rounded-3xl p-6 sm:p-8 ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

