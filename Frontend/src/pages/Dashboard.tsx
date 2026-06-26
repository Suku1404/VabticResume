import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  TrendingUp,
  Download,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Share2,
  Activity,
  Clock,
  Clipboard,
  ExternalLink,
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  Archive,
  ArchiveRestore,
  QrCode
} from "lucide-react";
import { Button, Card, Badge, Modal, Input, Select } from "../components/common";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "./Footer";
import { templateMap } from "../templates";
import { downloadResumePdf } from "../utils/downloadResumePdf";
import { templates } from "../data/template";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Resumes list & pagination states
  const [resumes, setResumes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalResumes: 0,
    avgAtsScore: "0%",
    totalDownloads: 0,
    totalViews: 0,
    aiImprovementsUsed: 0,
    lastEditedResume: null
  });
  const [loading, setLoading] = useState(true);

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedSort, setSelectedSort] = useState("updated_at");
  const [selectedSortOrder, setSelectedSortOrder] = useState("DESC");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "archived">("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Modals state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeResume, setActiveResume] = useState<any>(null);

  // Input states
  const [renameTitle, setRenameTitle] = useState("");
  const [shareEnabled, setShareEnabled] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareExpiry, setShareExpiry] = useState("");

  // Hidden PDF downloader state
  const [downloadingResumeData, setDownloadingResumeData] = useState<any>(null);

  // Dropdown active menus mapping
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Build query parameters
      const params: any = {
        page,
        limit,
        sortBy: selectedSort,
        sortOrder: selectedSortOrder,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedTemplate) params.template = selectedTemplate;
      
      if (activeTab === "favorites") {
        params.favorite = "true";
        params.archived = "false";
      } else if (activeTab === "archived") {
        params.archived = "true";
      } else {
        params.archived = "false";
      }

      // Fetch Resumes
      const resumesRes = await axios.get("http://localhost:3000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setResumes(resumesRes.data.resumes);
      setTotalPages(resumesRes.data.pagination.totalPages || 1);

      // Fetch Stats
      const statsRes = await axios.get("http://localhost:3000/api/analytics/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Fetch Activities
      const actRes = await axios.get("http://localhost:3000/api/analytics/activities", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(actRes.data);

    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [page, selectedSort, selectedSortOrder, selectedTemplate, activeTab]);

  // Handle search with button click or enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDashboardData();
  };

  const handleDuplicate = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/api/resumes/${id}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Resume duplicated!");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate resume.");
    }
    setOpenMenuId(null);
  };

  const handleRename = async () => {
    if (!renameTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/resumes/${activeResume.id}/rename`,
        { title: renameTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Resume renamed!");
      setIsRenameOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename resume.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/resumes/${activeResume.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Resume deleted permanently.");
      setIsDeleteOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume.");
    }
  };

  const handleToggleFavorite = async (resume: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/resumes/${resume.id}/favorite`,
        { favorite: !resume.is_favorite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(resume.is_favorite ? "Removed from Favorites" : "Added to Favorites");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorite status.");
    }
    setOpenMenuId(null);
  };

  const handleToggleArchive = async (resume: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/resumes/${resume.id}/archive`,
        { archive: !resume.is_archived },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(resume.is_archived ? "Resume Restored" : "Resume Archived");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update archive status.");
    }
    setOpenMenuId(null);
  };

  const handleShareToggle = async (enable: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/api/resumes/${activeResume.id}/share`,
        { enable, expiration: shareExpiry || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShareEnabled(enable);
      if (enable && res.data.share_id) {
        const link = `${window.location.origin}/shared/${res.data.share_id}`;
        setShareLink(link);
        toast.success("Resume shared successfully!");
      } else {
        setShareLink("");
        setShareExpiry("");
        toast.success("Public sharing disabled.");
      }
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to configure sharing options.");
    }
  };

  const handleDownloadPdf = async (resume: any) => {
    setOpenMenuId(null);
    setDownloadingResumeData(resume);
    toast.info("Preparing PDF compiler...");

    setTimeout(async () => {
      const previewElement = document.getElementById("hidden-resume-download-element");
      if (!previewElement) {
        toast.error("PDF compiler failed to mount.");
        setDownloadingResumeData(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const fileName = `${resume.title || "resume"}.pdf`;
        await downloadResumePdf(previewElement, fileName);
        
        await axios.post(
          `http://localhost:3000/api/resumes/${resume.id}/download`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success("Download started!");
        fetchDashboardData();
      } catch (err) {
        console.error(err);
        toast.error("PDF generation failed.");
      } finally {
        setDownloadingResumeData(null);
      }
    }, 400);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Shareable link copied!");
  };

  const statsList = [
    { title: "Total Resumes", value: stats.totalResumes.toString(), icon: FileText, color: "text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40" },
    { title: "AI Improvements Used", value: stats.aiImprovementsUsed.toString(), icon: Sparkles, color: "text-violet-650 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40" },
    { title: "ATS Profile Score", value: stats.avgAtsScore, icon: TrendingUp, color: "text-emerald-650 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" }
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-6 transition-colors duration-300">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* Welcome Banner */}
          <div className="rounded-3xl bg-linear-to-r from-gray-950 via-indigo-950 to-violet-950 p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
            <Badge className="bg-white/10 text-white ring-white/20">
              Premium Resume Workspace
            </Badge>

            <h1 className="mt-5 text-3xl font-black">
              Build resumes that stand out.
            </h1>
            <p className="mt-2.5 max-w-xl text-xs text-gray-300 leading-relaxed">
              Verify ATS compatibility scores, manage versions history, create selectable vector PDF exports, and share templates.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button onClick={() => navigate("/user/templates")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md">
                <Plus size={16} className="mr-1.5" /> Create New Resume
              </Button>
              <Button variant="outline" className="border-white/25 hover:bg-white/10 text-white" onClick={() => navigate("/ai-resume-improve")}>
                <Sparkles size={16} className="mr-1.5" /> Optimize with AI
              </Button>
            </div>
          </div>


          {/* Stats Analytics */}
          <div className="grid gap-5 md:grid-cols-3">
            {statsList.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{item.title}</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{item.value}</h2>
                    </div>
                    <div className={`rounded-xl p-3 shrink-0 ${item.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Full-Width Sections */}
          <div className="space-y-6">
            
            {/* Left side: Resumes Library */}
            <Card>
              {/* Library Header Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-3">
                <div className="flex gap-2">
                  {(["all", "favorites", "archived"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize transition ${
                        activeTab === tab
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/5"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg border ${
                      viewMode === "grid" ? "border-indigo-500 text-indigo-500 bg-indigo-500/10" : "border-gray-250 dark:border-white/5"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg border ${
                      viewMode === "list" ? "border-indigo-500 text-indigo-500 bg-indigo-500/10" : "border-gray-250 dark:border-white/5"
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>

              {/* Advanced Filter Toolbar */}
              <form onSubmit={handleSearchSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-100/50 dark:bg-slate-900/30 p-3 rounded-2xl border dark:border-white/5">
                <div className="sm:col-span-2 relative flex items-center">
                  <Input
                    placeholder="Search resumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs h-9 bg-white dark:bg-[#030712]"
                  />
                  <Search size={14} className="absolute left-3 text-gray-400" />
                </div>

                <Select
                  aria-label="Filter template"
                  value={selectedTemplate}
                  options={[
                    { label: "All Templates", value: "" },
                    ...templates.map((t: any) => ({ label: t.name, value: t.id }))
                  ]}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs h-9 py-1.5 bg-white dark:bg-[#030712]"
                />

                <Select
                  aria-label="Sorting key"
                  value={`${selectedSort}-${selectedSortOrder}`}
                  options={[
                    { label: "Recently Updated", value: "updated_at-DESC" },
                    { label: "Oldest Updated", value: "updated_at-ASC" },
                    { label: "Newest Created", value: "created_at-DESC" },
                    { label: "Title (A-Z)", value: "title-ASC" }
                  ]}
                  onChange={(e) => {
                    const [key, order] = e.target.value.split("-");
                    setSelectedSort(key);
                    setSelectedSortOrder(order);
                    setPage(1);
                  }}
                  className="text-xs h-9 py-1.5 bg-white dark:bg-[#030712]"
                />
              </form>

              {/* Grid / List render content */}
              {loading ? (
                <div className="space-y-4 py-8">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="h-16 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3 animate-bounce" />
                  <p className="font-bold text-lg text-slate-800 dark:text-white">No Resumes Found</p>
                  <p className="text-xs mt-1 mb-5">Try matching another keyword or create a new profile!</p>
                  <Button onClick={() => navigate("/user/templates")}>
                    Build New Resume
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                /* GRID VIEW */
                <div className="grid gap-4 sm:grid-cols-2 mt-5">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="border border-gray-250 dark:border-white/5 bg-gray-50/50 dark:bg-slate-900/40 p-4 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition flex flex-col justify-between h-44 relative"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold capitalize text-[10px]">
                            {resume.template || "ATS"}
                          </Badge>

                          <div className="flex gap-1">
                            {resume.is_favorite && <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                            {resume.is_archived && <Archive size={14} className="text-gray-400 shrink-0" />}
                          </div>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2.5 truncate max-w-[220px]">
                          {resume.title || "Untitled Resume"}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1.5">
                          <Clock size={10} /> Edited {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/5 pt-3 mt-3">
                        <Badge className={resume.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                          {resume.status || "Draft"}
                        </Badge>

                        {/* Actions drop menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === resume.id ? null : resume.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition"
                            title="Actions Menu"
                          >
                            <MoreVertical size={14} />
                          </button>
                          
                          {openMenuId === resume.id && (
                            <div className="absolute right-0 bottom-8 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 rounded-xl shadow-xl z-20 overflow-hidden text-xs py-1">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(`/builder/${resume.template}/${resume.id}`);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Edit size={13} className="text-indigo-500" /> Continue Editing
                              </button>
                              <button
                                onClick={() => handleToggleFavorite(resume)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Star size={13} className="text-indigo-500" /> {resume.is_favorite ? "Unfavorite" : "Favorite"}
                              </button>
                              <button
                                onClick={() => handleToggleArchive(resume)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                {resume.is_archived ? (
                                  <>
                                    <ArchiveRestore size={13} className="text-indigo-500" /> Restore
                                  </>
                                ) : (
                                  <>
                                    <Archive size={13} className="text-indigo-500" /> Archive
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDuplicate(resume.id)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Copy size={13} className="text-indigo-500" /> Duplicate
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setActiveResume(resume);
                                  setRenameTitle(resume.title);
                                  setIsRenameOpen(true);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Edit size={13} className="text-indigo-500" /> Rename
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setActiveResume(resume);
                                  setShareEnabled(!!resume.share_id);
                                  setShareLink(resume.share_id ? `${window.location.origin}/shared/${resume.share_id}` : "");
                                  setShareExpiry(resume.share_expiration ? new Date(resume.share_expiration).toISOString().substring(0, 16) : "");
                                  setIsShareOpen(true);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Share2 size={13} className="text-indigo-500" /> Share Link & QR
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(resume)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Download size={13} className="text-indigo-500" /> Download PDF
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setActiveResume(resume);
                                  setIsDeleteOpen(true);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-650 text-left font-bold border-t border-gray-100 dark:border-white/5"
                              >
                                <Trash2 size={13} className="text-red-500" /> Delete
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="mt-5 space-y-2.5">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-slate-900/40 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-900 transition text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 shrink-0">
                          {resume.is_favorite && <Star size={13} className="text-amber-500 fill-amber-500" />}
                          {resume.is_archived && <Archive size={13} className="text-gray-400" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{resume.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Template: {resume.template} • Saved {new Date(resume.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={resume.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-indigo-500/10 text-indigo-600"}>
                          {resume.status || "Draft"}
                        </Badge>

                        {/* List Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === resume.id ? null : resume.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition"
                            title="Actions Menu"
                          >
                            <MoreVertical size={14} />
                          </button>
                          
                          {openMenuId === resume.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 rounded-xl shadow-xl z-20 overflow-hidden text-xs py-1">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(`/builder/${resume.template}/${resume.id}`);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Edit size={12} className="text-indigo-500" /> Continue Editing
                              </button>
                              <button
                                onClick={() => handleToggleFavorite(resume)}
                                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Star size={12} className="text-indigo-500" /> {resume.is_favorite ? "Unfavorite" : "Favorite"}
                              </button>
                              <button
                                onClick={() => handleToggleArchive(resume)}
                                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                {resume.is_archived ? "Restore" : "Archive"}
                              </button>
                              <button
                                onClick={() => handleDuplicate(resume.id)}
                                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Copy size={12} className="text-indigo-500" /> Duplicate
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(resume)}
                                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold"
                              >
                                <Download size={12} className="text-indigo-500" /> Download PDF
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setActiveResume(resume);
                                  setIsDeleteOpen(true);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-555/10 text-red-650 text-left font-bold"
                              >
                                <Trash2 size={12} className="text-red-500" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/5 pt-4 mt-6">
                  <span className="text-[10px] text-gray-500 font-semibold">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      leftIcon={<ChevronLeft size={14} />}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      rightIcon={<ChevronRight size={14} />}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

            </Card>

            {/* Right side: Activity log */}
            <Card>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
                <Activity className="text-indigo-650 dark:text-indigo-400" size={18} />
                <Card.Title className="text-md">Recent Activity</Card.Title>
              </div>

              {loading ? (
                <div className="space-y-4 py-4">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="h-10 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No recent activities.</p>
              ) : (
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-800">
                  {activities.map((act) => (
                    <div key={act.id} className="flex gap-4 relative">
                      <div className="h-6 w-6 rounded-full bg-indigo-650/10 border-4 border-white dark:border-[#030712] flex items-center justify-center text-indigo-500 shrink-0 z-10">
                        <Activity size={10} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-gray-200 leading-normal">
                          {act.details}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(act.created_at).toLocaleDateString()} at {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Resume"
        description="Are you absolutely sure you want to delete this resume? This action is permanent."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button className="bg-red-650 hover:bg-red-700" onClick={handleDelete}>Delete Permanently</Button>
          </>
        }
      >
        <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">
          Resume: <span className="text-red-500 font-bold">"{activeResume?.title}"</span>
        </p>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Rename Resume"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Rename</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Resume Title"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            placeholder="e.g. Work Resume v2"
            required
          />
        </div>
      </Modal>

      {/* Share Modal with Expiration and QR Code */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Settings"
        description="Public URL links allow easy resume access for job applications."
        size="md"
        footer={
          <Button onClick={() => setIsShareOpen(false)}>Close</Button>
        }
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3.5 bg-slate-100/50 dark:bg-slate-900 rounded-2xl border dark:border-white/5">
            <div>
              <p className="text-xs font-bold">Public Link Sharing</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Enable access for viewers and crawlers.</p>
            </div>
            
            <button
              onClick={() => handleShareToggle(!shareEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                shareEnabled ? "bg-indigo-600" : "bg-gray-250 dark:bg-slate-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  shareEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {shareEnabled && shareLink && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100/30 dark:bg-slate-950/20 rounded-2xl border dark:border-white/5">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(shareLink)}`}
                  alt="Share QR Code"
                  className="border-4 border-white p-1 rounded-xl bg-white shadow-md"
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                  <QrCode size={12} /> Scan QR Code
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Public Share URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="w-full bg-slate-100/50 dark:bg-slate-900 border dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-gray-300 select-all"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                    title="Copy URL"
                  >
                    <Clipboard size={16} />
                  </button>
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-250 bg-white dark:border-white/5 dark:bg-[#030712] hover:bg-gray-100 dark:hover:bg-white/10 text-slate-800 dark:text-white transition"
                    title="Open Link"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Set Link Expiration Date</label>
                <input
                  type="datetime-local"
                  value={shareExpiry}
                  onChange={(e) => setShareExpiry(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-gray-300 focus:border-indigo-500 focus:outline-hidden"
                />
                <div className="flex justify-end pt-1">
                  <Button size="sm" onClick={() => handleShareToggle(true)}>Save Expiration</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Hidden DOM Node for PDF Rendering and Downloads */}
      {downloadingResumeData && (
        <div style={{ position: "absolute", left: "-9999px", top: "0", zIndex: -100 }}>
          <div id="hidden-resume-download-element" style={{ width: "210mm" }}>
            {(() => {
              const rData = downloadingResumeData.resume_data || {};
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

              const ActiveTemplate = templateMap[downloadingResumeData.template] ?? templateMap.ats;
              return <ActiveTemplate data={previewData} />;
            })()}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Dashboard;