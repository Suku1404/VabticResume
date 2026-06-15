import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const PageHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const pathnameLower = pathname.toLowerCase();
  const isFlowPage =
    pathnameLower === "/user/register" ||
    pathnameLower === "/user/login" ||
    pathnameLower.startsWith("/builder") ||
    pathnameLower === "/ats-score-checker" ||
    pathnameLower === "/ai-resume-improve";

  // Render header only on flow wizard pages
  if (!isFlowPage) {
    return null;
  }

  // Define steps workflow
  const getNavPaths = (path: string) => {
    const p = path.toLowerCase();
    if (p === "/user/register") {
      return { back: "/", next: "/user/login", backLabel: "Home", nextLabel: "Login" };
    }
    if (p === "/user/login") {
      return { back: "/user/register", next: "/dashboard", backLabel: "Register", nextLabel: "Dashboard" };
    }
    if (p === "/dashboard" || p === "/dashboardlayout") {
      return { back: "/user/login", next: "/user/templates", backLabel: "Login", nextLabel: "Templates" };
    }
    if (p === "/user/templates") {
      return { back: "/dashboard", next: "/builder/ats", backLabel: "Dashboard", nextLabel: "Resume Builder" };
    }
    if (p.startsWith("/builder")) {
      return { back: "/user/templates", next: "/ats-score-checker", backLabel: "Templates", nextLabel: "ATS Checker" };
    }
    if (p === "/ats-score-checker") {
      return { back: "/builder/ats", next: "/dashboard", backLabel: "Resume Builder", nextLabel: "Dashboard" };
    }
    if (p === "/ai-resume-improve") {
      return { back: "/dashboard", next: "/dashboard", backLabel: "Dashboard", nextLabel: "Dashboard" };
    }
    if (p.startsWith("/my-resume")) {
      return { back: "/dashboard", next: "/user/templates", backLabel: "Dashboard", nextLabel: "Templates" };
    }
    return { back: "/dashboard", next: "/user/templates", backLabel: "Dashboard", nextLabel: "Templates" };
  };

  const nav = getNavPaths(pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/80 text-slate-800 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-2.5 text-white shadow-md shadow-indigo-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">VabticResume</h2>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Premium Workspace</p>
          </div>
        </Link>

        {/* Back and Next navigation buttons */}
        {nav && (
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate(nav.back)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              title={`Go back to ${nav.backLabel}`}
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Back: {nav.backLabel}</span>
              <span className="sm:hidden">Back</span>
            </button>

            <button
              onClick={() => navigate(nav.next)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-indigo-500/20"
              title={`Go next to ${nav.nextLabel}`}
            >
              <span className="hidden sm:inline">Next: {nav.nextLabel}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Theme Toggle & User controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Render logout if authenticated/on workspace pages */}
          {["/dashboard", "/dashboardlayout", "/user/templates", "/builder", "/ats-score-checker", "/my-resume"].some((sub) =>
            pathname.toLowerCase().startsWith(sub)
          ) && (
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50/50 text-red-600 shadow-sm transition hover:bg-red-100/50 dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
