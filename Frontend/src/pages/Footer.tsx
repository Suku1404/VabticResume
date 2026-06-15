import {
  AtSign,
  ExternalLink,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { label: "Templates", to: "/user/templates" },
    { label: "ATS Score Checker", to: "/ats-score-checker" },
    { label: "Resume Builder", to: "/user/templates" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  const socialIcons = [ExternalLink, AtSign, Mail];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050713] text-slate-800 dark:text-white transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-600/5 dark:from-purple-600/10 via-indigo-600/5 dark:via-indigo-600/10 to-violet-600/5 dark:to-violet-600/10" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-xl" />

      <div className="relative px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 dark:bg-white/10 p-3 shadow-lg shadow-purple-500/20">
                <FileText className="text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Vabtic Resume
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-600 dark:text-gray-400">
              Build premium ATS-friendly resumes with modern templates, AI
              improvements, live preview, and recruiter-focused formatting.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-4 py-2 text-xs text-gray-600 dark:text-gray-300">
                <ShieldCheck size={16} />
                ATS Optimized
              </span>
              <span className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-4 py-2 text-xs text-gray-600 dark:text-gray-300">
                <Sparkles size={16} />
                AI Powered
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-purple-600 dark:text-purple-300">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-indigo-600 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-purple-600 dark:text-purple-300">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialIcons.map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-3 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-white hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Designed for students, freshers, developers, and future MAANG
              engineers.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-white/10 pt-6 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Vabtic Resume. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a href="#" className="transition duration-300 hover:text-indigo-600 dark:hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition duration-300 hover:text-indigo-600 dark:hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
