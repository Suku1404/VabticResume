import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Lightbulb,
  Sparkles,
  Target,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ChangeEvent } from "react";

type AtsResult = {
  keywordsMatch: string;
  formatting: string;
  readability: string;
  recruiterFriendly: string;
  sectionCoverage: string;
};

type SectionScore = {
  label: string;
  score: number;
};

type Risk = {
  title: string;
  severity: "high" | "medium" | "low";
  description: string;
  fix: string;
};

type Suggestion = {
  title: string;
  priority: "high" | "medium" | "low";
  detail: string;
  example: string;
};

type AtsAnalysis = {
  summary: string;
  grade: string;
  sectionScores: SectionScore[];
  risks: Risk[];
  missingKeywords: string[];
  strongKeywords: string[];
  suggestions: Suggestion[];
  parsingNotes: string;
};

const emptyResult: AtsResult = {
  keywordsMatch: "Waiting...",
  formatting: "Waiting...",
  readability: "Waiting...",
  recruiterFriendly: "Waiting...",
  sectionCoverage: "Waiting...",
};

const AtsScore = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult>(emptyResult);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      alert("Please upload a file first");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload only a PDF file");
      return;
    }

    setResumeFile(file);
    setScore(0);
    setResult(emptyResult);
    setAnalysis(null);
    setShowReport(false);
  };

  const handleCheckScore = async () => {
    if (!resumeFile) {
      alert("Upload resume first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const res = await axios.post(
        "http://localhost:3000/api/ats/ats-check-score",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setScore(res.data.score);
      setResult(res.data.result);
      setAnalysis(res.data.analysis);
      setShowReport(true);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong while checking ATS score");
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResumeFile(null);
    setJobDescription("");
    setScore(0);
    setResult(emptyResult);
    setAnalysis(null);
    setShowReport(false);
  };

  return (
    <div className="relative text-slate-800 dark:text-white transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-15%] h-80 w-80 rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-8%] h-96 w-96 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-purple-300/20 bg-purple-500/15 text-purple-600 dark:text-purple-200 shadow-[0_0_40px_rgba(168,85,247,0.15)] dark:shadow-[0_0_40px_rgba(168,85,247,0.25)]">
            <FileText size={30} />
          </div>
          <h1 className="text-4xl font-black tracking-normal md:text-5xl text-slate-900 dark:text-white">
            ATS Score Checker
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
            Upload your resume, add a target job description, and review a deeper ATS scan with risks,
            keywords, section scores, and practical fixes.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <FloatingPanel delay={0}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Resume</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Supported format: PDF only</p>
              </div>
              <div className="rounded-lg border border-purple-300/20 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-700 dark:text-purple-200">
                ATS scan
              </div>
            </div>

            <label
              htmlFor="resume-upload"
              className="mt-7 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-purple-300/40 bg-white dark:bg-[#14182a]/80 px-6 py-12 text-center shadow-inner hover:-translate-y-1 hover:border-indigo-500 dark:hover:border-purple-300/80 hover:bg-slate-50 dark:hover:bg-purple-500/15 transition duration-300"
            >
              {resumeFile ? (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-300"
                  >
                    <CheckCircle size={42} />
                  </motion.div>
                  <span className="mt-5 font-semibold text-slate-800 dark:text-purple-200">File Selected</span>
                  <span className="mt-2 max-w-full truncate text-sm text-slate-600 dark:text-slate-300">{resumeFile.name}</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-purple-500/15 text-indigo-600 dark:text-purple-200"
                  >
                    <Upload size={38} />
                  </motion.div>
                  <span className="mt-5 font-semibold text-slate-800 dark:text-white">Click to upload your resume</span>
                  <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">or drag and drop file here</span>
                </>
              )}

              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <label className="mt-6 block">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Target size={16} className="text-indigo-500 dark:text-purple-300" />
                Target Job Description
              </span>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here for a more accurate keyword match."
                className="mt-3 min-h-36 w-full resize-y rounded-lg border border-gray-250 bg-white dark:border-white/10 dark:bg-[#0f1322] px-4 py-3 text-sm leading-6 text-slate-800 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-purple-300/70 focus:bg-slate-50/50 dark:focus:bg-[#14182a]"
              />
            </label>

            <button
              onClick={handleCheckScore}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={18} />
              {loading ? "Scanning resume..." : "Check ATS Score"}
            </button>
          </FloatingPanel>

          <FloatingPanel delay={0.15}>
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <Sparkles className="text-indigo-600 dark:text-purple-300" />
              <h2 className="text-2xl font-bold">Result Preview</h2>
            </div>

            <div className="mt-8 flex justify-center">
              <ScoreRing score={score} grade={analysis?.grade || "-"} />
            </div>

            <div className="mt-8 space-y-3">
              <ScoreItem title="Keywords Match" value={result.keywordsMatch} />
              <ScoreItem title="Formatting" value={result.formatting} />
              <ScoreItem title="Readability" value={result.readability} />
              <ScoreItem title="Recruiter Friendly" value={result.recruiterFriendly} />
              <ScoreItem title="Section Coverage" value={result.sectionCoverage} />
            </div>

            {analysis && (
              <button
                onClick={() => setShowReport(true)}
                className="mt-7 w-full rounded-lg border border-gray-200 dark:border-purple-300/30 bg-slate-100 dark:bg-purple-500/10 px-5 py-3 text-sm font-bold text-indigo-700 dark:text-purple-100 transition hover:-translate-y-1 hover:bg-slate-200 dark:hover:bg-purple-500/20"
              >
                Open Full Scan Report
              </button>
            )}
          </FloatingPanel>
        </div>
      </main>

      <AnimatePresence>
        {showReport && analysis && (
          <ScanReportModal
            analysis={analysis}
            score={score}
            onClose={() => setShowReport(false)}
            onNewScan={resetScan}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingPanel = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 26 }}
    animate={{ opacity: 1, y: [0, -6, 0] }}
    transition={{
      opacity: { duration: 0.5, delay },
      y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay },
    }}
    className="rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
  >
    {children}
  </motion.section>
);

const ScoreRing = ({ score, grade }: { score: number; grade: string }) => (
  <motion.div
    initial={{ scale: 0.92, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.45 }}
    className="relative flex h-48 w-48 items-center justify-center rounded-full p-3"
    style={{
      background: `conic-gradient(#a855f7 ${score * 3.6}deg, rgba(168,85,247,0.1) 0deg)`,
    }}
  >
    <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-gray-250 dark:border-white/10 bg-white dark:bg-[#0b0f1d] shadow-inner">
      <span className="text-5xl font-black text-slate-900 dark:text-white">{score}</span>
      <span className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">ATS Score</span>
      <span className="mt-4 rounded-lg bg-indigo-50 dark:bg-purple-500/15 px-4 py-2 text-sm font-bold text-indigo-700 dark:text-purple-200">
        Grade: {grade}
      </span>
    </div>
  </motion.div>
);

const ScoreItem = ({ title, value }: { title: string; value: string }) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.045] px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-purple-300/40 hover:bg-slate-50 dark:hover:bg-purple-500/10">
    <span className="text-sm text-slate-650 dark:text-slate-300">{title}</span>
    <span className="text-sm font-semibold text-indigo-600 dark:text-purple-200">{value}</span>
  </div>
);

