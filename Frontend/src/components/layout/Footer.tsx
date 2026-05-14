import { AtSign, ExternalLink, Mail, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 p-2 text-white">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">VabticResume</h2>
          </div>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            Build premium, ATS-friendly resumes designed for modern tech careers.
          </p>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <a href="#" className="transition hover:text-indigo-600">
            <ExternalLink size={20} />
          </a>
          <a href="#" className="transition hover:text-indigo-600">
            <AtSign size={20} />
          </a>
          <a href="#" className="transition hover:text-indigo-600">
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} VabticResume. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
