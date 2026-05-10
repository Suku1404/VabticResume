import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";

type DropdownItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
};

const Dropdown = ({
  trigger,
  items,
  align = "right",
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* FIXED HERE */}
      <div
        onClick={() => setOpen(!open)}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />

          <div
            className={clsx(
              "absolute z-40 mt-3 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition",
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;