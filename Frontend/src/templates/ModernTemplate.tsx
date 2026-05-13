// import type { ResumeData } from "../templates/resume.types";

// const ModernTemplate = ({ data }: { data: ResumeData }) => {
//   return (
//     <div className="max-w-5xl mx-auto bg-white text-gray-900 shadow-lg grid grid-cols-3 font-sans">
//       <aside className="bg-gray-900 text-white p-8 col-span-1">
//         <h1 className="text-3xl font-bold">{data.name}</h1>
//         <p className="text-gray-300 mt-2">{data.title}</p>

//         <div className="mt-8 text-sm space-y-2">
//           <p>{data.email}</p>
//           <p>{data.phone}</p>
//           <p>{data.location}</p>
//           {data.linkedin && <p>{data.linkedin}</p>}
//           {data.github && <p>{data.github}</p>}
//           {data.portfolio && <p>{data.portfolio}</p>}
//         </div>

//         <section className="mt-8">
//           <h2 className="text-lg font-semibold border-b border-gray-600 pb-1">
//             Skills
//           </h2>

//           <div className="mt-3 flex flex-wrap gap-2">
//             {data.skills.map((skill, index) => (
//               <span
//                 key={index}
//                 className="bg-gray-700 text-xs px-3 py-1 rounded-full"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </section>

//         {data.certifications && (
//           <section className="mt-8">
//             <h2 className="text-lg font-semibold border-b border-gray-600 pb-1">
//               Certifications
//             </h2>

//             <ul className="mt-3 text-sm space-y-2">
//               {data.certifications.map((item, index) => (
//                 <li key={index}>• {item}</li>
//               ))}
//             </ul>
//           </section>
//         )}
//       </aside>

//       <main className="col-span-2 p-8">
//         <Section title="Profile">
//           {data.summary}
//         </Section>

//         <Section title="Education">
//           {data.education}
//         </Section>

//         <Section title="Experience">
//           <List items={data.experience} />
//         </Section>

//         <Section title="Projects">
//           <List items={data.projects} />
//         </Section>

//         {data.achievements && (
//           <Section title="Achievements">
//             <List items={data.achievements} />
//           </Section>
//         )}
//       </main>
//     </div>
//   );
// };

// const Section = ({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <section className="mb-7">
//     <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
//       {title}
//     </h2>
//     <div className="mt-3 text-sm leading-relaxed text-gray-700">{children}</div>
//   </section>
// );

// const List = ({ items }: { items: string[] }) => (
//   <ul className="list-disc ml-5 space-y-2">
//     {items.map((item, index) => (
//       <li key={index}>{item}</li>
//     ))}
//   </ul>
// );

// export default ModernTemplate;



















import type { ResumeData } from "./resume.types";

interface Props {
  data: ResumeData;
}

const ModernResume = ({ data }: Props) => {
  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-white shadow-xl grid grid-cols-3 overflow-hidden">
      <div className="bg-purple-700 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">
          {data.personalInfo.name}
        </h1>

        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">
            Skills
          </h2>

          <ul className="space-y-2">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-span-2 p-8">
        <h2 className="text-2xl font-bold mb-3">
          Professional Summary
        </h2>

        <p className="text-gray-700 leading-7">
          {data.summary}
        </p>
      </div>
    </div>
  );
};

export default ModernResume;