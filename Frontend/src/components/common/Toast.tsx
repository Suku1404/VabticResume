import type { ReactNode } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  action?: ReactNode;
};

const Toast = ({ type = "info", title, message, onClose, action }: ToastProps) => {
  const styles = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      className: "border-green-200 bg-green-50 text-green-700",
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      className: "border-red-200 bg-red-50 text-red-700",
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      className: "border-indigo-200 bg-indigo-50 text-indigo-700",
    },
  };

  return (
    <div
      className={clsx(
        "flex w-full max-w-md items-start gap-3 rounded-2xl border p-4 shadow-lg",
        styles[type].className
      )}
    >
      <div className="mt-0.5">{styles[type].icon}</div>

      <div className="flex-1">
        <h3 className="text-sm font-bold">{title}</h3>
        {message && <p className="mt-1 text-sm opacity-80">{message}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>

      {onClose && (
        <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5" title="button">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;