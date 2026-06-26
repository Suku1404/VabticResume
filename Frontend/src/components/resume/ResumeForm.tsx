import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Check,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  History,
  FileDown,
  Eye,
  Settings,
  Clock,
  Upload
} from "lucide-react";
import { Button, Card, Input, Select, Textarea, Badge, Modal } from "../common";
import EducationForm, { type EducationItem } from "./EducationForm";
import ExperienceForm, { type ExperienceItem } from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import ResumePreview from "./ResumePreview";
import { templateMap } from "../../templates";
import { getTemplateById, templates } from "../../data/template";

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

const editorSections = [
  { id: "personal", label: "Personal" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
] as const;

type EditorSectionId = (typeof editorSections)[number]["id"];
type DownloadFormat = "pdf" | "docx" | "txt" | "json";

const ResumeForm = ({
  selectedTemplate,
  resumeId: initialResumeId,
  onTemplateChange,
}: {
  selectedTemplate: string;
  resumeId?: string;
  onTemplateChange?: (templateId: string) => void;
}) => {
  const navigate = useNavigate();
  const currentTemplate = getTemplateById(selectedTemplate);
  const templateOptions = templates.map((template) => ({
    label: template.name,
    value: template.id,
  }));

  // Editor states
  const [activeSection, setActiveSection] = useState<EditorSectionId>("personal");
  const [completedSections, setCompletedSections] = useState<EditorSectionId[]>([]);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  // Resume Document states
  const [resumeId, setResumeId] = useState<string | undefined>(initialResumeId);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  // Auto-Save and Load states
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // AI Improve states
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiJobRole, setAiJobRole] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [aiError, setAiError] = useState("");

  // Version history states
  const [versions, setVersions] = useState<any[]>([]);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [previewingVersion, setPreviewingVersion] = useState<any>(null);

  // Advanced Export settings
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<DownloadFormat>("pdf");
  const [exportFontSize, setExportFontSize] = useState("md"); // sm, md, lg
  const [exportPaperSize, setExportPaperSize] = useState("a4"); // a4, letter
  const [exportColorMode, setExportColorMode] = useState("color"); // color, bw
  const [exportLayoutMode, setExportLayoutMode] = useState("multi"); // single, multi

  const [parsingFile, setParsingFile] = useState(false);

  const handleResumeImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/resumes/upload-parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.success && response.data.parsedResume) {
        const parsed = response.data.parsedResume;
        setFullName(parsed.personalInfo?.fullName || "");
        setTitle(parsed.personalInfo?.title || "");
        setEmail(parsed.personalInfo?.email || "");
        setPhone(parsed.personalInfo?.phone || "");
        setLocation(parsed.personalInfo?.location || "");
        setSummary(parsed.personalInfo?.summary || "");
        setSkills(parsed.skills || []);
        setEducation(parsed.education || []);
        setExperience(parsed.experience || []);
        setProjects(parsed.projects || []);

        toast.success(`Imported details from resume "${response.data.fileName || file.name}"`);
      } else {
        toast.error("Failed to parse resume details.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload and parse resume.");
    } finally {
      setParsingFile(false);
    }
  };

  // Fetch and Load user resume
  const fetchResumeData = async () => {
    if (!resumeId) {
      setResumeTitle("My Resume");
      setFullName("John Doe");
      setTitle("Software Engineer");
      setEmail("john@example.com");
      setPhone("+91 9876543210");
      setLocation("India");
      setSummary("Ambitious engineer ready to build scalable services.");
      setSkills(["JavaScript", "TypeScript", "React", "Node.js"]);
      setEducation([
        {
          degree: "Bachelor of Technology in CSE",
          institute: "RIET Faridabad",
          location: "Haryana, India",
          startYear: "2022",
          endYear: "2026",
          description: "Data Structures, OOPs, Web Development."
        }
      ]);
      setExperience([
        {
          role: "Software Intern",
          company: "Khuban Tech",
          location: "Remote",
          startDate: "2025",
          endDate: "Present",
          description: "Working on full-stack Javascript projects."
        }
      ]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/resumes/${resumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      setResumeTitle(data.title || "My Resume");
      
      const payload = data.resume_data || {};
      setFullName(payload.personalInfo?.fullName || "");
      setTitle(payload.personalInfo?.title || "");
      setEmail(payload.personalInfo?.email || "");
      setPhone(payload.personalInfo?.phone || "");
      setLocation(payload.personalInfo?.location || "");
      setSummary(payload.personalInfo?.summary || "");
      setSkills(payload.skills || []);
      setEducation(payload.education || []);
      setExperience(payload.experience || []);
      setProjects(payload.projects || []);
      
      // Fetch version history list
      const versionsRes = await axios.get(
        `http://localhost:3000/api/resumes/${resumeId}/versions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVersions(versionsRes.data);

      setTimeout(() => setIsDirty(false), 200);
    } catch (err) {
      console.error("Failed to load resume:", err);
      toast.error("Failed to load resume profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [resumeId]);

  // Handle unload events (prompt users if unsaved work exists)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Set dirty state on edit changes
  useEffect(() => {
    if (fullName || title || email) {
      setIsDirty(true);
    }
  }, [fullName, title, email, phone, location, summary, skills, education, experience, resumeTitle, selectedTemplate]);

  // Save changes handler
  const saveResume = async (isManual = false) => {
    setIsAutoSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: resumeTitle,
        template: selectedTemplate,
        status: "Draft",
        isAutoSave: !isManual, // True skips version history backups
        personalInfo: {
          fullName,
          title,
          email,
          phone,
          location,
          summary
        },
        education,
        experience,
        skills,
        projects
      };

      if (resumeId) {
        await axios.put(
          `http://localhost:3000/api/resumes/${resumeId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (isManual) {
          toast.success("Resume saved successfully!");
          // Re-fetch versions to include the new one
          const versionsRes = await axios.get(
            `http://localhost:3000/api/resumes/${resumeId}/versions`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setVersions(versionsRes.data);
        }
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/resumes",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newResume = response.data;
        setResumeId(newResume.id.toString());
        navigate(`/builder/${selectedTemplate}/${newResume.id}`, { replace: true });
        if (isManual) toast.success("New resume profile created!");
      }

      setIsDirty(false);
    } catch (err) {
      console.error("Save error:", err);
      if (isManual) toast.error("Failed to save resume progress.");
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Auto-Save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) {
        saveResume(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isDirty, fullName, title, email, phone, location, summary, skills, education, experience, resumeTitle, selectedTemplate]);

  // Section switch save
  const handleSectionSwitch = (nextSection: EditorSectionId) => {
    if (isDirty) {
      saveResume(false);
    }
    setActiveSection(nextSection);
  };

  // Restore previous version
  const handleRestoreVersion = async (versionId: number, versionNum: number) => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/api/resumes/${resumeId}/versions/${versionId}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Successfully restored Version ${versionNum}!`);
      setPreviewingVersion(null);
      setIsVersionsOpen(false);
      
      // Update variables
      const data = res.data;
      setResumeTitle(data.title || "My Resume");
      const payload = data.resume_data || {};
      setFullName(payload.personalInfo?.fullName || "");
      setTitle(payload.personalInfo?.title || "");
      setEmail(payload.personalInfo?.email || "");
      setPhone(payload.personalInfo?.phone || "");
      setLocation(payload.personalInfo?.location || "");
      setSummary(payload.personalInfo?.summary || "");
      setSkills(payload.skills || []);
      setEducation(payload.education || []);
      setExperience(payload.experience || []);
      setProjects(payload.projects || []);

      // Reload versions history list
      const versionsRes = await axios.get(
        `http://localhost:3000/api/resumes/${resumeId}/versions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVersions(versionsRes.data);
      
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore selected version.");
    } finally {
      setLoading(false);
    }
  };

  // Vector Selectable PDF browser printing stylesheet
  const handleBrowserPrint = () => {
    const previewDoc = document.getElementById("resume-preview-doc") || resumePreviewRef.current;
    if (!previewDoc) {
      toast.error("Resume preview target not found.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocker blocked the print window.");
      return;
    }

    const fontStyle = exportFontSize === "sm" ? "11px" : exportFontSize === "lg" ? "15px" : "13px";
    const colorStyle = exportColorMode === "bw" ? "grayscale contrast-125" : "";
    const sizeStyle = exportPaperSize === "letter" ? "letter-page" : "a4-page";

    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif !important;
              background-color: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .printable-resume {
              font-size: ${fontStyle} !important;
              width: ${exportPaperSize === "letter" ? "215.9mm" : "210mm"};
              margin: 15mm auto;
              padding: 0 10mm;
              box-sizing: border-box;
            }
            @media print {
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              .printable-resume {
                margin: 0 auto !important;
                padding: 0 !important;
                box-sizing: border-box;
              }
            }
          </style>
        </head>
        <body class="${colorStyle} ${sizeStyle}">
          <div class="printable-resume">
            ${previewDoc.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Perform advanced formats export
  const handleExportDownload = async () => {
    setIsExportOpen(false);

    if (exportFormat === "pdf") {
      // Trigger true print style vector pdf
      handleBrowserPrint();
      return;
    }

    if (exportFormat === "json") {
      const backupData = {
        title: resumeTitle,
        template: selectedTemplate,
        resume_data: {
          personalInfo: { fullName, title, email, phone, location, summary },
          education,
          experience,
          skills,
          projects
        }
      };
      downloadBlob(JSON.stringify(backupData, null, 2), `${resumeTitle.replace(/\s+/g, "_")}_backup.json`, "application/json");
      toast.success("JSON backup downloaded!");
      return;
    }

    if (exportFormat === "txt") {
      // Extract Plain text ATS representation
      const textRepresentation = `
=========================================
${fullName.toUpperCase()}
${title}
=========================================
Email: ${email} | Phone: ${phone} | Location: ${location}

SUMMARY
-----------------------------------------
${summary}

SKILLS
-----------------------------------------
${skills.join(", ")}

EXPERIENCE
-----------------------------------------
${experience.map((exp) => `
- ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  Location: ${exp.location}
  Description: ${exp.description}
`).join("\n")}

EDUCATION
-----------------------------------------
${education.map((edu) => `
- ${edu.degree}
  ${edu.institute} (${edu.startYear} - ${edu.endYear})
  Location: ${edu.location}
  Description: ${edu.description}
`).join("\n")}
      `;
      
      downloadBlob(textRepresentation, `${resumeTitle.replace(/\s+/g, "_")}_ATS.txt`, "text/plain;charset=utf-8");
      toast.success("TXT ATS version downloaded!");
      return;
    }

    if (exportFormat === "docx") {
      const previewDoc = document.getElementById("resume-preview-doc") || resumePreviewRef.current;
      if (!previewDoc) return;
      const documentContent = createWordDocument(previewDoc, `${resumeTitle} Word Doc`);
      downloadBlob(documentContent, `${resumeTitle.replace(/\s+/g, "_")}.docx`, "application/msword;charset=utf-8");
      toast.success("Word file downloaded!");
    }
  };

  // AI improve optimizer endpoint call
  const runAiImprove = async () => {
    setAiLoading(true);
    setAiError("");
    setAiSuggestions(null);
    try {
      const token = localStorage.getItem("token");
      
      const textToImprove = `
Name: ${fullName}
Title: ${title}
Summary: ${summary}
Skills: ${skills.join(", ")}
Education: ${education.map(e => `${e.degree} at ${e.institute} (${e.startYear}-${e.endYear})`).join("; ")}
Experience: ${experience.map(exp => `${exp.role} at ${exp.company} (${exp.startDate}-${exp.endDate}): ${exp.description}`).join("; ")}
      `;

      const blob = new Blob([textToImprove], { type: "application/pdf" });
      const testFile = new File([blob], "resume.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("resume", testFile);
      formData.append("jobRole", aiJobRole);

      const response = await axios.post(
        "http://localhost:3000/api/resumes/improve",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const improved = response.data.resume?.resume_data || {};
        setAiSuggestions({
          personalInfo: improved.personalInfo || {},
          skills: improved.skills || [],
          education: improved.education || [],
          experience: improved.experience || []
        });
      } else {
        throw new Error("Failed to process improvements.");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Failed to call Gemini Optimizer.";
      setAiError(errMsg);
      toast.error("AI Content enhancement failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const applySingleAiSuggestion = (field: "summary" | "skills" | "experience" | "all") => {
    if (!aiSuggestions) return;

    if (field === "summary" || field === "all") {
      setSummary(aiSuggestions.personalInfo.summary || summary);
      setTitle(aiSuggestions.personalInfo.title || title);
      setFullName(aiSuggestions.personalInfo.fullName || fullName);
    }
    if (field === "skills" || field === "all") {
      setSkills(aiSuggestions.skills || skills);
    }
    if (field === "experience" || field === "all") {
      setExperience(aiSuggestions.experience || experience);
    }

    toast.success(`${field === "all" ? "All" : field.toUpperCase()} recommendations applied to editor!`);
    setIsAiOpen(false);
  };

  // Compile active resume values or preview version values
  const getActiveRenderData = () => {
    if (previewingVersion) {
      const rData = previewingVersion.resume_data || {};
      const personal = rData.personalInfo || {};
      const eduSummary = (rData.education || []).map((item: any) =>
        [item.degree, item.institute, item.location, [item.startYear, item.endYear].filter(Boolean).join(" - "), item.description].filter(Boolean).join(", ")
      ).join("\n");
      const expSummary = (rData.experience || []).map((item: any) =>
        [[item.role, item.company].filter(Boolean).join(" at "), item.location, [item.startDate, item.endDate].filter(Boolean).join(" - "), item.description].filter(Boolean).join(", ")
      );
      return {
        name: personal.fullName || "John Doe",
        title: personal.title || "",
        email: personal.email || "",
        phone: personal.phone || "",
        location: personal.location || "",
        summary: personal.summary || "",
        skills: rData.skills || [],
        education: eduSummary,
        experience: expSummary,
        projects: rData.projects || []
      };
    }

    // Default current editor state
    const educationSummary = education
      .map((item) =>
        [item.degree, item.institute, item.location, [item.startYear, item.endYear].filter(Boolean).join(" - "), item.description].filter(Boolean).join(", ")
      )
      .join("\n");

    const experienceSummary = experience.map((item) =>
      [[item.role, item.company].filter(Boolean).join(" at "), item.location, [item.startDate, item.endDate].filter(Boolean).join(" - "), item.description].filter(Boolean).join(", ")
    );

    return {
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
  };

  const previewData = getActiveRenderData();
  const ActiveTemplate = templateMap[previewingVersion ? previewingVersion.template : currentTemplate.id] ?? templateMap.ats;

  const activeSectionIndex = editorSections.findIndex((s) => s.id === activeSection);
  const isFirstSection = activeSectionIndex === 0;
  const isLastSection = activeSectionIndex === editorSections.length - 1;

  const sectionFooter = (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-150 dark:border-white/5 pt-5">
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
            await saveResume(true);
            navigate("/dashboard");
          } else {
            goToNextSection();
          }
        }}
      >
        {isLastSection ? "Finish & Exit" : "Save & Next"}
      </Button>
    </div>
  );

  function goToNextSection() {
    completedSections.includes(activeSection) || setCompletedSections([...completedSections, activeSection]);
    if (!isLastSection) {
      handleSectionSwitch(editorSections[activeSectionIndex + 1].id);
    }
  }

  function goToPreviousSection() {
    if (!isFirstSection) {
      handleSectionSwitch(editorSections[activeSectionIndex - 1].id);
    }
  }

  const renderActiveSection = () => {
    if (activeSection === "skills") {
      return <SkillsForm skills={skills} setSkills={setSkills} footer={sectionFooter} />;
    }
    if (activeSection === "education") {
      return <EducationForm education={education} setEducation={setEducation} footer={sectionFooter} />;
    }
    if (activeSection === "experience") {
      return <ExperienceForm experience={experience} setExperience={setExperience} footer={sectionFooter} />;
    }

    return (
      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Details</h2>
            <p className="text-xs text-gray-500">Add credentials that appear at the top of your resume.</p>
          </div>

          <Button
            leftIcon={<Sparkles size={16} />}
            className="bg-indigo-650"
            onClick={() => {
              setAiSuggestions(null);
              setAiError("");
              setAiJobRole("");
              setIsAiOpen(true);
            }}
          >
            AI Improve
          </Button>
        </div>

        <div className="mb-6">
          <Select
            label="Resume Template Style"
            value={currentTemplate.id}
            options={templateOptions}
            onChange={(event) => onTemplateChange?.(event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Professional Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          
          <div className="md:col-span-2">
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Professional Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-32 text-xs"
            />
          </div>
        </div>

        {sectionFooter}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto text-indigo-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold animate-pulse">Loading Workspace...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#030712] p-6 text-slate-800 dark:text-white transition-colors duration-300">
      
      {/* Previewing historical bar */}
      {previewingVersion && (
        <div className="bg-amber-500/10 border border-amber-500/35 rounded-2xl p-4 mb-6 flex justify-between items-center max-w-[1400px] mx-auto text-xs font-bold text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Previewing Version {previewingVersion.version_number} ("{previewingVersion.title}") saved on {new Date(previewingVersion.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleRestoreVersion(previewingVersion.id, previewingVersion.version_number)}
              className="bg-amber-600 text-white px-3 py-1.5 rounded-xl hover:bg-amber-700 cursor-pointer"
            >
              Restore Version
            </button>
            <button
              onClick={() => setPreviewingVersion(null)}
              className="border border-amber-500 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl hover:bg-amber-500/15 cursor-pointer"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-6 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_clamp(350px,50%,850px)]">
        
        {/* Forms column */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between mb-4 border-b border-gray-150 dark:border-white/5 pb-3 gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  Resume Workspace
                  {isAutoSaving && (
                    <span className="text-[10px] bg-indigo-555/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-normal animate-pulse">
                      Saving...
                    </span>
                  )}
                  {!isAutoSaving && !isDirty && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-normal">
                      Saved
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Editing: {currentTemplate.name} style.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className={`text-xs px-3 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition ${parsingFile ? "opacity-60 cursor-not-allowed" : ""}`}>
                  <Upload size={14} className={parsingFile ? "animate-spin" : ""} />
                  {parsingFile ? "Parsing..." : "Upload Resume (AI Parse)"}
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleResumeImport}
                    disabled={parsingFile}
                  />
                </label>

                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="bg-transparent text-sm border-b border-dashed border-gray-300 focus:border-indigo-500 focus:outline-hidden font-semibold px-1 py-0.5 text-right w-44"
                  title="Document Title"
                />
              </div>
            </div>

            {/* Stepper progress */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {editorSections.map((section, index) => {
                const isActive = section.id === activeSection;
                const isComplete = completedSections.includes(section.id);

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleSectionSwitch(section.id)}
                    className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                      isActive
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                        : "border-gray-250 bg-white dark:border-white/5 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-900 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                        isComplete
                          ? "bg-indigo-600 text-white"
                          : isActive
                            ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400"
                            : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
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

        {/* Live Preview column */}
        <div className="sticky top-6 min-h-screen pb-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Live Preview Canvas</p>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-355">{currentTemplate.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVersionsOpen(true)}
                leftIcon={<History size={15} />}
                className="text-xs h-9"
              >
                Versions
              </Button>

              <Button
                type="button"
                leftIcon={<Settings size={15} />}
                onClick={() => setIsExportOpen(true)}
                className="bg-indigo-600 shadow-sm text-xs h-9"
              >
                Export Settings
              </Button>
            </div>
          </div>

          <ResumePreview ref={resumePreviewRef}>
            <div id="resume-preview-doc">
              <ActiveTemplate key={currentTemplate.id} data={previewData} />
            </div>
          </ResumePreview>
        </div>
      </div>

      {/* Version Control Sidebar Modal */}
      <Modal
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        title="Resume Version History"
        description="Review older versions of your work and restore configurations."
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {versions.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">No historical records found. Versioning compiles on manual saves and AI matches.</p>
          ) : (
            <div className="space-y-3">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="flex justify-between items-center border border-gray-250 dark:border-white/5 p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white">Version {ver.version_number} - {ver.title}</h5>
                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <Clock size={10} /> Saved {new Date(ver.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-2 py-1 h-7 text-[10px]"
                      onClick={() => {
                        setPreviewingVersion(ver);
                        setIsVersionsOpen(false);
                      }}
                    >
                      <Eye size={12} className="mr-1" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      className="px-2 py-1 h-7 text-[10px]"
                      onClick={() => handleRestoreVersion(ver.id, ver.version_number)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Advanced Export Settings Modal */}
      <Modal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Professional Export Settings"
        description="Choose parameters to configure your print layout and file type."
      >
        <div className="space-y-4">
          <Select
            label="File Format"
            value={exportFormat}
            options={[
              { label: "Vector Selectable PDF (ATS friendly)", value: "pdf" },
              { label: "Microsoft Word (DOCX)", value: "docx" },
              { label: "Plain Text (TXT ATS outline)", value: "txt" },
              { label: "JSON Raw Backup", value: "json" }
            ]}
            onChange={(e) => setExportFormat(e.target.value as DownloadFormat)}
          />

          {exportFormat === "pdf" && (
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
              <Select
                label="Font Size"
                value={exportFontSize}
                options={[
                  { label: "Small (Compact)", value: "sm" },
                  { label: "Medium (Regular)", value: "md" },
                  { label: "Large (Expanded)", value: "lg" }
                ]}
                onChange={(e) => setExportFontSize(e.target.value)}
              />
              <Select
                label="Paper Size"
                value={exportPaperSize}
                options={[
                  { label: "A4 (Standard)", value: "a4" },
                  { label: "Letter (US Standard)", value: "letter" }
                ]}
                onChange={(e) => setExportPaperSize(e.target.value)}
              />
              <Select
                label="Color Palette"
                value={exportColorMode}
                options={[
                  { label: "Color (Premium)", value: "color" },
                  { label: "Black & White (ATS Safe)", value: "bw" }
                ]}
                onChange={(e) => setExportColorMode(e.target.value)}
              />
              <Select
                label="Layout Style"
                value={exportLayoutMode}
                options={[
                  { label: "Auto Page breaks", value: "multi" },
                  { label: "Single Page Optimization", value: "single" }
                ]}
                onChange={(e) => setExportLayoutMode(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>Cancel</Button>
            <Button onClick={handleExportDownload} leftIcon={<FileDown size={16} />}>
              Export & Download
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI Improvement Modal */}
      <Modal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="AI Resume Content Enhancer"
        description="Tailor and improve your credentials using Google Gemini's expert consultancy recommendations."
        size="lg"
      >
        <div className="space-y-6">
          {!aiSuggestions && (
            <div className="space-y-4">
              <Input
                label="Target Job Role or Focus (Optional)"
                placeholder="e.g. Senior Frontend Engineer, DevOps Intern, Java Architect..."
                value={aiJobRole}
                onChange={(e) => setAiJobRole(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Specifying your target role allows the AI model to highlight relevant skills, adjust resume vocabulary, 
                and format experience impact descriptions for maximum recruiter matching.
              </p>

              <div className="flex justify-end">
                <Button
                  onClick={runAiImprove}
                  isLoading={aiLoading}
                  leftIcon={<Sparkles size={16} />}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-xs py-3"
                >
                  Enhance Content
                </Button>
              </div>
            </div>
          )}

          {aiLoading && (
            <div className="py-10 text-center space-y-3">
              <RefreshCw className="animate-spin text-indigo-500 mx-auto" size={28} />
              <p className="text-xs text-gray-500 animate-pulse">
                Analyzing current parameters, optimizing action verbs, and organizing skills matrix...
              </p>
            </div>
          )}

          {aiSuggestions && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 items-start bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">AI Summary Recommendation</h4>
                  <p className="text-xs text-slate-800 dark:text-gray-300 mt-2 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-950 p-3 rounded-xl border dark:border-white/5">
                    {aiSuggestions.personalInfo?.summary}
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 text-[11px]"
                    onClick={() => applySingleAiSuggestion("summary")}
                  >
                    Apply AI Summary Only
                  </Button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">AI Recommended Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2 bg-white dark:bg-slate-950 p-3 rounded-xl border dark:border-white/5 min-h-[90px]">
                    {aiSuggestions.skills?.map((s: string, idx: number) => (
                      <Badge key={idx} className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 text-[11px]"
                    onClick={() => applySingleAiSuggestion("skills")}
                  >
                    Apply AI Skills Only
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border dark:border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Tailored Work Experience Bullet Points</h4>
                <div className="space-y-3 bg-white dark:bg-slate-950 p-3 rounded-xl border dark:border-white/5">
                  {aiSuggestions.experience?.map((exp: any, idx: number) => (
                    <div key={idx} className="pb-2 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white">{exp.role} at {exp.company}</span>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="text-[11px]"
                  onClick={() => applySingleAiSuggestion("experience")}
                >
                  Apply AI Experience Bullet Points Only
                </Button>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/5 pt-4">
                <Button
                  variant="outline"
                  leftIcon={<RotateCcw size={14} />}
                  onClick={() => setAiSuggestions(null)}
                >
                  Configure Role
                </Button>
                <Button
                  className="bg-indigo-600"
                  onClick={() => applySingleAiSuggestion("all")}
                >
                  Accept & Apply All Suggestions
                </Button>
              </div>
            </div>
          )}

          {aiError && (
            <div className="p-4 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="shrink-0" size={18} />
                <h5 className="font-bold text-xs">AI Optimization Encountered an Error</h5>
              </div>
              <p className="text-xs leading-relaxed">{aiError}</p>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsAiOpen(false)}>Cancel</Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={runAiImprove}>
                  Retry AI Call
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ResumeForm;
