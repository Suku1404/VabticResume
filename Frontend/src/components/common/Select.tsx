import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

type Option = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
};

const Select = ({ label, error, helperText, options, className, id, ...props }: SelectProps) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={clsx(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition-all duration-300 dark:bg-slate-900 dark:text-white",
          "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 dark:border-white/10",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : (
        helperText && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Select;