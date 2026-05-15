

import type { ResumeData } from "../templates/resume.types";

const ATSResume = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-sans">
      <header className="text-center border-b border-black pb-3">
        <h1 className="text-3xl font-bold uppercase">{data.name}</h1>
        <p className="text-sm mt-1">{data.title}</p>

        <p className="text-xs mt-2">
          {data.email} | {data.phone} | {data.location}
          {data.linkedin && ` | ${data.linkedin}`}
          {data.github && ` | ${data.github}`}
          {data.portfolio && ` | ${data.portfolio}`}
        </p>
      </header>

      <Section title="Professional Summary">
        {data.summary}
      </Section>

      <Section title="Technical Skills">
        {data.skills.join(", ")}
      </Section>

      <Section title="Education">
        {data.education}
      </Section>

      <Section title="experience">
        <List items={data.experience} />
      </Section>

      <Section title="Projects">
        <List items={data.projects} />
      </Section>

      {data.certifications && (
        <Section title="Certifications">
          <List items={data.certifications} />
        </Section>
      )}

      {data.achievements && (
        <Section title="Achievements">
          <List items={data.achievements} />
        </Section>
      )}
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-4">
    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">
      {title}
    </h2>
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

export default ATSResume;
