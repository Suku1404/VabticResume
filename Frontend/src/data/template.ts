export type TemplateDefinition = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export const templates: TemplateDefinition[] = [
  {
    id: "ats",
    name: "ATS Resume",
    description: "ATS friendly professional template",
    category: "ATS Friendly",
  },

  {
    id: "modern",
    name: "Modern Resume",
    description: "Modern stylish professional template",
    category: "Modern",
  },

  {
    id: "minimal",
    name: "Minimal Resume",
    description: "Clean and minimal resume template",
    category: "Minimal",
  },
  {
    id: "faang",
    name: "FAANG Resume",
    description: "ATS friendly professional template",
    category: "Faang classsic resume",
  },

  {
    id: "frontend",
    name: "Frontend Resume",
    description: "Frontend stylish professional template",
    category: "Frontend",
  },

  {
    id: "technical",
    name: "Technical Resume",
    description: "Technical-focused resume template",
    category: "Technical",
  },

  {
    id: "software",
    name: "Software Engineer Resume",
    description: "Resume template for software engineers",
    category: "Software Engineer",
  },

  {
    id: "product",
    name: "Product Engineer Resume",
    description: "Resume template for product engineers",
    category: "Product Engineer",
  },

  {
    id: "backend",
    name: "Backend Engineer Resume",
    description: "Resume template for backend engineers",
    category: "Backend Engineer",
  },

  {
    id: "fullstack",
    name: "Full Stack Engineer Resume",
    description: "Resume template for full stack engineers",
    category: "Full Stack Engineer",
  },

  {
    id: "internship",
    name: "Internship Resume",
    description: "Resume template for internships and training",
    category: "Internship",
  },

  {
    id: "java",
    name: "Java Developer Resume",
    description: "Resume template for Java developers",
    category: "Java Developer",
  },

  {
    id: "mern",
    name: "MERN Developer Resume",
    description: "Resume template for MERN stack developers",
    category: "MERN Developer",
  },

];

export const getTemplateById = (templateId?: string) =>
  templates.find(
    (template) => template.id === templateId?.toLowerCase()
  ) ?? templates[0];
