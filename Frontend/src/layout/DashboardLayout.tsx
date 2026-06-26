import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import {
  Home,
  LayoutTemplate,
  LogOut,
  Menu,
  Sparkles,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  Compass,
  Trophy
} from "lucide-react";
import clsx from "clsx";
import { Button, ThemeToggle, NotificationBell } from "../components/common";

type DashboardLayoutProps = {
  children: ReactNode;
  activeItem?: string;
};

const menuItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Templates", icon: LayoutTemplate, path: "/user/templates" },
  { label: "Resume Match", icon: Target, path: "/resume-match" },
  { label: "Interview Prep", icon: Trophy, path: "/interview-prep" },
  { label: "Career Copilot", icon: Compass, path: "/career-copilot" },
  { label: "AI Assistant", icon: Sparkles, path: "/ai-resume-improve" },
  { label: "ATS Checker", icon: Target, path: "/ats-score-checker" },
  { label: "Profile", icon: User, path: "/profile" },
];

const DashboardLayout = ({
  children,
  activeItem = "Dashboard",
}: DashboardLayoutProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userInitials, setUserInitials] = useState("U");

  useEffect(() => {
    const fetchInitials = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.name) {
            const firstLetter = payload.name.trim().charAt(0).toUpperCase();
            setUserInitials(firstLetter || "U");
          }
        }
      } catch (err) {
        console.error("Error reading token for initials", err);
      }
    };

    fetchInitials();

    // Listen for storage updates (e.g. if username changes in Profile page)
    window.addEventListener("storage", fetchInitials);
    // Support custom profile update events as well
    window.addEventListener("profileUpdated", fetchInitials);

    return () => {
      window.removeEventListener("storage", fetchInitials);
      window.removeEventListener("profileUpdated", fetchInitials);
    };
  }, []);

  // Determine back/next paths for dashboard/templates pages
  const getNavPaths = (path: string) => {
    const p = path.toLowerCase();
    if (p === "/dashboard" || p === "/dashboardlayout") {
      return { back: "/", next: "/user/templates", backLabel: "Home", nextLabel: "Templates" };
    }
    if (p === "/user/templates") {
      return { back: "/dashboard", next: "/resume-match", backLabel: "Dashboard", nextLabel: "Resume Match" };
    }
    if (p === "/resume-match") {
      return { back: "/user/templates", next: "/interview-prep", backLabel: "Templates", nextLabel: "Interview Prep" };
    }
    if (p === "/interview-prep") {
      return { back: "/resume-match", next: "/career-copilot", backLabel: "Resume Match", nextLabel: "Career Copilot" };
    }
    if (p === "/career-copilot") {
      return { back: "/interview-prep", next: "/ai-resume-improve", backLabel: "Interview Prep", nextLabel: "AI Assistant" };
    }
    if (p === "/ai-resume-improve") {
      return { back: "/career-copilot", next: "/ats-score-checker", backLabel: "Career Copilot", nextLabel: "ATS Checker" };
    }
    if (p === "/ats-score-checker") {
      return { back: "/ai-resume-improve", next: "/profile", backLabel: "AI Assistant", nextLabel: "Profile" };
    }
    if (p === "/profile") {
      return { back: "/ats-score-checker", next: "/dashboard", backLabel: "ATS Checker", nextLabel: "Dashboard" };
    }
    return { back: "/dashboard", next: "/user/templates", backLabel: "Dashboard", nextLabel: "Templates" };
  };

  const nav = getNavPaths(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#030712] dark:text-white transition-colors duration-300">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/50 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-3 shadow-lg shadow-indigo-500/30 text-white">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">VabticResume</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Resume Builder</p>
            </div>
          </Link>

          <button className="lg:hidden" onClick={() => setOpen(false)} title="Close Menu">
            <X size={22} className="text-slate-800 dark:text-white" />
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
                    : "text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                )}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-4 rounded-3xl border border-gray-200 bg-slate-100 dark:border-white/10 dark:bg-white/10 p-4">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Upgrade to Pro</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Unlock premium templates and AI ATS scoring.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10 transition"
            title="Logout"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 dark:border-white/10 dark:bg-[#030712]/80 px-6 py-4 backdrop-blur-xl transition-colors duration-300">
          <div className="flex items-center justify-between gap-4">
            <button
              className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 p-2 lg:hidden"
              onClick={() => setOpen(true)} title="Open Menu"
            >
              <Menu size={22} className="text-slate-800 dark:text-white" />
            </button>

            {/* Back & Next navigation buttons for dashboard / templates pages */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(nav.back)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-gray-100 dark:hover:bg-white/10 text-slate-800 dark:text-white"
                title={`Go back to ${nav.backLabel}`}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Back: {nav.backLabel}</span>
                <span className="sm:hidden">Back</span>
              </button>

              <button
                onClick={() => navigate(nav.next)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                title={`Go next to ${nav.nextLabel}`}
              >
                <span className="hidden sm:inline">Next: {nav.nextLabel}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />

              <NotificationBell />

              <Button size="sm" className="hidden sm:flex">
                <Link to={"/user/templates"}>Create Resume</Link>
              </Button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold" title="User Profile">
                {userInitials}
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
