import TemplateCard from "../components/resume/TemplateCard";

const templates = [
  {
    title: "ATS Resume",
    description: "Clean single-column format for job portals and ATS systems.",
    category: "ATS Friendly",
  },
  {
    title: "Modern Template",
    description: "Premium two-column design for stylish professional resumes.",
    category: "Modern",
  },
  {
    title: "Minimal Template",
    description: "Simple, elegant, and highly readable resume layout.",
    category: "Minimal",
  },
  {
    title: "FAANG Classic",
    description: "Best for MAANG-style software engineering applications.",
    category: "MAANG",
  },
  {
    title: "Backend Engineer",
    description: "Focused on APIs, databases, backend systems, and architecture.",
    category: "Backend",
  },
  {
    title: "Frontend Engineer",
    description: "Perfect for React, UI engineering, and product design roles.",
    category: "Frontend",
  },
];

const Templates = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-950">Resume Templates</h1>
          <p className="mt-2 text-gray-500">
            Choose reusable templates for different roles and companies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.title}
              title={template.title}
              description={template.description}
              category={template.category}
              isSelected={index === 0}
              onSelect={() => alert(`${template.title} selected`)}
              onPreview={() => alert(`Preview ${template.title}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;