const ScanReportModal = ({
  analysis,
  score,
  onClose,
  onNewScan,
}: {
  analysis: AtsAnalysis;
  score: number;
  onClose: () => void;
  onNewScan: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-6"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1020] text-slate-800 dark:text-white shadow-2xl"
    >
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.035] px-5 py-4 sm:px-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">ATS Scan Results</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review the full analysis below.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewScan}
            className="hidden rounded-lg bg-gray-100 dark:bg-white/10 px-5 py-3 text-sm font-bold text-slate-800 dark:text-white transition hover:bg-gray-200 dark:hover:bg-white/15 sm:block"
          >
            New Scan
          </button>
          <button
            onClick={onClose}
            aria-label="Close scan report"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 transition hover:bg-red-50 dark:hover:bg-purple-500/20 hover:text-red-650 dark:hover:text-white"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-5 py-6 sm:px-8 bg-slate-50 dark:bg-slate-950/20">
        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.045] p-6 flex justify-center items-center">
            <ScoreRing score={score} grade={analysis.grade} />
          </div>

          <ReportCard title="Summary">
            <p className="text-base leading-8 text-slate-700 dark:text-slate-200">{analysis.summary}</p>
          </ReportCard>
        </div>

        <ReportSection title="Section Scores">
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.sectionScores.map((item) => (
              <SectionBar key={item.label} item={item} />
            ))}
          </div>
        </ReportSection>

        <ReportSection title="ATS Risks">
          <ReportCard>
            {analysis.risks.length > 0 ? (
              <div className="space-y-5">
                {analysis.risks.map((risk) => (
                  <RiskItem key={risk.title} risk={risk} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">No major ATS risks were detected in this scan.</p>
            )}
          </ReportCard>
        </ReportSection>

        <ReportSection title="Missing Keywords">
          <KeywordCloud keywords={analysis.missingKeywords} emptyText="No important missing keywords detected." />
        </ReportSection>

        <ReportSection title="Strong Keywords">
          <KeywordCloud keywords={analysis.strongKeywords} emptyText="No strong technical keywords detected yet." />
        </ReportSection>

        <ReportSection title="Top Suggestions">
          <ReportCard>
            <div className="space-y-6">
              {analysis.suggestions.map((suggestion) => (
                <SuggestionItem key={suggestion.title} suggestion={suggestion} />
              ))}
            </div>
          </ReportCard>
        </ReportSection>

        <ReportSection title="Parsing Notes">
          <ReportCard>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{analysis.parsingNotes}</p>
          </ReportCard>
        </ReportSection>
      </div>
    </motion.div>
  </motion.div>
);

const ReportSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-7">
    <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">{title}</h3>
    {children}
  </section>
);

const ReportCard = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.045] p-5 shadow-sm dark:shadow-xl sm:p-6"
  >
    {title && <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">{title}</h3>}
    {children}
  </motion.div>
);

