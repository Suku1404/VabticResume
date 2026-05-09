import type { ResumeData } from "../templates/resume.types";

const MERNDeveloperTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8 font-sans">
      <header className="text-center">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-lg">{data.title}</p>
        <p className="text-sm mt-1">
          {data.email} | {data.phone} | {data.location}
        </p>
      </header>

      <div className="h-1 bg-gray-900 my-4" />

      <Section title="MERN Stack Profile">{data.summary}</Section>
      <Section title="MERN Skills">{data.skills.join(" | ")}</Section>
      <Section title="Internship / Experience"><List items={data.experience} /></Section>
      <Section title="MERN Projects"><List items={data.projects} /></Section>
      <Section title="Education">{data.education}</Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h2 className="text-lg font-bold uppercase border-b mb-2">{title}</h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default MERNDeveloperTemplate;