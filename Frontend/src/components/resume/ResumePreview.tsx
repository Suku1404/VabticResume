import { forwardRef, type ReactNode } from "react";

type ResumePreviewProps = {
  children: ReactNode;
  className?: string;
};

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full bg-white text-gray-900 shadow-sm ${className}`}
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
