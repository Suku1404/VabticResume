import { useNavigate } from "react-router-dom";
import TemplateCard from "../components/resume/TemplateCard";
import { templates } from "../data/template";

const Templates = () => {
  const navigate = useNavigate();

  const handleSelect = (templateId: string) => {
    navigate(`/builder/${templateId}`);
  };

  const handlePreview = (templateId: string) => {
    navigate(`/builder/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="mb-10">
        <h1 className="mb-3 text-5xl font-bold">
          Resume Templates
        </h1>

        <p className="text-lg text-gray-500">
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
  );
};

export default Templates;