const SectionBar = ({ item }: { item: SectionScore }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.045] p-4"
  >
    <div className="flex items-center justify-between gap-4">
      <span className="font-bold text-slate-800 dark:text-slate-100">{item.label}</span>
      <span className="text-sm text-slate-500 dark:text-slate-350">{item.score}/100</span>
    </div>
    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${item.score}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-full rounded-full bg-linear-to-r from-purple-400 via-indigo-400 to-cyan-300"
      />
    </div>
  </motion.div>
);

const RiskItem = ({ risk }: { risk: Risk }) => (
  <div className="flex gap-3">
    <AlertTriangle className="mt-1 shrink-0 text-amber-500 dark:text-amber-300" size={18} />
    <div>
      <h4 className="font-bold text-slate-800 dark:text-slate-100">
        {risk.title} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">({risk.severity})</span>
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{risk.description}</p>
      <p className="mt-1 text-sm leading-6 text-slate-800 dark:text-slate-200">
        <span className="font-bold">Fix:</span> {risk.fix}
      </p>
    </div>
  </div>
);

const KeywordCloud = ({
  keywords,
  emptyText,
}: {
  keywords: string[];
  emptyText: string;
}) => (
  <ReportCard>
    {keywords.length > 0 ? (
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword, index) => (
          <motion.span
            key={keyword}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="rounded-full border border-purple-200 dark:border-purple-300/20 bg-purple-50 dark:bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-700 dark:text-purple-100 shadow-sm"
          >
            {keyword}
          </motion.span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-500 dark:text-slate-350">{emptyText}</p>
    )}
  </ReportCard>
);

const SuggestionItem = ({ suggestion }: { suggestion: Suggestion }) => (
  <div className="flex gap-3">
    <Lightbulb className="mt-1 shrink-0 text-indigo-500 dark:text-purple-300" size={18} />
    <div className="min-w-0 flex-1">
      <h4 className="font-bold text-slate-800 dark:text-slate-100">
        {suggestion.title} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">({suggestion.priority})</span>
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-650 dark:text-slate-300">{suggestion.detail}</p>
      <div className="mt-4 rounded-lg border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f1425] px-4 py-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {suggestion.example}
      </div>
    </div>
  </div>
);

export default AtsScore;
