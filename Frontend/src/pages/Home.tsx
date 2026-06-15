import {
  ArrowRight,
  FileSearch,
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button, Badge, Card } from "../components/common";
import Footer from "./Footer";
import HomeExtraSections from "./ExtraSections";
import ThemeToggle from "../components/common/ThemeToggle";
import "../index.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const resumePreviewImages = [
  {
    src: "/67b6cb1f0620a4382b2a325a_Blue and Gray Simple Professional CV Resume.webp",
    alt: "Classic resume template preview",
  },
  {
    src: "/ChatGPT Image May 15, 2026, 10_40_22 AM.png",
    alt: "AI resume template preview",
  },
  {
    src: "Professional-Two-Page-Resume-Template-edit-online.png",
    alt: "Clean resume template preview",
  },
  {
    src: "resume-template-resumelab-ceramica@2x.png",
    alt: "Sidebar resume template preview",
  },
  {
    src: "ChatGPT Image May 15, 2026, 12_41_37 PM.png",
    alt: "Bold resume template preview",
  },
  {
    src: "Simple-CV_Template-724x1024.png",
    alt: "Minimal resume template preview",
  },
  {
    src: "ChatGPT Image May 15, 2026, 12_27_00 PM.png",
    alt: "Accent resume template preview",
  },
];

const Home = () => {
  const [activeResumeIndex, setActiveResumeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveResumeIndex((currentIndex) =>
        (currentIndex + 1) % resumePreviewImages.length
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Home Navbar — theme-aware */}
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 dark:border-white/10 dark:bg-[#030712]/90 backdrop-blur-xl transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-2.5 text-white shadow-md shadow-indigo-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">VabticResume</h2>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">AI Resume Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/user/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3
               bg-gradient-to-r from-purple-700 to-indigo-700
               text-white font-bold text-sm tracking-wide
               shadow-[0_0_25px_rgba(168,85,247,0.4)]
               transition-all duration-500 hover:scale-105 hover:shadow-[0_0_45px_rgba(217,70,239,0.65)]"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 group-hover:left-full" />
              <span className="relative z-10 flex items-center gap-2">
                Sign up
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Page Body — fully theme-aware */}
      <div className="min-h-screen overflow-hidden bg-white dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300">
        {/* Background glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 dark:bg-indigo-600/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-500/10 dark:bg-violet-600/20 blur-3xl" />

        <main className="relative mx-auto max-w-7xl px-6 py-24">
          {/* Hero Section */}
          <section className="text-center">
            <Badge className="bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white ring-indigo-200 dark:ring-white/20 py-6 px-6">
              Future-Ready AI Resume Builder
            </Badge>

            <div className="flex flex-col items-center gap-18 lg:flex-row">
              <div className="flex-1">
                <h1 className="mx-auto mt-8 max-w-4xl leading-tight md:text-6xl text-3xl font-extrabold text-slate-900 dark:text-white">
                  Create resumes that look like they came from the future.
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  Build premium ATS-friendly resumes with modern templates, live
                  preview, AI improvement, and recruiter-focused formatting.
                </p>
              </div>

              {/* Resume carousel */}
              <div className="group relative mt-5 flex h-[430px] w-full max-w-[430px] flex-none items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-purple-500/15 dark:bg-purple-500/30 blur-3xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
                {resumePreviewImages.map((image, index) => {
                  const position =
                    (index - activeResumeIndex + resumePreviewImages.length) %
                    resumePreviewImages.length;
                  const isActive = position === 0;
                  const isNext = position === 1;
                  const isPrevious = position === resumePreviewImages.length - 1;

                  return (
                    <div
                      key={image.src}
                      className={`absolute transition-all duration-[1200ms] ease-in-out ${
                        isActive
                          ? "z-30 scale-100 translate-x-0 opacity-100"
                          : isNext
                          ? "z-20 scale-75 translate-x-36 opacity-35 rotate-[10deg]"
                          : isPrevious
                          ? "z-10 scale-75 -translate-x-36 opacity-35 rotate-[-10deg]"
                          : "z-0 scale-50 translate-x-0 opacity-0"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="animate-floating w-[330px] max-w-[78vw] rounded-3xl object-cover shadow-[0_20px_80px_rgba(168,85,247,0.5)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                <Link to={"/user/register"}>Start Building</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link to="/user/templates">View Template</Link>
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:to-indigo-700 text-white shadow-lg"
              >
                <Link to="/ats-score-checker" className="flex items-center gap-2">
                  <FileSearch size={18} />
                  ATS Score Checker
                </Link>
              </Button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mt-24 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "ATS Optimized",
                text: "Clean formatting designed for applicant tracking systems.",
              },
              {
                icon: Sparkles,
                title: "AI Suggestions",
                text: "Improve summary, skills, and project descriptions instantly.",
              },
              {
                icon: Zap,
                title: "Live Preview",
                text: "Edit details and see your resume update in real time.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border-gray-100 bg-white dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-indigo-50 dark:bg-white/10 p-3 text-indigo-600 dark:text-indigo-300">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
                </Card>
              );
            })}
          </section>

          {/* Premium section */}
          <section className="mt-24 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8 shadow-xl dark:shadow-none dark:backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <Badge className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 ring-indigo-200 dark:ring-indigo-400/30">
                  Premium Experience
                </Badge>
                <h2 className="mt-5 text-4xl font-black text-slate-900 dark:text-white">
                  Designed for students, freshers, developers, and future MAANG engineers.
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Give users a beautiful resume-building journey with responsive
                  forms, animated templates, ATS previews, and PDF-ready layouts.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-100 p-6 text-gray-900 shadow-xl">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <FileText className="text-indigo-600" />
                  <div>
                    <h3 className="font-bold">Software Engineer Resume</h3>
                    <p className="text-sm text-gray-500">ATS Score: 94%</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-3 w-3/4 rounded bg-gray-900" />
                  <div className="h-2 rounded bg-gray-200" />
                  <div className="h-2 rounded bg-gray-200" />
                  <div className="h-2 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <HomeExtraSections />
        <Footer />
      </div>
    </>
  );
};

export default Home;
