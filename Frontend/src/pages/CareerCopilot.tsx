import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Trophy, Compass, Award, Briefcase, BookOpen,
  ShieldAlert, TrendingUp, Rocket, CheckSquare,
  ArrowRight, Star, Flame, Zap, Target, DollarSign, Code2,
  GraduationCap, Mic, FileText, ChevronRight, Play, Search
} from "lucide-react";
import { Select } from "../components/common";
import { toast } from "react-toastify";

// ─── Utility: parse inline bold + bullets ─────────────────────────────────────
const formatInlineElements = (text: string) => {
  if (!text) return null;
  return text.split("\n").map((line, lineIdx) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;
    const bulletMatch = trimmedLine.match(/^([-*•]|\d+\.)\s*(.*)/);
    const isListItem = !!bulletMatch;
    const contentToParse = bulletMatch ? bulletMatch[2] : trimmedLine;
    const parts = contentToParse.split(/(\*\*[^*]+\*\*)/g);
    const parsedLineContent = parts.map((part, partIdx) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={partIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>
      ) : part
    );
    if (isListItem) {
      return (
        <div key={lineIdx} className="flex gap-2 items-start mt-2">
          <span className="text-violet-400 mt-0.5 shrink-0">▸</span>
          <span className="text-sm text-slate-300 leading-relaxed">{parsedLineContent}</span>
        </div>
      );
    }
    return (
      <p key={lineIdx} className="mt-1 text-sm text-slate-300 leading-relaxed">{parsedLineContent}</p>
    );
  });
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(start);
    }, 25);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{display}{suffix}</span>;
};

