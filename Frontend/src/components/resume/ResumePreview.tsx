import { Mail, MapPin, Phone } from "lucide-react";
import type { EducationItem } from "./EducationForm";
import type { ExperienceItem } from "./ExperienceForm";
import { forwardRef } from "react";


export type ResumePreviewData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
};

type ResumePreviewProps = {
  data: ResumePreviewData;
};

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full min-h-full bg-white text-gray-900"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
        }}
      >
        <header className="border-b border-gray-200 pb-5 text-center">
          <h1 className="text-4xl font-bold">{data.fullName || "Your Name"}</h1>
          <p className="mt-1 text-lg text-indigo-600">
            {data.title || "Software Developer"}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Mail size={15} /> {data.email || "email@example.com"}
            </span>

            <span className="flex items-center gap-1">
              <Phone size={15} /> {data.phone || "+91 XXXXX XXXXX"}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={15} /> {data.location || "India"}
            </span>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {data.summary ||
              "Final-year B.Tech CSE student skilled in modern full-stack development, scalable backend systems, and production-ready frontend applications."}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Skills
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {(data.skills.length ? data.skills : ["React.js", "Node.js", "MongoDB"]).map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Experience
          </h2>

          <div className="mt-3 space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold">{exp.role || "Developer Intern"}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>

                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Education
          </h2>

          <div className="mt-3 space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {edu.institute} {edu.location && `• ${edu.location}`}
                </p>

                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
);
export default ResumePreview;