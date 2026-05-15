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
      <nav>
        <div className="flex justify-between px-6 py-5 ">
          <div>
            <p className="">logo</p>
          </div>
          <div>
            <p>
              <Link
                to="/user/register"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-8 py-4
                 bg-linear-to-r from-purple-900 to-indigo-900
                 text-white font-bold text-lg tracking-wide
                 shadow-[0_0_35px_rgba(168,85,247,0.55)]
                 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_55px_rgba(217,70,239,0.75)]"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="absolute -left-full top-0 h-full w-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 group-hover:left-full" />

                <span className="relative z-10 flex items-center gap-2">
                  Sign up
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </p>
          </div>
        </div>
      </nav>

      <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

        <main className="relative mx-auto max-w-7xl px-6 py-24">
          <section className="text-center">
            <Badge className="bg-white/10 text-white ring-white/20 py-6 px-6">
              Future-Ready AI Resume Builder
            </Badge>

            <div className="flex flex-col items-center gap-18 lg:flex-row">
              <div className="flex-1">
                <h1 className="mx-auto mt-8 max-w-4xl leading-tight md:text-6xl text-3xl font-extrabold rounded-2xl backdrop-blur-xl ">
                  Create resumes that look like they came from the future.
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
                  Build premium ATS-friendly resumes with modern templates, live
                  preview, AI improvement, and recruiter-focused formatting.
                </p>
              </div>
              <div className="group relative mt-5 flex h-[430px] w-full max-w-[430px] flex-none items-center justify-center">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-purple-500/30 blur-3xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse">
                </div>

                {resumePreviewImages.map((image, index) => {
                  const position =
                    (index - activeResumeIndex + resumePreviewImages.length) %
                    resumePreviewImages.length;
                  const isActive = position === 0;
                  const isNext = position === 1;
                  const isPrevious =
                    position === resumePreviewImages.length - 1;

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
                        className="animate-floating w-[330px] max-w-[78vw] rounded-3xl object-cover shadow-[0_20px_80px_rgba(168,85,247,0.6)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              {/* new resume */}
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                <Link to={"/user/register"}>Start Building</Link>
              </Button>
              {/* templates */}
              <Button size="lg" variant="outline">
                <Link to="/user/templates">View Template</Link>
              </Button>
              {/* Ats scorer */}
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500-700 to-indigo-600 hover:to-indigo-700 text-white shadow-lg"
              >
                <Link
                  to="/ats-score-checker"
                  className="flex items-center gap-2"
                >
                  <FileSearch size={18} />
                  ATS Score Checker
                </Link>
              </Button>
            </div>
          </section>

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
                  className="border-white/10 bg-white/5 text-white backdrop-blur-xl"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-white/10 p-3 text-indigo-300">
                    <Icon size={26} />
                  </div>

                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm text-gray-300">{item.text}</p>
                </Card>
              );
            })}
          </section>

          <section className="mt-24 rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <Badge className="bg-indigo-500/20 text-indigo-200 ring-indigo-400/30">
                  Premium Experience
                </Badge>

                <h2 className="mt-5 text-4xl font-black">
                  Designed for students, freshers, developers, and future MAANG
                  engineers.
                </h2>

                <p className="mt-4 text-gray-300">
                  Give users a beautiful resume-building journey with responsive
                  forms, animated templates, ATS previews, and PDF-ready
                  layouts.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-3xl">
                <div className="flex items-center gap-3 border-b pb-4">
                  <FileText className="text-indigo-600 " />
                  <div>
                    <h3 className="font-bold">Software Engineer Resume</h3>
                    <p className="text-sm text-gray-500">ATS Score: 94%</p>
                  </div>
                </div>
                {/*  */}
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

        {/* your dashboard content */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
