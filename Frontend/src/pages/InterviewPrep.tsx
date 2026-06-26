import { useState } from "react";
import axios from "axios";
import { Sparkles, Trophy, Lightbulb, CheckCircle2, AlertTriangle, MessageSquareCode, HelpCircle, Star } from "lucide-react";
import { Button, Card, Input, Textarea, Badge } from "../components/common";
import { toast } from "react-toastify";

const categories = ["HR", "Technical", "Behavioral", "Company Specific"];
const difficulties = ["Easy", "Medium", "Hard"];

const InterviewPrep = () => {
  const [category, setCategory] = useState("HR");
  const [difficulty, setDifficulty] = useState("Medium");
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    setFeedback(null);
    setUserAnswer("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/interview/questions",
        { category, difficulty, jobRole },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setQuestions(response.data);
      setActiveQuestionIndex(0);
      toast.success("5 fresh questions generated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate questions. Please retry.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please enter your answer first.");
      return;
    }
    setLoadingFeedback(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/interview/feedback",
        {
          question: questions[activeQuestionIndex].question,
          answer: userAnswer,
          difficulty,
          category
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFeedback(response.data);
      toast.success("AI feedback generated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate AI feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 text-slate-800 dark:text-white pb-10">
      {/* Premium Header */}
      <div className="rounded-3xl bg-linear-to-r from-gray-950 via-purple-950 to-indigo-950 p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
        <Badge className="bg-white/10 text-purple-200 ring-purple-500/30">
          Interview Preparation Workspace
        </Badge>
        <h1 className="mt-4 text-3xl font-black">AI-Powered Interview Coach</h1>
        <p className="mt-2 text-sm text-purple-100 max-w-2xl">
          Generate HR, Technical, Behavioral, and Company specific questions tailored to your target job. 
          Provide your answers and receive instant constructive AI reviews.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Configuration Card */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-purple-500" />
              <Card.Title>Setup Interview</Card.Title>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Question Category</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                        category === cat
                          ? "border-purple-500 bg-purple-550/10 text-purple-600 dark:text-purple-400"
                          : "border-gray-250 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Difficulty Level</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                        difficulty === diff
                          ? "border-purple-500 bg-purple-550/10 text-purple-600 dark:text-purple-400"
                          : "border-gray-250 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Target Job Role (Optional)"
                placeholder="e.g. Senior Frontend Engineer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />

              <Button
                onClick={handleGenerateQuestions}
                isLoading={loadingQuestions}
                fullWidth
                className="bg-gradient-to-r from-purple-600 to-indigo-600 mt-2 text-sm py-3.5"
              >
                Generate 5 Questions
              </Button>
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-slate-100/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-amber-500" size={18} />
              <Card.Title className="text-md">Pro Preparation Tips</Card.Title>
            </div>
            <ul className="text-xs space-y-2 text-gray-500 dark:text-gray-400 leading-relaxed">
              <li className="flex gap-1.5">
                <Star size={14} className="text-purple-500 shrink-0 mt-0.5" />
                <span>Use the <strong>STAR method</strong> (Situation, Task, Action, Result) for behavioral prompts.</span>
              </li>
              <li className="flex gap-1.5">
                <Star size={14} className="text-purple-500 shrink-0 mt-0.5" />
                <span>Quantify your achievements: mention impact, performance gains, and specific stats.</span>
              </li>
              <li className="flex gap-1.5">
                <Star size={14} className="text-purple-500 shrink-0 mt-0.5" />
                <span>Keep your answers structured, professional, and directly linked to core job requirements.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Practice Panel */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <Card className="flex flex-col items-center justify-center text-center py-20 min-h-96">
              <HelpCircle size={48} className="text-purple-500 animate-pulse mb-4" />
              <h3 className="text-xl font-bold">No Questions Generated</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                Choose a category and difficulty on the left, then click Generate to begin your practice interview.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Question Indicators */}
              <div className="flex flex-wrap gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      setUserAnswer("");
                      setFeedback(null);
                    }}
                    className={`h-10 px-4 rounded-xl border font-bold text-xs transition ${
                      activeQuestionIndex === idx
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/25"
                        : "border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Question Box */}
              <Card className="border-l-4 border-purple-500">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Question {activeQuestionIndex + 1} of 5
                </span>
                <p className="mt-2 text-lg font-bold leading-relaxed text-slate-900 dark:text-white">
                  {questions[activeQuestionIndex].question}
                </p>
              </Card>

              {/* Input Area */}
              <div className="space-y-3">
                <Textarea
                  label="Your Response"
                  placeholder="Type your structured answer here. Speak freely and include relevant experience..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="min-h-48 text-sm"
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitAnswer}
                    isLoading={loadingFeedback}
                    leftIcon={<MessageSquareCode size={18} />}
                    className="bg-purple-600 hover:bg-purple-700 py-3"
                  >
                    Analyze Answer & Get AI Feedback
                  </Button>
                </div>
              </div>

              {/* Feedback Section */}
              {loadingFeedback && (
                <Card className="text-center py-12 space-y-4">
                  <Sparkles className="animate-spin text-purple-500 mx-auto" size={32} />
                  <h4 className="font-bold text-lg">AI Coach is reviewing your response...</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto animate-pulse">
                    Evaluating content depth, vocabulary alignment, strengths, and areas for improvement.
                  </p>
                </Card>
              )}

              {feedback && (
                <div className="grid gap-6 md:grid-cols-[160px_1fr] items-start">
                  {/* Score Indicator */}
                  <Card className="text-center flex flex-col items-center justify-center p-5">
                    <span className="text-xs font-bold text-gray-500 uppercase">Score</span>
                    <div className="relative flex items-center justify-center mt-3 h-24 w-24">
                      {/* SVG Circle Progress */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200 dark:text-slate-800"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * feedback.score) / 100}
                          className="text-purple-600 dark:text-purple-500"
                        />
                      </svg>
                      <span className="absolute text-2xl font-black text-slate-900 dark:text-white">
                        {feedback.score}
                      </span>
                    </div>
                    <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Excellent Job
                    </span>
                  </Card>

                  {/* Feedback Details */}
                  <div className="space-y-4">
                    <Card>
                      <Card.Title className="text-md flex items-center gap-2">
                        <Trophy className="text-amber-500" size={18} />
                        Evaluation Summary
                      </Card.Title>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                        {feedback.feedback}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div>
                          <h5 className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 size={14} /> Strengths
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            {feedback.strengths}
                          </p>
                        </div>
                        <div>
                          <h5 className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                            <AlertTriangle size={14} /> Weaknesses
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            {feedback.weaknesses}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Coach's Improvement Tips
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                          {feedback.tips}
                        </p>
                      </div>
                    </Card>

                    {/* Model Answer Box */}
                    <Card className="border-l-4 border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5">
                      <Card.Title className="text-md text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Ideal Model Answer
                      </Card.Title>
                      <p className="text-xs text-gray-650 dark:text-gray-350 mt-2 whitespace-pre-wrap leading-relaxed">
                        {feedback.modelAnswer}
                      </p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
