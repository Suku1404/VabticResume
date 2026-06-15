import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import gsap from "gsap";
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  Download,
  ArrowLeft,
  ChevronLeft,
  Wand2,
} from "lucide-react";
import { Button, Card, Badge } from "../components/common";
import ATSResume from "../templates/ATSResume";
import { downloadResumePdf } from "../utils/downloadResumePdf";

type Stage = "upload" | "verifying" | "examining" | "done";

type Suggestion = {
  parameter: string;
  observations: string;
  actionPlan: string;
};

const AiResumeImprove = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [improvedResume, setImprovedResume] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const loaderTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload only PDF resumes.");
      return;
    }

    setFile(selectedFile);
  };

  const handleStartImprovement = () => {
    if (!file) {
      toast.error("Please select a resume file first.");
      return;
    }
    // Transition to verification stage
    setStage("verifying");
  };

  // Stage: Verifying (GSAP 3s animation)
  useEffect(() => {
    if (stage !== "verifying") return;

    // 1. Stagger letters or spin text in verifying stage
    const el = loaderTextRef.current;
    if (el) {
      el.innerHTML = "Verifying the Resume..."
        .split("")
        .map((c) => `<span class="verifying-letter inline-block opacity-40">${c}</span>`)
        .join("");

      gsap.to(".verifying-letter", {
        opacity: 1,
        yoyo: true,
        repeat: -1,
        stagger: 0.08,
        duration: 0.4,
        ease: "power1.inOut",
      });
    }

    // 2. Animate a mock progress bar
    gsap.fromTo(
      progressBarRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: 3,
        ease: "linear",
        onComplete: () => {
          // Move to examining stage (call API)
          setStage("examining");
        },
      }
    );
  }, [stage]);

  // Stage: Examining (Calling Gemini Backend API)
  useEffect(() => {
    if (stage !== "examining") return;

    const improveResumeApi = async () => {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("resume", file!);

        const response = await axios.post(
          "http://localhost:3000/api/auth/improve-resume",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setImprovedResume(response.data.resume);
          setSuggestions(response.data.suggestions);
          setStage("done");
          toast.success("Resume improved successfully with Gemini!");
        } else {
          throw new Error("Failed to improve resume");
        }
      } catch (err: any) {
        console.error("API error:", err);
        const errMsg = err.response?.data?.message || "Failed to process AI improvements.";
        toast.error(errMsg);
        setStage("upload"); // Revert back to upload on failure
      }
    };

    improveResumeApi();
  }, [stage, file]);

  // Done transition animation
  useEffect(() => {
    if (stage === "done") {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [stage]);

  // Download Improved PDF
  const handleDownload = async () => {
    const docEl = document.getElementById("improved-preview-doc");
    if (!docEl) {
      toast.error("Resume document element not found!");
      return;
    }

    setIsDownloading(true);
    try {
      const fileName = `${improvedResume?.title || "improved_resume"}.pdf`;
      await downloadResumePdf(docEl, fileName);
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    if (stage === "upload") {
      return (
        <div className="max-w-xl mx-auto space-y-6">
          <Card className="text-center p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Improve Your Resume with AI</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Upload your existing PDF resume, and Google Gemini will examine it for errors and create a highly polished, recruiter-friendly version.
            </p>

            <label
              htmlFor="ai-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-10 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-300 min-h-60"
            >
              {file ? (
                <>
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-950 p-4 text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white mb-1">Resume Selected</span>
                  <span className="text-xs text-gray-500 max-w-xs truncate">{file.name}</span>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-indigo-50 dark:bg-indigo-950 p-4 text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
                    <Upload size={32} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white mb-1">Click to select PDF resume</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Only text-based PDF formats are supported</span>
                </>
              )}
              <input
                id="ai-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <Button
              onClick={handleStartImprovement}
              disabled={!file}
              fullWidth
              className="mt-6 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5"
            >
              <Wand2 size={18} />
              Improve My Resume
            </Button>
          </Card>
        </div>
      );
    }

    if (stage === "verifying") {
      return (
        <div className="max-w-md mx-auto py-20 text-center space-y-6">
          <div className="relative inline-flex items-center justify-center p-8 bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-3xl animate-pulse">
            <FileText size={48} />
          </div>

          <div
            ref={loaderTextRef}
            className="text-2xl font-black tracking-wide text-slate-900 dark:text-white select-none h-8"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Checking file structure, extracting metadata, and initiating scanning sequence.
          </p>

          <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div ref={progressBarRef} className="h-full bg-linear-to-r from-indigo-500 to-purple-500 w-0" />
          </div>
        </div>
      );
    }

    if (stage === "examining") {
      return (
        <div className="max-w-md mx-auto py-20 text-center space-y-6">
          <div className="relative inline-flex items-center justify-center p-8 bg-purple-600/15 text-purple-600 dark:text-purple-400 rounded-3xl">
            <Sparkles size={48} className="animate-spin" style={{ animationDuration: "3s" }} />
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Examining with Google Gemini...</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Improving vocabulary, quantifying achievements, and adding standard technical tags. This may take a few moments.
          </p>
        </div>
      );
    }

    // Done state
    const rData = improvedResume?.resume_data || {};
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
      name: personal.fullName || "John Doe",
      title: personal.title || "",
      email: personal.email || "",
      phone: personal.phone || "",
      location: personal.location || "",
      summary: personal.summary || "",
      skills: skillsList,
      education: educationSummary,
      experience: experienceSummary,
      projects: [],
    };

    return (
      <div ref={contentRef} className="grid gap-6 lg:grid-cols-[400px_1fr] items-start opacity-0">
        {/* Left Suggestions Pane */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600 dark:text-purple-400" />
              <Card.Title>AI Improvement Analysis</Card.Title>
            </div>
            <Card.Description>
              Gemini has optimized your resume based on key professional parameters.
            </Card.Description>

            <div className="mt-5 space-y-4">
              {suggestions.map((s, index) => (
                <div key={index} className="border-b border-gray-150 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                    {index === 0 && <CheckCircle size={16} className="text-emerald-500" />}
                    {index === 1 && <CheckCircle size={16} className="text-indigo-500" />}
                    {index === 2 && <Lightbulb size={16} className="text-amber-500" />}
                    {index === 3 && <Lightbulb size={16} className="text-purple-500" />}
                    {s.parameter}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Observations:</span> {s.observations}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Action Plan:</span> {s.actionPlan}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Button
            fullWidth
            leftIcon={<Download size={18} />}
            onClick={handleDownload}
            isLoading={isDownloading}
          >
            Download Improved PDF
          </Button>
        </div>

        {/* Right Preview Pane */}
        <div className="space-y-6">
          <Card>
            <Card.Title>Improved Resume Preview (PostgreSQL Saved)</Card.Title>
            <Card.Description>
              This resume has been updated and saved in your PostgreSQL profile database.
            </Card.Description>

            <div className="flex justify-center pt-6 overflow-x-auto">
              <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-white/5 bg-white p-6" style={{ width: "210mm" }}>
                <div id="improved-preview-doc" className="w-full">
                  <ATSResume data={previewData} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="text-slate-800 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (stage === "done") {
                  setStage("upload");
                  setFile(null);
                } else {
                  navigate("/dashboard");
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-black">AI Resume Optimizer</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Step-by-step resume analyzer</p>
            </div>
          </div>

          {stage === "done" && (
            <Button
              variant="outline"
              onClick={() => {
                setStage("upload");
                setFile(null);
              }}
            >
              Upload Another
            </Button>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AiResumeImprove;
