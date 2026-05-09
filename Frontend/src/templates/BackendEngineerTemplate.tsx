import type { ResumeData } from "../templates/resume.types";

const BackendEngineerTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-sans">
      <header className="text-center border-b-2 border-black pb-3">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="font-medium">{data.title}</p>
        <p className="text-sm">{data.email} | {data.phone} | {data.location}</p>
      </header>

      <section className="mt-5">
        <h2 className="font-bold uppercase border-b">Backend Profile</h2>
        <p className="text-sm mt-2">{data.summary}</p>
      </section>

      <section className="mt-5">
        <h2 className="font-bold uppercase border-b">Backend Skills</h2>
        <p className="text-sm mt-2">{data.skills.join(" • ")}</p>
      </section>

      <section className="mt-5">
        <h2 className="font-bold uppercase border-b">Experience</h2>
        <ul className="list-disc ml-5 text-sm mt-2">
          {data.experience.map((exp, i) => <li key={i}>{exp}</li>)}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="font-bold uppercase border-b">Backend Projects</h2>
        <ul className="list-disc ml-5 text-sm mt-2">
          {data.projects.map((project, i) => <li key={i}>{project}</li>)}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="font-bold uppercase border-b">Education</h2>
        <p className="text-sm mt-2">{data.education}</p>
      </section>
    </div>
  );
};

export default BackendEngineerTemplate;