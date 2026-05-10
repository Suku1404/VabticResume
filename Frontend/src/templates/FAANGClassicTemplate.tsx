import type { ResumeData } from "../templates/resume.types";

const FAANGClassicTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-serif">
      <header className="text-center border-b border-black pb-3">
        <h1 className="text-3xl font-bold uppercase">{data.name}</h1>
        <p className="text-sm">{data.title}</p>
        <p className="text-xs mt-1">
          {data.email} | {data.phone} | {data.location}
          {data.linkedin && ` | ${data.linkedin}`}
          {data.github && ` | ${data.github}`}
          {data.portfolio && ` | ${data.portfolio}`}
        </p>
      </header>

      <Section title="Summary">{data.summary}</Section>
      <Section title="Technical Skills">{data.skills.join(", ")}</Section>
      <Section title="Education">{data.education}</Section>
      <Section title="Experience"><List items={data.experience} /></Section>
      <Section title="Projects"><List items={data.projects} /></Section>

      {data.achievements && (
        <Section title="Achievements">
          <List items={data.achievements} />
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-4">
    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">
      {title}
    </h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default FAANGClassicTemplate;