// ─── AI Confidence Ring ───────────────────────────────────────────────────────
const ConfidenceRing = ({ value }: { value: number }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex items-center gap-2">
      <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
        <circle cx="26" cy="26" r={radius} stroke="#1e293b" strokeWidth="6" fill="none" />
        <motion.circle
          cx="26" cy="26" r={radius}
          stroke="url(#confGrad)" strokeWidth="6" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <p className="text-xs text-slate-400 font-medium">AI Confidence</p>
        <p className="text-lg font-black text-white">
          <AnimatedNumber value={value} suffix="%" />
        </p>
      </div>
    </div>
  );
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
type PriorityType = "high" | "recommended" | "trending" | "job-ready" | "beginner" | "high-demand";
const PRIORITY_CONFIG: Record<PriorityType, { label: string; icon: string; cls: string }> = {
  "high":        { label: "High Priority",  icon: "🔥", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  "recommended": { label: "Recommended",    icon: "⭐", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  "trending":    { label: "Trending",       icon: "🚀", cls: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  "job-ready":   { label: "Job Ready",      icon: "💼", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  "beginner":    { label: "Beginner",       icon: "🎯", cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  "high-demand": { label: "High Demand",    icon: "📈", cls: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
};
const PriorityBadge = ({ type }: { type: PriorityType }) => {
  const cfg = PRIORITY_CONFIG[type];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ─── Gradient Skill Chip ──────────────────────────────────────────────────────
const SKILL_GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-emerald-600 to-teal-600",
  "from-rose-600 to-pink-600",
  "from-amber-600 to-orange-600",
  "from-sky-600 to-cyan-600",
  "from-fuchsia-600 to-purple-600",
];
const SKILL_ICONS: Record<string, string> = {
  react: "⚛", typescript: "🔷", "next.js": "▲", nodejs: "🟢", "node.js": "🟢",
  python: "🐍", postgresql: "🐘", aws: "☁", docker: "🐳", kubernetes: "☸",
  mongodb: "🍃", graphql: "◈", rust: "⚙", go: "🐹", java: "☕",
  vue: "💚", angular: "🅰", tailwind: "🌊", redis: "⚡", git: "🌿",
};
const getSkillIcon = (skill: string) => {
  const lower = skill.toLowerCase();
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "✦";
};

const SkillChip = ({ skill, index }: { skill: string; index: number }) => {
  const grad = SKILL_GRADIENTS[index % SKILL_GRADIENTS.length];
  const icon = getSkillIcon(skill);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${grad} shadow-lg cursor-default select-none`}
    >
      <span>{icon}</span>
      {skill}
    </motion.div>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, color = "indigo" }: { value: number; color?: string }) => {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500 to-violet-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
  };
  return (
    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-2 rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.indigo}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};

// ─── Glass Card ───────────────────────────────────────────────────────────────
const GlassCard = ({
  children,
  className = "",
  glowColor = "indigo",
  accentBorder,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  accentBorder?: string;
}) => {
  const glowMap: Record<string, string> = {
    indigo: "hover:shadow-indigo-500/10",
    emerald: "hover:shadow-emerald-500/10",
    amber: "hover:shadow-amber-500/10",
    violet: "hover:shadow-violet-500/10",
    rose: "hover:shadow-rose-500/10",
    sky: "hover:shadow-sky-500/10",
  };
  const borderMap: Record<string, string> = {
    indigo: "border-indigo-500/50",
    emerald: "border-emerald-500/50",
    amber: "border-amber-500/50",
    violet: "border-violet-500/50",
    rose: "border-rose-500/50",
    sky: "border-sky-500/50",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative rounded-2xl border bg-white/[0.03] backdrop-blur-xl
        shadow-xl hover:shadow-2xl transition-all duration-300
        ${accentBorder ? `border-l-4 ${borderMap[accentBorder]} border-t border-r border-b border-white/8` : "border-white/8"}
        ${glowMap[glowColor] || glowMap.indigo}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// ─── Section Header Icon ──────────────────────────────────────────────────────
const IconBubble = ({
  icon: Icon,
  gradient,
}: {
  icon: React.ElementType;
  gradient: string;
}) => (
  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
    <Icon size={22} className="text-white" />
  </div>
);

// ─── Roadmap Step ─────────────────────────────────────────────────────────────
const RoadmapStep = ({
  step, title, description, color,
}: { step: number | string; title: string; description: string; color: string }) => {
  const colorMap: Record<string, { ring: string; bg: string; line: string }> = {
    indigo: { ring: "border-indigo-500/40", bg: "from-indigo-600 to-violet-600", line: "bg-indigo-500/20" },
    emerald: { ring: "border-emerald-500/40", bg: "from-emerald-600 to-teal-600", line: "bg-emerald-500/20" },
  };
  const c = colorMap[color] || colorMap.indigo;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 group"
    >
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.bg} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-lg ring-4 ${c.ring} z-10`}>
          {step}
        </div>
        <div className={`w-0.5 flex-1 ${c.line} my-1`} />
      </div>
      <div className="pb-5 min-w-0">
        <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// ─── Critique Block ───────────────────────────────────────────────────────────
const renderCritiqueBlock = (text: string, color: "emerald" | "indigo" | "amber") => {
  if (!text) return null;
  const colorMap = {
    emerald: { accent: "text-emerald-400", dot: "bg-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    indigo:  { accent: "text-indigo-400",  dot: "bg-indigo-400",  border: "border-indigo-500/20",  bg: "bg-indigo-500/5" },
    amber:   { accent: "text-amber-400",   dot: "bg-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-500/5" },
  };
  const c = colorMap[color];
  const rawSections = text.split(/(?=\*\*[^*]+\*\*(?::|[ \-]))/g);
  return (
    <div className="space-y-3">
      {rawSections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;
        const headerMatch = trimmed.match(/^\*\*([^*]+)\*\*[:\-\s]*\s*(.*)/s);
        if (headerMatch) {
          return (
            <div key={idx} className={`rounded-xl p-3.5 border ${c.border} ${c.bg}`}>
              <h4 className={`font-bold text-xs flex items-center gap-1.5 mb-1.5 ${c.accent}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {headerMatch[1].trim()}
              </h4>
              <div>{formatInlineElements(headerMatch[2].trim())}</div>
            </div>
          );
        }
        return (
          <div key={idx} className="rounded-xl p-3 border border-white/5 bg-white/[0.02]">
            {formatInlineElements(trimmed)}
          </div>
        );
      })}
    </div>
  );
};

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn = ({
  label, gradient, icon: Icon, onClick,
}: { label: string; gradient: string; icon?: React.ElementType; onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-md hover:shadow-lg transition-all duration-200`}
  >
    {Icon && <Icon size={13} />}
    {label}
    <ArrowRight size={12} />
  </motion.button>
);

// ─── Loading State ────────────────────────────────────────────────────────────
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-6">
    <div className="relative w-20 h-20">
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-indigo-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-1 rounded-full border-4 border-t-violet-500 border-transparent"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles size={22} className="text-violet-400" />
      </div>
    </div>
    <div className="text-center">
      <h3 className="text-lg font-bold text-white">AI Advisor is thinking…</h3>
      <motion.p
        className="text-sm text-slate-400 mt-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        Analyzing career data, salary bands, and skill gaps
      </motion.p>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onConsult }: { onConsult: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-28 gap-6 text-center"
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
    >
      <Compass size={36} className="text-white" />
    </motion.div>
    <div>
      <h3 className="text-2xl font-black text-white">Your AI Copilot Awaits</h3>
      <p className="text-slate-400 mt-2 max-w-sm text-sm leading-relaxed">
        No recommendations yet. Complete your resume analysis to receive personalized AI suggestions.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
      {["Resume Critique", "Skill Gap Analysis", "Salary Insights", "Career Roadmap", "Interview Prep"].map(f => (
        <span key={f} className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/8">
          <Sparkles size={10} className="text-violet-400" /> {f}
        </span>
      ))}
    </div>
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onConsult}
      className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
    >
      <Sparkles size={16} />
      Consult Career Copilot
      <ChevronRight size={16} />
    </motion.button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
const CareerCopilot = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [advice, setAdvice] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(response.data) ? response.data : (response.data?.resumes || []);
      setResumes(list);
      if (list.length > 0) setSelectedResumeId(list[0].id.toString());
    } catch {
      toast.error("Failed to load your resumes.");
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleConsult = async () => {
    setLoadingAdvice(true);
    setAdvice(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/copilot/advice",
        { resumeId: selectedResumeId ? Number(selectedResumeId) : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdvice(response.data);
      toast.success("🚀 AI Career Roadmap loaded!");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load Career Copilot advice.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl pb-16 text-white space-y-8">

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-8 border border-white/8"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0d2318 100%)" }}
      >
        {/* Ambient orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-violet-500/20 to-transparent pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-4">
              <Sparkles size={11} />
              Powered by AI · Career Intelligence
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-violet-200 to-emerald-300 bg-clip-text text-transparent">
              AI Career Copilot
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-xl leading-relaxed">
              Get automated resume critiques, skill-gap analysis, personalized learning pathways,
              salary benchmarks, and career roadmaps — all powered by AI.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <ConfidenceRing value={advice ? 94 : 0} />
            <div className="hidden md:flex flex-col gap-2">
              {(["Resume Audit", "Skill Gaps", "Salary Intel", "Roadmaps"] as const).map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Controls + Capabilities ──────────────────────────────── */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Advisor Controls */}
        <GlassCard glowColor="indigo" className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <IconBubble icon={Target} gradient="from-indigo-600 to-violet-600" />
            <div>
              <h3 className="font-bold text-white text-base">Advisor Controls</h3>
              <p className="text-xs text-slate-400">Select your profile</p>
            </div>
          </div>
          <div className="space-y-4">
            {loadingResumes ? (
              <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
            ) : (
              <Select
                label="Analyze Resume Profile"
                value={selectedResumeId}
                options={[
                  { label: "Default / New Profile", value: "" },
                  ...resumes.map((r) => ({ label: r.title, value: r.id.toString() })),
                ]}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              />
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConsult}
              disabled={loadingAdvice}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-60 transition-all duration-200"
            >
              {loadingAdvice ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Sparkles size={16} /></motion.div> Computing Roadmaps…</>
              ) : (
                <><Sparkles size={16} /> Consult Career Copilot</>
              )}
            </motion.button>
          </div>
        </GlassCard>

        {/* Capabilities */}
        <GlassCard glowColor="violet" className="md:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-5">
            <IconBubble icon={Rocket} gradient="from-violet-600 to-fuchsia-600" />
            <div>
              <h3 className="font-bold text-white text-base">Copilot Capabilities</h3>
              <p className="text-xs text-slate-400">What your AI advisor can do</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: "Resume Audit",      gradient: "from-emerald-600 to-teal-600",   desc: "Full critique" },
              { icon: Search,   label: "Skill Gap Scan",    gradient: "from-indigo-600 to-blue-600",    desc: "Market trends" },
              { icon: DollarSign, label: "Salary Intel",    gradient: "from-amber-600 to-orange-600",   desc: "Wage bands" },
              { icon: Compass,  label: "Career Roadmap",    gradient: "from-violet-600 to-fuchsia-600", desc: "Milestones" },
              { icon: Mic,      label: "Interview Prep",    gradient: "from-rose-600 to-pink-600",      desc: "Questions & tips" },
              { icon: GraduationCap, label: "Courses",      gradient: "from-sky-600 to-cyan-600",       desc: "Learning paths" },
              { icon: Code2,    label: "Portfolio Ideas",   gradient: "from-teal-600 to-emerald-600",   desc: "Project outlines" },
              { icon: Briefcase, label: "Job Matching",     gradient: "from-purple-600 to-violet-600",  desc: "Best-fit roles" },
            ].map(({ icon: Icon, label, gradient, desc }) => (
              <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/6 hover:border-white/15 hover:bg-white/[0.05] transition-all group cursor-default">
                <div className={`w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{label}</p>
                  <p className="text-[10px] text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Results Board ────────────────────────────────────────── */}
      <div ref={resultsRef}>
        <AnimatePresence mode="wait">
          {loadingAdvice && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-6">
                <LoadingState />
              </GlassCard>
            </motion.div>
          )}

          {!loadingAdvice && !advice && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-6">
                <EmptyState onConsult={handleConsult} />
              </GlassCard>
            </motion.div>
          )}

          {!loadingAdvice && advice && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* ── Row 1: Resume Critique · Actionable Improvements · Skill Gap (3 cols) */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">

                {/* Resume Critique */}
                <GlassCard accentBorder="emerald" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconBubble icon={Trophy} gradient="from-emerald-600 to-teal-600" />
                      <div>
                        <PriorityBadge type="high" />
                        <h3 className="font-black text-white text-base mt-1">AI Resume Critique</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Detailed analysis of your resume's strengths and improvement areas.</p>
                  <div className="flex-1">{renderCritiqueBlock(advice.resumeReview, "emerald")}</div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="Improve Resume" gradient="from-emerald-600 to-teal-600" icon={FileText} />
                  </div>
                </GlassCard>

                {/* Actionable Improvements */}
                <GlassCard accentBorder="indigo" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconBubble icon={CheckSquare} gradient="from-indigo-600 to-violet-600" />
                      <div>
                        <PriorityBadge type="recommended" />
                        <h3 className="font-black text-white text-base mt-1">Actionable Improvements</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Concrete steps to make your resume stand out to recruiters.</p>
                  <div>{renderCritiqueBlock(advice.resumeImprovements, "indigo")}</div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="Apply Changes" gradient="from-indigo-600 to-violet-600" icon={Zap} />
                  </div>
                </GlassCard>

                {/* Market Skill Gap */}
                <GlassCard accentBorder="amber" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconBubble icon={ShieldAlert} gradient="from-amber-600 to-orange-600" />
                      <div>
                        <PriorityBadge type="high-demand" />
                        <h3 className="font-black text-white text-base mt-1">Skill Gap Analysis</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Skills the market demands that aren't fully reflected in your profile.</p>
                  <div>{formatInlineElements(advice.skillGapAnalysis)}</div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="Learn Missing Skills" gradient="from-amber-600 to-orange-600" icon={Rocket} />
                  </div>
                </GlassCard>
              </div>

              {/* ── Row 2: Career Roadmap + Interview Prep (2 cols) */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">

                {/* Career Roadmap */}
                <GlassCard className="p-6" glowColor="indigo">
                  <div className="flex items-center gap-3 mb-6">
                    <IconBubble icon={Compass} gradient="from-indigo-600 to-violet-600" />
                    <div>
                      <PriorityBadge type="trending" />
                      <h3 className="font-black text-white text-base mt-1">Milestone Career Roadmap</h3>
                    </div>
                  </div>
                  <div>
                    {advice.careerRoadmap?.map((item: any, idx: number) => (
                      <RoadmapStep key={idx} step={item.step || idx + 1} title={item.title} description={item.description} color="indigo" />
                    ))}
                  </div>
                  <div className="mt-2 pt-4 border-t border-white/5">
                    <ActionBtn label="View Full Roadmap" gradient="from-indigo-600 to-violet-600" icon={Compass} />
                  </div>
                </GlassCard>

                {/* Interview Prep */}
                <GlassCard className="p-6" glowColor="emerald">
                  <div className="flex items-center gap-3 mb-6">
                    <IconBubble icon={Mic} gradient="from-emerald-600 to-teal-600" />
                    <div>
                      <PriorityBadge type="job-ready" />
                      <h3 className="font-black text-white text-base mt-1">Interview Prep Roadmap</h3>
                    </div>
                  </div>
                  <div>
                    {advice.interviewPrepRoadmap?.map((item: any, idx: number) => (
                      <RoadmapStep key={idx} step={item.step || idx + 1} title={item.topic} description={item.description} color="emerald" />
                    ))}
                  </div>
                  <div className="mt-2 pt-4 border-t border-white/5">
                    <ActionBtn label="Practice Interview" gradient="from-emerald-600 to-teal-600" icon={Mic} />
                  </div>
                </GlassCard>
              </div>

              {/* ── Row 3: Skills · Salary · Certifications (3 cols) */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">

                {/* Recommended Skills */}
                <GlassCard className="p-6" glowColor="violet">
                  <div className="flex items-center gap-3 mb-4">
                    <IconBubble icon={Zap} gradient="from-violet-600 to-fuchsia-600" />
                    <div>
                      <PriorityBadge type="trending" />
                      <h3 className="font-black text-white text-base mt-1">Recommended Skills</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Most valuable technologies to accelerate your career.</p>
                  <div className="flex flex-wrap gap-2">
                    {advice.recommendedSkills?.map((s: string, idx: number) => (
                      <SkillChip key={idx} skill={s} index={idx} />
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="View Skill Roadmap" gradient="from-violet-600 to-fuchsia-600" icon={BookOpen} />
                  </div>
                </GlassCard>

                {/* Salary Insights */}
                <GlassCard className="p-6" glowColor="amber">
                  <div className="flex items-center gap-3 mb-4">
                    <IconBubble icon={TrendingUp} gradient="from-amber-600 to-orange-600" />
                    <div>
                      <PriorityBadge type="high-demand" />
                      <h3 className="font-black text-white text-base mt-1">Salary & Market Intel</h3>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between rounded-xl p-3 bg-amber-500/8 border border-amber-500/15">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Annual Range</p>
                        <p className="text-base font-black text-white mt-0.5">{advice.salaryInsights?.range || "N/A"}</p>
                      </div>
                      <DollarSign size={20} className="text-amber-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/6">
                        <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Market Demand</p>
                        <p className="text-sm font-black text-emerald-400 mt-0.5">{advice.salaryInsights?.marketDemand || "High"}</p>
                      </div>
                      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/6">
                        <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Growth Rate</p>
                        <p className="text-sm font-black text-amber-400 mt-0.5">+133%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Salary Potential</span><span className="font-bold text-white">80%</span>
                      </div>
                      <ProgressBar value={80} color="amber" />
                    </div>
                  </div>

                  <details className="group">
                    <summary className="text-xs font-bold text-amber-400 cursor-pointer flex items-center gap-1 hover:text-amber-300">
                      <ChevronRight size={12} className="group-open:rotate-90 transition-transform" />
                      Negotiation Tips
                    </summary>
                    <div className="mt-2">{formatInlineElements(advice.salaryInsights?.advice)}</div>
                  </details>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <ActionBtn label="Explore Market Data" gradient="from-amber-600 to-orange-600" icon={TrendingUp} />
                  </div>
                </GlassCard>

                {/* Certifications */}
                <GlassCard className="p-6" glowColor="sky">
                  <div className="flex items-center gap-3 mb-4">
                    <IconBubble icon={Award} gradient="from-sky-600 to-cyan-600" />
                    <div>
                      <PriorityBadge type="recommended" />
                      <h3 className="font-black text-white text-base mt-1">Recommended Certs</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Industry-recognized certifications to boost your profile.</p>
                  <div className="space-y-2.5">
                    {advice.recommendedCertifications?.map((c: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/6 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{c.provider}</p>
                        </div>
                        <span className="shrink-0 ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400">
                          🏆 Valued
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="Start Learning" gradient="from-sky-600 to-cyan-600" icon={GraduationCap} />
                  </div>
                </GlassCard>
              </div>

              {/* ── Row 4: Learning Paths + Portfolio Projects (2 cols) */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">

                {/* Learning Pathways */}
                <GlassCard className="p-6" glowColor="indigo">
                  <div className="flex items-center gap-3 mb-4">
                    <IconBubble icon={BookOpen} gradient="from-indigo-600 to-sky-600" />
                    <div>
                      <PriorityBadge type="beginner" />
                      <h3 className="font-black text-white text-base mt-1">Recommended Learning Pathways</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {advice.learningResources?.map((res: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        className="group p-3 rounded-xl border border-white/6 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white">{res.topic}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">{res.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{res.platform} · {res.resource}</p>
                        <div className="mt-2">
                          <ProgressBar value={Math.min(90, 40 + idx * 15)} color="indigo" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="Browse All Courses" gradient="from-indigo-600 to-sky-600" icon={Play} />
                  </div>
                </GlassCard>

                {/* Portfolio Projects */}
                <GlassCard className="p-6" glowColor="emerald">
                  <div className="flex items-center gap-3 mb-4">
                    <IconBubble icon={Code2} gradient="from-emerald-600 to-teal-600" />
                    <div>
                      <PriorityBadge type="job-ready" />
                      <h3 className="font-black text-white text-base mt-1">Portfolio Project Ideas</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {advice.portfolioSuggestions?.map((proj: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        className="group p-3.5 rounded-xl border border-white/6 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-xs font-black text-white">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{proj.title}</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <ActionBtn label="Generate Project" gradient="from-emerald-600 to-teal-600" icon={Code2} />
                  </div>
                </GlassCard>
              </div>

              {/* ── Row 5: Target Jobs & Strategy (Full Width) */}
              <GlassCard className="p-6" glowColor="violet">
                <div className="flex items-center gap-3 mb-6">
                  <IconBubble icon={Briefcase} gradient="from-violet-600 to-purple-600" />
                  <div>
                    <PriorityBadge type="high" />
                    <h3 className="font-black text-white text-xl mt-1">Target Jobs & Strategy Playbook</h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Recommended Roles */}
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Star size={10} className="text-violet-400" /> Recommended Roles
                    </h5>
                    <div className="space-y-2.5">
                      {advice.jobRecommendations?.map((job: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          className="p-3 rounded-xl bg-violet-500/8 border border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/12 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Flame size={11} className="text-violet-400 shrink-0" />
                            <p className="text-xs font-bold text-white group-hover:text-violet-200">{job.title}</p>
                          </div>
                          <p className="text-[10px] text-slate-400 pl-4">{job.companies}</p>
                          <p className="text-[10px] text-violet-400 pl-4 mt-0.5">{job.relevance}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Job Search Playbook */}
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Search size={10} className="text-indigo-400" /> Job Search Playbook
                    </h5>
                    <div className="p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20 h-[calc(100%-2rem)]">
                      {formatInlineElements(advice.jobSearchTips)}
                    </div>
                  </div>

                  {/* Growth Tips */}
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <TrendingUp size={10} className="text-emerald-400" /> Growth & Promotion Tips
                    </h5>
                    <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 h-[calc(100%-2rem)]">
                      {formatInlineElements(advice.careerAdvice)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-3">
                  <ActionBtn label="Find Jobs" gradient="from-violet-600 to-purple-600" icon={Search} />
                  <ActionBtn label="Career Strategy" gradient="from-indigo-600 to-violet-600" icon={TrendingUp} />
                </div>
              </GlassCard>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerCopilot;
