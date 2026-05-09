import clsx from "clsx";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
};

const Loader = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  className,
}: LoaderProps) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const loader = (
    <div className={clsx("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <div
          className={clsx(
            "rounded-full border-4 border-gray-200",
            sizes[size]
          )}
        />
        <div
          className={clsx(
            "absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600",
            sizes[size]
          )}
        />
      </div>

      {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;