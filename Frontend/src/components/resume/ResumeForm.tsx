import { useRef, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


import {
  Check,
  ChevronLeft,
  Download,
  Sparkles,
} from "lucide-react";
import { Button, Card, Input, Select, Textarea } from "../common";
import EducationForm, { type EducationItem } from "./EducationForm";
import ExperienceForm, { type ExperienceItem } from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import ResumePreview from "./ResumePreview";
import { templateMap } from "../../templates";
import type { ResumeData } from "../../templates/resume.types";
import { getTemplateById, templates } from "../../data/template";
import { downloadResumePdf } from "../../utils/downloadResumePdf";



const editorSections = [
  { id: "personal", label: "Personal" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
] as const;

type EditorSectionId = (typeof editorSections)[number]["id"];
type DownloadFormat = "pdf" | "doc"

const downloadOptions = [
  { label: "PDF", value: "pdf" },
  { label: "DOC", value: "doc" },
];

const createWordDocument = (element: HTMLElement, title: string) => {
  const clone = element.cloneNode(true) as HTMLElement;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
      </head>
      <body>${clone.outerHTML}</body>
    </html>
  `;
};







const downloadBlob = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob(["\ufeff", content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getDownloadName = (name: string, format: DownloadFormat) => {

  const cleanName = name
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");

  return `${cleanName || "resume"}.${format}`;
};

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
  const [activeSection, setActiveSection] =
    useState<EditorSectionId>("personal");
  const [completedSections, setCompletedSections] = useState<EditorSectionId[]>(
    []
  );
  const [downloadFormat, setDownloadFormat] =
    useState<DownloadFormat>("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

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

  const activeSectionIndex = editorSections.findIndex(
    (section) => section.id === activeSection
  );
  const isFirstSection = activeSectionIndex === 0;
  const isLastSection = activeSectionIndex === editorSections.length - 1;

  const markSectionComplete = (sectionId: EditorSectionId) => {
    setCompletedSections((current) =>
      current.includes(sectionId) ? current : [...current, sectionId]
    );
  };

  const goToSection = (sectionId: EditorSectionId) => {
    setActiveSection(sectionId);
  };

  const goToNextSection = () => {
    markSectionComplete(activeSection);

    if (!isLastSection) {
      setActiveSection(editorSections[activeSectionIndex + 1].id);
    }
  };

  const goToPreviousSection = () => {
    if (!isFirstSection) {
      setActiveSection(editorSections[activeSectionIndex - 1].id);
    }
  };


  const downloadResume = async () => {

    if (!resumePreviewRef.current) return;

    const fileName = getDownloadName(
      fullName,
      downloadFormat
    );

    setIsDownloading(true);

    try {

      // PDF DOWNLOAD
      if (downloadFormat === "pdf") {
        await downloadResumePdf(resumePreviewRef.current, fileName);
        return;
      }

      // WORD DOWNLOAD
      const documentContent =
        createWordDocument(
          resumePreviewRef.current,
          `${currentTemplate.name} Resume`
        );

      downloadBlob(
        documentContent,
        fileName,
        "application/msword;charset=utf-8"
      );

    } finally {

      setIsDownloading(false);

    }
  };

  const navigate = useNavigate();
  const saveResume = async () => {
    try {
      const token = localStorage.getItem("token");

      const resumeData = {
        title: title || "My Resume",
        personalInfo: {
          fullName,
          title,
          email,
          phone,
          location,
          summary,
        },
        education,
        experience,
        skills,
      };

      const response = await axios.post(
        "http://localhost:3000/api/auth/save-resume",
        resumeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Save resume success:", response.data);
      toast.success("Resume saved successfully in PostgreSQL!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Save resume error:", error);
      toast.error("Failed to save resume. Make sure you are logged in.");
    }
  };

  const sectionFooter = (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
      <Button
        type="button"
        variant="outline"
        onClick={goToPreviousSection}
        disabled={isFirstSection}
        leftIcon={<ChevronLeft size={17} />}
      >
        Back
      </Button>

      <Button
        type="button"
        onClick={async () => {

          if (isLastSection) {

            await saveResume();

          } else {

            goToNextSection();

          }
        }}
      >
        {isLastSection ? "Finish" : "Save & Next"}
      </Button>
    </div>
  );

  const renderActiveSection = () => {
    if (activeSection === "skills") {
      return (
        <SkillsForm
          skills={skills}
          setSkills={setSkills}
          footer={sectionFooter}
        />
      );
    }

    if (activeSection === "education") {
      return (
        <EducationForm
          education={education}
          setEducation={setEducation}
          footer={sectionFooter}
        />
      );
    }

    if (activeSection === "experience") {
      return (
        <ExperienceForm
          experience={experience}
          setExperience={setExperience}
          footer={sectionFooter}
        />
      );
    }

    return (
      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Personal Details
            </h2>
            <p className="text-sm text-gray-500">
              Add the basics that appear at the top of your resume.
            </p>
          </div>

          <Button leftIcon={<Sparkles size={17} />}>AI Improve</Button>
        </div>

        <div className="mb-6">
          <Select
            label="For diffrent  Resume Template"
            value={currentTemplate.id}
            options={templateOptions}
            onChange={(event) => onTemplateChange?.(event.target.value)}
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

        {sectionFooter}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto grid max-w-[1320px] gap-6 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_clamp(350px,50%,850px)]">
        <div className="space-y-6">
          <Card>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Resume Builder
              </h1>
              <p className="text-sm text-gray-500">
                Editing {currentTemplate.name}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {editorSections.map((section, index) => {
                const isActive = section.id === activeSection;
                const isComplete = completedSections.includes(section.id);

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => goToSection(section.id)}
                    className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${isActive
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-gray-50"
                      }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${isComplete
                        ? "bg-indigo-600 text-white"
                        : isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {isComplete ? <Check size={16} /> : index + 1}
                    </span>
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {renderActiveSection()}
        </div>

        <div className="sticky top-6 min-h-screen pb-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Preview
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {currentTemplate.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select
                aria-label="Download format"
                value={downloadFormat}
                options={downloadOptions}
                onChange={(event) =>
                  setDownloadFormat(event.target.value as DownloadFormat)
                }
                className="min-w-24"
              />

              <Button
                type="button"
                leftIcon={<Download size={17} />}
                onClick={downloadResume}
                isLoading={isDownloading}
              >
                Download
              </Button>
            </div>
          </div>

          <ResumePreview ref={resumePreviewRef}>
            <ActiveTemplate key={currentTemplate.id} data={previewData} />
          </ResumePreview>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
