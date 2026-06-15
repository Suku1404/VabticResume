import { useEffect, useState } from "react";
import { FileText, LayoutTemplate, Sparkles, TrendingUp, Download, Eye, Plus } from "lucide-react";
import { Button, Card, Badge } from "../components/common";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "./Footer";

const Dashboard = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/auth/my-resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(response.data);
    } catch (err: any) {
      console.error("Fetch resumes error:", err);
      toast.error("Failed to load your resumes from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const stats = [
    { title: "Total Resumes", value: resumes.length.toString(), icon: FileText },
    { title: "Avg ATS Score", value: resumes.length > 0 ? "88%" : "0%", icon: TrendingUp },
    { title: "Templates Used", value: resumes.length > 0 ? "2" : "0", icon: LayoutTemplate },
    { title: "AI Suggestions", value: resumes.length > 0 ? "14" : "0", icon: Sparkles },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-6 transition-colors duration-300">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="rounded-3xl bg-linear-to-r from-gray-950 via-indigo-950 to-violet-950 p-8 text-white shadow-2xl">
            <Badge className="bg-white/10 text-white ring-white/20">
              Premium Resume Workspace
            </Badge>

            <h1 className="mt-5 text-4xl font-black">
              Build resumes that feel ready for top tech companies.
            </h1>

            <p className="mt-3 max-w-2xl text-gray-300">
              Track ATS score, manage templates, improve content with AI, and export professional resumes.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button variant="outline" className="border-white/25 hover:bg-white/10 text-white">
                <Link to={"/user/templates"} className="flex items-center gap-2">
                  <Plus size={16} /> Build New Resume
                </Link>
              </Button>
              <Button variant="outline" className="border-white/25 hover:bg-white/10 text-white">
                <Link to={"/user/templates"}>Explore Templates</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{item.value}</h2>
                    </div>

                    <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-600 dark:text-indigo-400">
                      <Icon size={24} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card>
            <Card.Title>Recent Resumes (PostgreSQL)</Card.Title>
            <Card.Description>
              Resumes you created and saved in your PostgreSQL database.
            </Card.Description>

            {loading ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400 font-semibold">
                Loading saved resumes...
              </div>
            ) : resumes.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="font-semibold text-lg">No Resumes Found</p>
                <p className="text-sm mt-1 mb-5">Create your first resume to see it here!</p>
                <Button>
                  <Link to="/user/templates">Get Started</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900/50 p-4 transition hover:bg-gray-100 dark:hover:bg-slate-900"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{resume.title || "Untitled Resume"}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Saved on {new Date(resume.created_at).toLocaleDateString()} at {new Date(resume.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        leftIcon={<Eye size={16} />}
                        onClick={() => navigate(`/my-resume/${resume.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;