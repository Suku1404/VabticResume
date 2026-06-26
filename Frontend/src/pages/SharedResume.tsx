import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Download, Sparkles } from "lucide-react";
import { Button } from "../components/common";
import { templateMap } from "../templates";
import { downloadResumePdf } from "../utils/downloadResumePdf";
import { toast } from "react-toastify";

const SharedResume = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSharedResume = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/resumes/share/${shareId}`
        );
        setResume(response.data);
      } catch (err) {
        console.error("Fetch shared resume error:", err);
        toast.error("Failed to load the shared resume. It may have been unshared or deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedResume();
  }, [shareId]);

  const handleDownload = async () => {
    if (!resumeRef.current) return;
    setIsDownloading(true);
    try {
      const fileName = `${resume?.title || "resume"}.pdf`;
      await downloadResumePdf(resumeRef.current, fileName);
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
          <h2 className="text-xl font-bold">Loading shared resume...</h2>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-md border border-gray-100 dark:border-white/5">
          <FileText size={48} className="mx-auto text-red-500 mb-4 animate-pulse" />
          <h2 className="text-2xl font-black">Resume Not Available</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            This resume link is invalid, has expired, or the owner disabled sharing.
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate("/")}>
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

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

  const ActiveTemplate = templateMap[resume.template] ?? templateMap.ats;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-6 transition-colors duration-300">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Simple Shared Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-2.5 text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black">{resume.title || "Shared Resume"}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Shared view • {resume.views} views</p>
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

        {/* Paper Resume View */}
        <div className="flex justify-center py-6 overflow-x-auto">
          <div className="rounded-2xl shadow-2xl border border-gray-200 dark:border-white/5 bg-white p-6" style={{ width: "210mm" }}>
            <div id="shared-resume-doc" ref={resumeRef} className="w-full">
              <ActiveTemplate data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedResume;
