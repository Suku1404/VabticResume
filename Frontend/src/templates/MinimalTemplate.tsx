import type { ResumeData } from "../templates/resume.types";

const MinimalTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-10 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-wide">{data.name}</h1>
        <p className="text-gray-600 mt-1">{data.title}</p>

        <p className="text-sm text-gray-500 mt-2">
          {data.email} · {data.phone} · {data.location}
          {data.linkedin && ` · ${data.linkedin}`}
          {data.github && ` · ${data.github}`}
          {data.portfolio && ` · ${data.portfolio}`}
        </p>
      </header>

      <Section title="Summary">
        {data.summary}
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={index} className="text-sm border px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Education">
        {data.education}
      </Section>

      <Section title="Experience">
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
  <section className="mb-6">
    <h2 className="uppercase text-sm tracking-widest font-semibold mb-2 border-b pb-1">
      {title}
    </h2>
    <div className="text-sm leading-relaxed text-gray-700">{children}</div>
  </section>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index}>• {item}</li>
    ))}
  </ul>
);

export default MinimalTemplate;

























// import type { ResumeData } from "./resume.types";

// interface Props {
//   data: ResumeData;
// }

// const MinimalResume = ({ data }: Props) => {
//   return (
//     <div className="bg-white max-w-2xl mx-auto p-10 min-h-screen shadow-xl">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-light tracking-wide">
//           {data.personalInfo.name}
//         </h1>

//         <p className="mt-2 text-gray-500">
//           {data.personalInfo.email}
//         </p>

//         <p className="text-gray-500">
//           {data.personalInfo.phone}
//         </p>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-xl border-b pb-2 mb-3 font-semibold">
//           Summary
//         </h2>

//         <p>{data.summary}</p>
//       </div>

//       <div>
//         <h2 className="text-xl border-b pb-2 mb-3 font-semibold">
//           Skills
//         </h2>

//         <div className="flex flex-wrap gap-3">
//           {data.skills.map((skill, index) => (
//             <span
//               key={index}
//               className="border px-3 py-1 rounded-full"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MinimalResume;