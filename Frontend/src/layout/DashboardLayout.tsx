import type { ReactNode } from "react";
import { useState } from "react";
import {
  Bell,
  FileText,
  Home,
  LayoutTemplate,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import clsx from "clsx";
import { Button, Input } from "../components/common";

type DashboardLayoutProps = {
  children: ReactNode;
  activeItem?: string;
};

const menuItems = [
  { label: "Dashboard", icon: Home },
  { label: "My Resumes", icon: FileText },
  { label: "Templates", icon: LayoutTemplate },
  { label: "AI Assistant", icon: Sparkles },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

const DashboardLayout = ({
  children,
  activeItem = "Dashboard",
}: DashboardLayoutProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-white/5 p-5 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-3 shadow-lg shadow-indigo-500/30">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">VabticResume</h2>
              <p className="text-xs text-gray-400">Dark AI Workspace</p>
            </div>
          </div>

          <button className="lg:hidden" onClick={() => setOpen(false)} title="Close Menu">
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeItem === item.label;

            return (
              <button
                key={item.label}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-4 rounded-3xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm font-bold">Upgrade to Pro</p>
            <p className="mt-1 text-xs text-gray-400">
              Unlock premium templates and AI ATS scoring.
            </p>
          </div>

          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10" title="Logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#030712]/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <button
              className="rounded-xl bg-white/10 p-2 lg:hidden"
              onClick={() => setOpen(true)} title="Open Menu"
            >
              <Menu size={22} />
            </button>

            <div className="hidden max-w-md flex-1 md:block">
              <Input
                placeholder="Search resumes, templates..."
                leftIcon={<Search size={18} />}
                className="border-white/10 bg-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="relative rounded-2xl bg-white/10 p-3 text-gray-300 transition hover:bg-white/15" title="Notifications">
                <Bell size={20} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-400" />
              </button>

              <Button size="sm">Create Resume</Button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 font-bold" title="User Profile">
                S
              </div>
            </div>
          </div>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;