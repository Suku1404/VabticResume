import {
  BarChart3,
  FileText,
  Home,
  LayoutTemplate,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import clsx from "clsx";

type SidebarProps = {
  isOpen?: boolean;
  activeItem?: string;
};

const menuItems = [
  { label: "Dashboard", icon: Home },
  { label: "My Resumes", icon: FileText },
  { label: "Templates", icon: LayoutTemplate },
  { label: "ATS Score", icon: BarChart3 },
  { label: "AI Assistant", icon: Sparkles },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

const Sidebar = ({ isOpen = true, activeItem = "Dashboard" }: SidebarProps) => {
  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-50 h-screen w-72 border-r border-gray-200 bg-white/90 p-5 shadow-xl backdrop-blur-xl transition-transform duration-300 lg:sticky lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-3 text-white shadow-lg shadow-indigo-500/25">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">VabticResume</h2>
          <p className="text-xs text-gray-500">Premium Resume Builder</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              className={clsx(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-4 text-white shadow-lg">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-gray-300">
            Unlock AI resume scoring and premium templates.
          </p>
        </div>

        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;