import type { ResumeData } from "../templates/resume.types";

const TechnicalResumeTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-mono">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p>{data.title}</p>
        <p className="text-xs">{data.email} | {data.phone} | {data.location}</p>
      </header>

      <Section title="TECHNICAL SUMMARY">{data.summary}</Section>
      <Section title="TECH STACK">{data.skills.join(" / ")}</Section>
      <Section title="ENGINEERING EXPERIENCE"><List items={data.experience} /></Section>
      <Section title="PROJECT WORK"><List items={data.projects} /></Section>
      <Section title="EDUCATION">{data.education}</Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-5">
    <h2 className="text-sm font-bold border-b mb-2">{title}</h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default TechnicalResumeTemplate;