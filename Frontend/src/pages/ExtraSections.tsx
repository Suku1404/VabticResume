import {
  ArrowRight,
  Brain,
  CheckCircle,
  Download,
  Gauge,
  HelpCircle,
  LayoutTemplate,
  Rocket,
  Star,
  Wand2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HomeExtraSections = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/user/profile", {
          credentials: "include",
        });
        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const templates = [
    { name: "ATS Resume", templateId: "ats", image:"/images/ChatGPT Image May 15, 2026, 02_59_43 PM.png" },

    { name: "Frontend Engineer", templateId: "frontend", image:"/images/ChatGPT Image May 15, 2026, 03_17_08 PM.png" },

    { name: "Modern Template", templateId: "modern", image:"/images/ChatGPT Image May 15, 2026, 03_19_58 PM.png" },

    { name: "Minimal Resume", templateId: "minimal", image:"/images/ChatGPT Image May 15, 2026, 03_28_50 PM.png" },

    { name: "Backend Engineer", templateId: "backend", image:"/images/ChatGPT Image May 15, 2026, 03_47_57 PM.png" },

    { name: "Full Stack Engineer", templateId: "fullstack", image:"/images/ChatGPT Image May 15, 2026, 03_23_53 PM.png" },
  ];

  const handleTemplateClick = (templateId: string) => {
    if (!isLoggedIn) {
      // Store the template ID and redirect to register
      localStorage.setItem("redirectTemplate", templateId);
      navigate("/user/register");
    } else {
      // If logged in, go directly to builder
      navigate(`/builder/${templateId}`);
    }
  };

  return (
    <div className="bg-[#030712] px-6 pb-24 text-white">
      <div className="mx-auto max-w-7xl space-y-24">

        {/* Templates Showcase */}
        <section>
          <div className="text-center">
            <p className="text-xl font-semibold text-purple-300">
              Resume Templates
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Choose Templates Built for Modern Hiring
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Select ATS-friendly, recruiter-focused templates designed for
              freshers, developers, and future MAANG engineers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.templateId}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/50 hover:bg-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="mb-5 flex h-36 items-center justify-center rounded-2xl bg-white text-gray-900 transition duration-500 group-hover:scale-105">
                  <img
                  src={template.image}
                  alt={template.name} 
                  className="h-full w-full rounded-xl object-cover object-top" />
                </div>

                <h3 className="text-xl font-bold">{template.name}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Clean, professional, and optimized for applicant tracking
                  systems.
                </p>

                <button
                  onClick={() => handleTemplateClick(template.templateId)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-300 transition duration-300 hover:gap-3 hover:text-white cursor-pointer"
                >
                  Use Template <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center">
            <p className="text-sm font-semibold text-purple-300">
              Simple Process
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Build Your Resume in 3 Simple Steps
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: LayoutTemplate,
                title: "Choose Template",
                text: "Pick a professional resume template that matches your role.",
              },
              {
                icon: Wand2,
                title: "Add & Improve Details",
                text: "Fill your details and improve content using AI suggestions.",
              },
              {
                icon: Download,
                title: "Download Resume",
                text: "Export your resume as a clean ATS-friendly PDF.",
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                  <span className="absolute right-6 top-6 text-5xl font-black text-white/5">
                    0{index + 1}
                  </span>

                  <div className="mb-6 inline-flex rounded-2xl bg-purple-500/20 p-4 text-purple-300">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Features */}
        <section className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold text-purple-300">
                AI Powered
              </p>
              <h2 className="mt-3 text-4xl font-black">
                AI That Helps You Get Shortlisted Faster
              </h2>
              <p className="mt-4 text-gray-400">
                Improve weak resume sections, detect missing keywords, and make
                your profile more recruiter-friendly.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "AI Summary Generator",
                  "Skill Suggestions",
                  "Project Enhancement",
                  "ATS Keyword Detection",
                  "Resume Score Analysis",
                  "Recruiter Optimization",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#030712]/60 p-4 transition duration-300 hover:border-purple-400/50 hover:bg-purple-500/10"
                  >
                    <CheckCircle size={18} className="text-purple-300" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-400/20 bg-[#080b1a] p-8 shadow-2xl shadow-purple-500/20">
              <div className="mb-6 inline-flex rounded-2xl bg-purple-500/20 p-4 text-purple-300">
                <Brain size={36} />
              </div>

              <h3 className="text-2xl font-bold">AI Resume Assistant</h3>
              <p className="mt-3 text-gray-400">
                “Your project descriptions are good, but adding measurable
                impact can improve recruiter attention.”
              </p>

              <button className="mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold transition duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30">
                Improve With AI
              </button>
            </div>
          </div>
        </section>

        {/* ATS Demo */}
        <section>
          <div className="text-center">
            <p className="text-sm font-semibold text-purple-300">ATS Demo</p>
            <h2 className="mt-3 text-4xl font-black">
              See Your Resume Score Improve
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <ScoreCard title="Before Optimization" score="42%" width="w-[42%]" />
            <ScoreCard title="After AI Optimization" score="91%" width="w-[91%]" active />
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-6 md:grid-cols-3">
          {[
            ["10K+", "Resumes Created"],
            ["92%", "ATS Accuracy"],
            ["5K+", "Developers Joined"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center transition duration-500 hover:-translate-y-2 hover:bg-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <h3 className="text-5xl font-black text-purple-300">{number}</h3>
              <p className="mt-3 text-gray-400">{label}</p>
            </div>
          ))}
        </section>

        {/* Testimonials */}
        <section>
          <div className="text-center">
            <p className="text-sm font-semibold text-purple-300">
              Testimonials
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Trusted by Students and Developers
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              "This resume builder helped me improve my ATS score from 54% to 89%.",
              "The AI suggestions made my project descriptions much stronger.",
              "Perfect for freshers who want a modern and professional resume.",
            ].map((review, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-500 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="mb-4 flex gap-1 text-yellow-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="text-sm leading-6 text-gray-300">“{review}”</p>
                <p className="mt-5 font-semibold text-purple-300">
                  Student Developer
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center">
            <p className="text-sm font-semibold text-purple-300">FAQ</p>
            <h2 className="mt-3 text-4xl font-black">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {[
              {
                q: "What is ATS?",
                a: "ATS stands for Applicant Tracking System. Companies use it to scan resumes before recruiters review them.",
              },
              {
                q: "Can I download my resume as PDF?",
                a: "Yes, users can download their resume in a clean PDF-ready format.",
              },
              {
                q: "Does AI improve my resume?",
                a: "Yes, AI can improve summary, skills, projects, keywords, and recruiter-friendly wording.",
              },
              {
                q: "Is this useful for freshers?",
                a: "Yes, it is specially designed for students, freshers, interns, and developers.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 open:bg-purple-500/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-purple-300" />
                    {item.q}
                  </span>
                  <span className="transition duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-sm leading-6 text-gray-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-r from-purple-700/30 via-indigo-700/30 to-violet-700/30 p-10 text-center shadow-2xl shadow-purple-500/20">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-purple-200">
              <Rocket size={34} />
            </div>

            <h2 className="text-4xl font-black">
              Ready to Build Your Dream Resume?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Create a modern, ATS-friendly resume that helps you stand out in
              front of recruiters.
            </p>

            <Link
              to="/user/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-gray-950 transition duration-500 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
            >
              Start Building Now <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

const ScoreCard = ({
  title,
  score,
  width,
  active = false,
}: {
  title: string;
  score: string;
  width: string;
  active?: boolean;
}) => {
  return (
    <div
      className={`rounded-3xl border p-8 transition duration-500 hover:-translate-y-2 ${
        active
          ? "border-purple-400/50 bg-purple-500/10 shadow-xl shadow-purple-500/20"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="mb-6 flex items-center gap-3">
        <Gauge className={active ? "text-purple-300" : "text-gray-400"} />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <p className="text-5xl font-black">{score}</p>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            active
              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
              : "bg-gray-500"
          } ${width}`}
        />
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {active
          ? "Optimized with AI suggestions, better keywords, and strong formatting."
          : "Missing keywords, weak summary, and low recruiter readability."}
      </p>
    </div>
  );
};

export default HomeExtraSections;
