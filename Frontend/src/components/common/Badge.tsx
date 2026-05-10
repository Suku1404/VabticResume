import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const Badge = ({ children, variant = "primary", className }: BadgeProps) => {
  const variants = {
    primary: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    success: "bg-green-50 text-green-700 ring-green-200",
    warning: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
    neutral: "bg-gray-100 text-gray-700 ring-gray-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;