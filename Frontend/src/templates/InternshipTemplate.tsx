import type { ResumeData } from "../templates/resume.types";

const InternshipTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-sans">
      <header className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p>{data.title}</p>
        <p className="text-sm">{data.email} | {data.phone} | {data.location}</p>
      </header>

      <Section title="Career Objective">{data.summary}</Section>
      <Section title="Skills">{data.skills.join(", ")}</Section>
      <Section title="Education">{data.education}</Section>
      <Section title="Projects"><List items={data.projects} /></Section>
      <Section title="Internship / Training"><List items={data.experience} /></Section>

      {data.certifications && (
        <Section title="Certifications">
          <List items={data.certifications} />
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-5">
    <h2 className="text-lg font-bold uppercase border-b mb-2">{title}</h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default InternshipTemplate;