import { Bell, Menu, Search, Sparkles, User } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";

type NavbarProps = {
  onMenuClick?: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-2 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">VabticResume</h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                AI Resume Builder
              </p>
            </div>
          </div>
        </div>

        <div className="hidden w-full max-w-md md:block">
          <Input
            placeholder="Search templates, resumes..."
            leftIcon={<Search size={18} />}
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-xl p-2 text-gray-600 transition hover:bg-gray-100">
            <Bell size={21}  />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Button size="sm">Create Resume</Button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition hover:scale-105">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
