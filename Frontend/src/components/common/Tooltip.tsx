import type { ReactNode } from "react";
import clsx from "clsx";

type TooltipProps = {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom";
};

const Tooltip = ({ text, children, position = "top" }: TooltipProps) => {
  return (
    <div className="group relative inline-flex">
      {children}

      <span
        className={clsx(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100",
          position === "top"
            ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
            : "left-1/2 top-full mt-2 -translate-x-1/2"
        )}
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;