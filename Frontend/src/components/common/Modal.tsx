import type { ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import Button from "./Button";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  footer?: ReactNode;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={clsx(
          "relative w-full rounded-2xl bg-white shadow-2xl",
          "animate-[modalPop_0.25s_ease-out]",
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full px-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;