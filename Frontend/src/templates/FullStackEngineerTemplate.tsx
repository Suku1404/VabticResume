import type { ResumeData } from "../templates/resume.types";

const FullStackEngineerTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white text-black grid grid-cols-3 font-sans">
      <aside className="col-span-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-sm mt-1">{data.title}</p>

        <div className="mt-5 text-sm space-y-1">
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.location}</p>
          <p>{data.github}</p>
          <p>{data.linkedin}</p>
        </div>

        <section className="mt-6">
          <h2 className="font-bold border-b">Skills</h2>
          <ul className="mt-2 text-sm space-y-1">
            {data.skills.map((skill, i) => <li key={i}>• {skill}</li>)}
          </ul>
        </section>
      </aside>

      <main className="col-span-2 p-8">
        <Section title="Profile">{data.summary}</Section>
        <Section title="Experience"><List items={data.experience} /></Section>
        <Section title="Projects"><List items={data.projects} /></Section>
        <Section title="Education">{data.education}</Section>
      </main>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-6">
    <h2 className="text-xl font-bold border-b mb-2">{title}</h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default FullStackEngineerTemplate;