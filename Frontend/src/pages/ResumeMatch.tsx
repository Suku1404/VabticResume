import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, AlertTriangle, AlertCircle, Cpu, Zap, ArrowRight, FileText, Check, ListChecks, Upload } from "lucide-react";
import { Button, Card, Badge, Select, Textarea } from "../components/common";
import { toast } from "react-toastify";

const ResumeMatch = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [parsingJd, setParsingJd] = useState(false);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resumesList = Array.isArray(response.data) ? response.data : (response.data?.resumes || []);
      setResumes(resumesList);
      if (resumesList.length > 0) {
        setSelectedResumeId(resumesList[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your resumes.");
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleJdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJobDescription(event.target?.result as string);
        toast.success("Job description loaded from file!");
      };
      reader.readAsText(file);
    } else {
      setParsingJd(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/api/resumes/extract-text", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data?.text) {
          setJobDescription(response.data.text);
          toast.success("Job description parsed successfully!");
        } else {
          toast.error("Failed to extract text from file.");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to parse job description file.");
      } finally {
        setParsingJd(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume to match.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste or upload the job description first.");
      return;
    }

    setAnalyzing(true);
    setAnalysis(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/resumes/match",
        {
          resumeId: Number(selectedResumeId),
          jobDescription
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAnalysis(response.data);
      toast.success("ATS Analysis completed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to perform ATS matching.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplySuggestions = async () => {
    if (!analysis || !analysis.improvedContent) return;
    setApplying(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch current resume data
      const getResponse = await axios.get(
        `http://localhost:3000/api/resumes/${selectedResumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const originalResume = getResponse.data;
      const originalData = originalResume.resume_data || {};

      // Merge improvedContent from Gemini (e.g. summary, skills, experience)
      const mergedData = {
        ...originalData,
        personalInfo: {
          ...originalData.personalInfo,
          summary: analysis.improvedContent.personalInfo?.summary || originalData.personalInfo?.summary
        },
        skills: analysis.improvedContent.skills || originalData.skills,
        experience: originalData.experience.map((exp: any) => {
          // Find matching role in AI suggestions and update description
          const improved = analysis.improvedContent.experience?.find(
            (imp: any) => imp.role === exp.role && imp.company === exp.company
          );
          return improved
            ? { ...exp, description: improved.description }
            : exp;
        })
      };

      // Save back to backend
      await axios.put(
        `http://localhost:3000/api/resumes/${selectedResumeId}`,
        {
          ...originalResume,
          resume_data: mergedData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("AI Suggestions applied directly to your resume!");
      setAnalysis(null); // Clear analysis to show successful completion
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to apply suggestions automatically.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 text-slate-800 dark:text-white pb-10">
      {/* Premium Header */}
      <div className="rounded-3xl bg-linear-to-r from-gray-950 via-indigo-950 to-purple-950 p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <Badge className="bg-white/10 text-indigo-200 ring-indigo-500/30">
          Resume Match Analytics
        </Badge>
        <h1 className="mt-4 text-3xl font-black">AI ATS Resume Matcher</h1>
        <p className="mt-2 text-sm text-indigo-100 max-w-2xl">
          Instantly evaluate how well your resume matches any Job Description. Check missing keywords, 
          ATS compatibility metrics, and apply optimized content enhancements directly with a single click.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Left Form Control */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-indigo-500" />
              <Card.Title>ATS Comparison</Card.Title>
            </div>

            <div className="space-y-4">
              {loadingResumes ? (
                <div className="py-4 text-center text-xs text-gray-500 animate-pulse">Loading Resumes...</div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">No Resumes Found.</p>
                  <Button size="sm" className="mt-2" onClick={() => (window.location.href = "/user/templates")}>
                    Create a Resume
                  </Button>
                </div>
              ) : (
                <Select
                  label="Select Resume to Compare"
                  value={selectedResumeId}
                  options={resumes.map((r) => ({ label: r.title, value: r.id.toString() }))}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                />
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Job Description</label>
                  <label className="text-xs text-indigo-650 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    <Upload size={12} />
                    Upload file (PDF/DOCX/TXT)
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={handleJdFileUpload}
                    />
                  </label>
                </div>
                {parsingJd && <span className="text-[10px] text-indigo-500 animate-pulse block">Parsing file contents...</span>}
                <Textarea
                  placeholder="Paste or upload the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-64 text-xs"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                isLoading={analyzing}
                disabled={resumes.length === 0 || parsingJd}
                fullWidth
                className="bg-indigo-600 hover:bg-indigo-700 py-3.5 mt-2"
              >
                Analyze Match Score
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Dashboard Results */}
        <div className="space-y-6">
          {analyzing && (
            <Card className="text-center py-20 space-y-4">
              <Cpu className="animate-spin text-indigo-500 mx-auto" size={36} />
              <h4 className="font-bold text-lg">AI Analyzer is parsing files...</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto animate-pulse">
                Comparing text embeddings, cataloging technical skill coverage, and generating structural rewrites.
              </p>
            </Card>
          )}

          {!analyzing && !analysis && (
            <Card className="flex flex-col items-center justify-center text-center py-20 min-h-[450px]">
              <FileText size={48} className="text-indigo-500/80 mb-4" />
              <h3 className="text-xl font-bold">No ATS Scan Performed</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                Configure your target resume and paste a job description on the left to start the AI scan.
              </p>
            </Card>
          )}

          {analysis && (
            <div className="space-y-6">
              {/* Scores & Quick Actions */}
              <div className="grid gap-6 md:grid-cols-[380px_1fr]">
                <Card className="p-6 border-l-4 border-indigo-500 flex flex-col justify-center">
                  <div className="flex justify-around items-center gap-4">
                    {/* ATS Match Gauge */}
                    <div className="text-center flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ATS Score</span>
                      <div className="relative flex items-center justify-center mt-3 h-24 w-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-100 dark:text-slate-800"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                            className="text-indigo-600 dark:text-indigo-500"
                          />
                        </svg>
                        <span className="absolute text-2xl font-black text-slate-900 dark:text-white">
                          {analysis.atsScore}%
                        </span>
                      </div>
                    </div>

                    {/* Resume Score Gauge */}
                    <div className="text-center flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resume Quality</span>
                      <div className="relative flex items-center justify-center mt-3 h-24 w-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-100 dark:text-slate-800"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * (analysis.resumeScore || analysis.atsScore)) / 100}
                            className="text-emerald-600 dark:text-emerald-500"
                          />
                        </svg>
                        <span className="absolute text-2xl font-black text-slate-900 dark:text-white">
                          {analysis.resumeScore || analysis.atsScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-6 bg-gradient-to-r from-indigo-900/10 via-purple-900/5 to-transparent border border-indigo-500/10">
                  <div>
                    <Card.Title className="text-lg text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                      <Zap size={18} />
                      One-Click Application Enhancer
                    </Card.Title>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Gemini has prepared an optimized summary, added missing keywords, and rephrased experience bullet points with keywords from this job posting.
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={handleApplySuggestions}
                      isLoading={applying}
                      leftIcon={<Check size={18} />}
                      className="bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold"
                    >
                      Apply AI Suggestions Directly
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Analysis details */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <Card.Title className="text-md flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={16} /> Strengths
                  </Card.Title>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {analysis.strengths}
                  </p>
                </Card>

                <Card>
                  <Card.Title className="text-md flex items-center gap-2 text-amber-600">
                    <AlertTriangle size={16} /> Key Weaknesses
                  </Card.Title>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {analysis.weaknesses}
                  </p>
                </Card>
              </div>

              {/* Skill gap & Keywords arrays */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <Card.Title className="text-sm flex items-center gap-2 text-rose-600">
                    <ListChecks size={16} />
                    Missing Skills
                  </Card.Title>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.missingSkills?.length > 0 ? (
                      analysis.missingSkills.map((s: string, idx: number) => (
                        <Badge key={idx} className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px]">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400">None detected!</span>
                    )}
                  </div>
                </Card>

                <Card>
                  <Card.Title className="text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <ListChecks size={16} />
                    Suggested Skills
                  </Card.Title>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.suggestedSkills?.length > 0 ? (
                      analysis.suggestedSkills.map((s: string, idx: number) => (
                        <Badge key={idx} className="bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-[10px]">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400">None detected!</span>
                    )}
                  </div>
                </Card>

                <Card>
                  <Card.Title className="text-sm flex items-center gap-2 text-amber-600">
                    <AlertCircle size={16} />
                    Missing Keywords
                  </Card.Title>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.missingKeywords?.length > 0 ? (
                      analysis.missingKeywords.map((k: string, idx: number) => (
                        <Badge key={idx} className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px]">
                          {k}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400">None detected!</span>
                    )}
                  </div>
                </Card>
              </div>

              {/* Suggestions panels */}
              <Card>
                <Card.Title className="text-md">Recommended Enhancements</Card.Title>
                <div className="space-y-4 mt-4">
                  <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">General Strategy</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{analysis.suggestedImprovements}</p>
                  </div>
                  <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Keyword Placement</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{analysis.keywordOptimization}</p>
                  </div>
                  <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Work Bullet Points</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{analysis.experienceImprovements}</p>
                  </div>
                  {analysis.recruiterTips && (
                    <div>
                      <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Zap size={12} /> Recruiter Tip
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium italic">"{analysis.recruiterTips}"</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Projects & Certifications suggestions */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <Card.Title className="text-md">Suggested Career Projects</Card.Title>
                  <ul className="mt-3 text-xs space-y-2 text-gray-500 dark:text-gray-400">
                    {analysis.suggestedProjects?.map((p: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <ArrowRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <Card.Title className="text-md">Recommended Certifications</Card.Title>
                  <ul className="mt-3 text-xs space-y-2 text-gray-500 dark:text-gray-400">
                    {analysis.suggestedCertifications?.map((c: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <ArrowRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeMatch;
