import { FileText, LayoutTemplate, Sparkles, TrendingUp, Download } from "lucide-react";
import { Button, Card, Badge } from "../components/common";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const stats = [
  { title: "Total Resumes", value: "12", icon: FileText },
  { title: "ATS Score", value: "92%", icon: TrendingUp },
  { title: "Templates Used", value: "6", icon: LayoutTemplate },
  { title: "AI Suggestions", value: "28", icon: Sparkles },
];

const Dashboard = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-100 p-6">
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
            <Button variant="outline"><Link to={"/user/templates"}>Build New Resume</Link></Button>
            <Button variant="outline"><Link to={"/user/templates"}>Explore Templates</Link></Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
                  </div>

                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <Card.Title>Recent Resumes</Card.Title>

          <div className="mt-5 space-y-4">
            {["Software Developer Resume", "MERN Stack Resume", "Java Backend Resume"].map(
              (resume, index) => (
                <div
                  key={resume}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{resume}</h3>
                    <p className="text-sm text-gray-500">
                      Updated {index + 1} day ago · ATS Score {90 + index}%
                    </p>
                  </div>

                  <Button variant="outline" leftIcon={<Download size={16} />}>
                    Export
                  </Button>
                </div>
              )
            )}
          </div>
        </Card>
      </div>
       
    </div>
    {/* your dashboard content */}
      <Footer />
      </>
  );
};

export default Dashboard;