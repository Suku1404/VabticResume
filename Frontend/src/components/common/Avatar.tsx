import clsx from "clsx";

type AvatarProps = {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Avatar = ({ src, name, size = "md", className }: AvatarProps) => {
  const sizes = {
    sm: "h-9 w-9 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  };

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-indigo-600 to-violet-600 font-bold text-white shadow-md",
        sizes[size],
        className
      )}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </div>
  );
};

export default Avatar;