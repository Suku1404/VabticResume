import type { ResumeData } from "../templates/resume.types";

const JavaDeveloperTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-serif">
      <header className="border-b-2 border-black pb-3">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p>{data.title}</p>
        <p className="text-sm">{data.email} | {data.phone} | {data.location}</p>
      </header>

      <Section title="Java Developer Summary">{data.summary}</Section>
      <Section title="Core Technical Skills">{data.skills.join(", ")}</Section>
      <Section title="Professional Experience"><List items={data.experience} /></Section>
      <Section title="Java / Backend Projects"><List items={data.projects} /></Section>
      <Section title="Education">{data.education}</Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-5">
    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">{title}</h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default JavaDeveloperTemplate;