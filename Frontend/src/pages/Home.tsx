import { ArrowRight, FileText, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button, Badge, Card } from "../components/common";

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

      <main className="relative mx-auto max-w-7xl px-6 py-24">
        <section className="text-center">
          <Badge className="bg-white/10 text-white ring-white/20">
            Future-Ready AI Resume Builder
          </Badge>

          <h1 className="mx-auto mt-8 max-w-5xl text-6xl font-black leading-tight md:text-7xl">
            Create resumes that look like they came from the future.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Build premium ATS-friendly resumes with modern templates, live preview,
            AI improvement, and recruiter-focused formatting.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" rightIcon={<ArrowRight size={18} />}>
              Start Building
            </Button>

            <Button size="lg" variant="outline">
              View Templates
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
                Designed for students, freshers, developers, and future MAANG engineers.
              </h2>

              <p className="mt-4 text-gray-300">
                Give users a beautiful resume-building journey with responsive forms,
                animated templates, ATS previews, and PDF-ready layouts.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-2xl">
              <div className="flex items-center gap-3 border-b pb-4">
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
    </div>
  );
};

export default Home;