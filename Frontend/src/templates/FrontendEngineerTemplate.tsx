import type { ResumeData } from "../templates/resume.types";

const FrontendEngineerTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8 font-sans">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">{data.name}</h1>
        <p className="text-xl text-gray-600">{data.title}</p>
        <p className="text-sm mt-2">
          {data.email} · {data.phone} · {data.location}
        </p>
      </header>

      <Section title="Frontend Summary">
        {data.summary}
      </Section>

      <Section title="Frontend Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <span key={i} className="border px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <ul className="space-y-2">
          {data.projects.map((project, i) => (
            <li key={i}>• {project}</li>
          ))}
        </ul>
      </Section>

      <Section title="Experience">
        <ul className="space-y-2">
          {data.experience.map((exp, i) => (
            <li key={i}>• {exp}</li>
          ))}
        </ul>
      </Section>

      <Section title="Education">{data.education}</Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h2 className="text-lg font-semibold uppercase tracking-wide border-b mb-2">
      {title}
    </h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

export default FrontendEngineerTemplate;