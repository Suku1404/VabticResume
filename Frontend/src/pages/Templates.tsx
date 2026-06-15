import { useNavigate } from "react-router-dom";
import TemplateCard from "../components/resume/TemplateCard";
import { templates } from "../data/template";
import Footer from "./Footer";

const Templates = () => {
  const navigate = useNavigate();

  const handleSelect = (templateId: string) => {
    navigate(`/builder/${templateId}`);
  };

  const handlePreview = (templateId: string) => {
    navigate(`/builder/${templateId}`);
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-10 transition-colors duration-300">
      <div className="mb-10">
        <h1 className="mb-3 text-5xl font-bold text-slate-900 dark:text-white">
          Resume Templates
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400">
          Choose reusable templates for different roles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            title={template.name}
            description={template.description}
            category={template.category}
            onSelect={() => handleSelect(template.id)}
            onPreview={() => handlePreview(template.id)}
          />
        ))}
      </div>

    </div>
     {/* your dashboard content */}
      <Footer />
    </>
  );
};

export default Templates;
