import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition-all duration-300 dark:bg-slate-900 dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
            leftIcon && "pl-11",
            rightIcon && "pr-11",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
              : "border-gray-200 dark:border-white/10",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
