import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Download, FileText, ArrowLeft } from "lucide-react";
import { Button, Card } from "../components/common";
import ResumePreview from "../components/resume/ResumePreview";
import ATSResume from "../templates/ATSResume";
import { downloadResumePdf } from "../utils/downloadResumePdf";
import { toast } from "react-toastify";

const SaveResume = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/auth/my-resume/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResume(response.data);
    } catch (error) {
      console.error("Fetch single resume error:", error);
      toast.error("Failed to load resume details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [id]);

  const handleDownload = async () => {
    const previewElement = document.getElementById("resume-preview-doc");
    if (!previewElement) {
      toast.error("Resume preview element not found!");
      return;
    }

    setIsDownloading(true);
    try {
      const fileName = `${resume?.title || "resume"}.pdf`;
      await downloadResumePdf(previewElement, fileName);
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-indigo-500 animate-bounce mb-4" />
          <h2 className="text-xl font-bold">Loading your resume...</h2>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold">Resume not found</h2>
          <p className="mt-2 text-gray-500">The resume you are looking for does not exist or you lack permission to view it.</p>
          <Button className="mt-6" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Structure resume data for rendering inside the ATS template
  const rData = resume.resume_data || {};
  const personal = rData.personalInfo || {};
  const educationList = rData.education || [];
  const experienceList = rData.experience || [];
  const skillsList = rData.skills || [];

  const educationSummary = educationList
    .map((item: any) =>
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

  const experienceSummary = experienceList.map((item: any) =>
    [
      [item.role, item.company].filter(Boolean).join(" at "),
      item.location,
      [item.startDate, item.endDate].filter(Boolean).join(" - "),
      item.description,
    ]
      .filter(Boolean)
      .join(", ")
  );

  const previewData = {
    name: personal.fullName || "Untitled",
    title: personal.title || "",
    email: personal.email || "",
    phone: personal.phone || "",
    location: personal.location || "",
    summary: personal.summary || "",
    skills: skillsList,
    education: educationSummary,
    experience: experienceSummary,
    projects: rData.projects || [],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-6 transition-colors duration-300">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-black">{resume.title || "My Resume"}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Preview and download page</p>
            </div>
          </div>

          <Button
            leftIcon={<Download size={18} />}
            onClick={handleDownload}
            isLoading={isDownloading}
          >
            Download PDF
          </Button>
        </div>

        {/* Paper Preview Container */}
        <div className="flex justify-center py-6 overflow-x-auto">
          <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 bg-white p-6" style={{ width: "210mm" }}>
            <div id="resume-preview-doc" className="w-full">
              <ATSResume data={previewData} />
            </div>
          </div>
        </div>

        {/* Next/Back Page Flow Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            leftIcon={<ChevronLeft size={16} />}
          >
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate("/user/templates")}>
            Create Another Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaveResume;