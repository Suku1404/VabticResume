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
        <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={clsx(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition-all duration-300",
          "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : (
        helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;