import { forwardRef, type ReactNode } from "react";

type ResumePreviewProps = {
  children: ReactNode;
  className?: string;
};

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ children, className = "" }, ref) => (
    <div ref={ref} className={`resume-preview-shell shadow-2xl ${className}`}>
      {children}
    </div>
  )
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
