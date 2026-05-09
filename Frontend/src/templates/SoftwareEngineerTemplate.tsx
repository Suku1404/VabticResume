import type { ResumeData } from "../templates/resume.types";

const SoftwareEngineerTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-sans">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-lg">{data.title}</p>
        <p className="text-sm mt-1">
          {data.email} | {data.phone} | {data.location}
        </p>
        <p className="text-sm">
          {data.linkedin} {data.github && `| ${data.github}`}{" "}
          {data.portfolio && `| ${data.portfolio}`}
        </p>
      </header>

      <Section title="Summary">
        <p>{data.summary}</p>
      </Section>

      <Section title="Technical Skills">
        <p>{data.skills.join(", ")}</p>
      </Section>

      <Section title="Education">
        <p>{data.education}</p>
      </Section>

      <Section title="Experience">
        <List items={data.experience} />
      </Section>

      <Section title="Projects">
        <List items={data.projects} />
      </Section>
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
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export default SoftwareEngineerTemplate;