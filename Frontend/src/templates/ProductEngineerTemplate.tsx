import type { ResumeData } from "../templates/resume.types";

const ProductEngineerTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8 font-sans">
      <header className="border-l-4 border-gray-900 pl-4">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-lg text-gray-700">{data.title}</p>
        <p className="text-sm mt-1">
          {data.email} | {data.phone} | {data.location}
        </p>
      </header>

      <Section title="Product Engineering Profile">
        {data.summary}
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Impact Experience">
        <List items={data.experience} />
      </Section>

      <Section title="Product Projects">
        <List items={data.projects} />
      </Section>

      <Section title="Education">{data.education}</Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-6">
    <h2 className="text-lg font-bold border-b mb-2">{title}</h2>
    <div className="text-sm leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-5 space-y-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

export default ProductEngineerTemplate;