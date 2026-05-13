import { useState } from "react";
import { Download, Sparkles } from "lucide-react";
import { Button, Card, Input, Select, Textarea } from "../common";
import EducationForm, { type EducationItem } from "./EducationForm";
import ExperienceForm, { type ExperienceItem } from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import { templateMap } from "../../templates";
import type { ResumeData } from "../../templates/resume.types";
import { getTemplateById, templates } from "../../data/template";

const ResumeForm = ({
  selectedTemplate,
  onTemplateChange,
}: {
  selectedTemplate: string;
  onTemplateChange?: (templateId: string) => void;
}) => {
  const currentTemplate = getTemplateById(selectedTemplate);
  const templateOptions = templates.map((template) => ({
    label: template.name,
    value: template.id,
  }));

  const [fullName, setFullName] = useState("john doe");
  const [title, setTitle] = useState("MERN Stack Developer");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+91 987656536565");
  const [location, setLocation] = useState("India");
  const [summary, setSummary] = useState(
    "Final-year B.Tech CSE student and MERN Stack Developer with hands-on experience building scalable full-stack applications using React.js, Node.js, Express.js, MongoDB, and Java."
  );

  const [skills, setSkills] = useState<string[]>([
    "React.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Java",
  ]);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      degree: "B.Tech Computer Science Engineering",
      institute: "Rawal Institute of Engineering and Technology",
      location: "Faridabad, India",
      startYear: "2022",
      endYear: "2026",
      description:
        "Focused on software engineering, data structures, DBMS, computer networks, and web development.",
    },
  ]);

  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      role: "MERN Stack Developer Intern",
      company: "Khuban Software Development",
      location: "India",
      startDate: "2026",
      endDate: "Present",
      description:
        "Built responsive frontend components, integrated REST APIs, debugged backend services, and worked on production-style MERN applications.",
    },
  ]);

  const [projects] = useState<string[]>([
    "Resume Builder",
    "Food Reel App",
  ]);

  const educationSummary = education
    .map((item) =>
      [
        item.degree,
        item.institute,
        item.location,
        [item.startYear, item.endYear].filter(Boolean).join(" - "),
        item.description,
      ]
        .filter(Boolean)
        .join(", ")
    )
    .join("\n");

  const experienceSummary = experience.map((item) =>
    [
      [item.role, item.company].filter(Boolean).join(" at "),
      item.location,
      [item.startDate, item.endDate].filter(Boolean).join(" - "),
      item.description,
    ]
      .filter(Boolean)
      .join(", ")
  );

  const previewData: ResumeData = {
    name: fullName,
    title,
    email,
    phone,
    location,
    summary,
    skills,
    education: educationSummary,
    experience: experienceSummary,
    projects,
  };

  const ActiveTemplate =
    templateMap[currentTemplate.id] ?? templateMap.ats;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resume Builder
                </h1>
                <p className="text-sm text-gray-500">
                  Editing {currentTemplate.name}.
                </p>
              </div>

              <Button leftIcon={<Sparkles size={17} />}>AI Improve</Button>
            </div>

            <div className="mb-6">
              <Select
                label="Resume Template"
                value={currentTemplate.id}
                options={templateOptions}
                onChange={(event) =>
                  onTemplateChange?.(event.target.value)
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Professional Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="md:col-span-2">
                <Input
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Professional Summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <SkillsForm skills={skills} setSkills={setSkills} />

          <EducationForm education={education} setEducation={setEducation} />

          <ExperienceForm
            experience={experience}
            setExperience={setExperience}
          />
        </div>

        <div className="sticky top-6 h-fit">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Preview
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {currentTemplate.name}
              </p>
            </div>

            <Button leftIcon={<Download size={17} />}>Download PDF</Button>
          </div>

          <ActiveTemplate key={currentTemplate.id} data={previewData} />
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
