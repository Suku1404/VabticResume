

import { useNavigate } from "react-router-dom";
import TemplateCard from "../components/resume/TemplateCard";
import { templates } from "../data/template";

const TemplatesPage = () => {
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
        <h1 className="text-5xl font-bold mb-3">
          Resume Templates
        </h1>

        <p className="text-gray-500 text-lg">
          Choose reusable templates for different roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

export default TemplatesPage;




 



