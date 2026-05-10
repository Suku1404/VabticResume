import type { ReactNode } from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

const AuthLayout = ({
  children,
  title = "Build resumes that feel ready for the future.",
  subtitle = "A premium dark workspace for creating ATS-friendly, AI-powered resumes.",
}: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-2 lg:items-center">
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-200 backdrop-blur-xl">
            <Sparkles size={16} />
            VabticResume AI Workspace
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-lg text-lg text-gray-300">{subtitle}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Feature icon={<ShieldCheck size={22} />} title="ATS Optimized" />
            <Feature icon={<Zap size={22} />} title="Instant Preview" />
          </div>
        </section>

        <section className="rounded-4xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
          {children}
        </section>
      </div>
    </div>
  );
};

const Feature = ({ icon, title }: { icon: ReactNode; title: string }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
    </div>
  );
};

export default AuthLayout;