import { CheckCircle, FileText, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const AtsScore = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState({
    keywordsMatch: "Waiting...",
    formatting: "Waiting...",
    readability: "Waiting...",
    recruiterFriendly: "Waiting...",
  });

  // handle file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please upload a file first");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      // "application/msword",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload only PDF, DOC, or DOCX file");
      return;
    }
    setResumeFile(file);
  };

  const handleCheckScore = async () => {
    if (!resumeFile) {
      console.log("Button clicked");
      console.log("Selected file:", resumeFile);
      alert("Upload resume first.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

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
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong while checking ATS score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-300">
              <FileText size={30} />
            </div>
            <h1 className="text-4xl font-black md:text-5xl">
              ATS Score Checker
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Upload your resume and check how well it matches ATS systems,
              recruiter expectations, keywords, formatting, and readability.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold">Upload Resume</h2>
              <p className="mt-2 text-sm text-gray-400">
                Supported format: PDF only
              </p>
              <label
                htmlFor="resume-upload"
                className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-400/40 bg-purple-500/10 px-6 py-12 text-center hover:bg-purple-500/20 transition"
              >
                {resumeFile ? (
                  <>
                    <CheckCircle size={42} className="text-purple-400" />
                    <span className="mt-4 font-semibold text-purple-300">
                      File Selected
                    </span>
                    <span className="mt-2 text-sm text-gray-300">
                      {resumeFile.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={40} className="text-purple-300" />
                    <span className="mt-4 font-semibold">
                      Click to upload your resume
                    </span>
                    <span className="mt-1 text-sm text-gray-400">
                      or drag and drop file here
                    </span>
                  </>
                )}

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              <button
                onClick={handleCheckScore}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-500 hover:scale-[1.03] disabled:opacity-60"
              >
                {loading ? "Checking..." : "Check ATS Score "}
              </button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="text-purple-300" />
                <h2 className="text-2xl font-bold">Result Preview</h2>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-purple-500/40 text-4xl font-black">
                  {score}%
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <ScoreItem
                  title="Keywords Match"
                  value={result.keywordsMatch}
                />
                <ScoreItem title="Formatting" value={result.formatting} />
                <ScoreItem title="Readability" value={result.readability} />
                <ScoreItem
                  title="Recruiter Friendly"
                  value={result.recruiterFriendly}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const ScoreItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border border-white/10
      bg-white/5 px-5 py-4 transition-all duration-300 hover:translate-x-2
      hover:border-purple-400/50 hover:bg-purple-500/10"
    >
      <span className="text-gray-300">{title}</span>
      <span className="font-semibold text-purple-300">{value}</span>
    </div>
  );
};

export default AtsScore;
