import type { ReactNode } from "react";

export type BadgeVariant = "success" | "danger" | "warning" | "neutral" | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  pill?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  neutral: "bg-slate-800 text-slate-300 border-slate-700",
  info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

const Badge = ({
  children,
  variant = "neutral",
  className = "",
  pill = true,
}: BadgeProps) => {
  const roundedClass = pill ? "rounded-full" : "rounded";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${roundedClass} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
