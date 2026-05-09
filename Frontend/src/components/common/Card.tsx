import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
};

const Card = ({ children, hover = true, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx("mb-4", className)}>{children}</div>
);

const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={clsx("text-lg font-bold text-gray-900", className)}>{children}</h3>
);

const CardDescription = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={clsx("mt-1 text-sm text-gray-500", className)}>{children}</p>
);

const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx("text-sm text-gray-700", className)}>{children}</div>
);

const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx("mt-5 flex items-center justify-end gap-3", className)}>{children}</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;