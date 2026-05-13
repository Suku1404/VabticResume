import ATSResume from "./ATSResume";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import BackendEngineerTemplate from "./BackendEngineerTemplate";
import FrontendEngineerTemplate from "./FrontendEngineerTemplate";
import FullStackEngineerTemplate from "./FullStackEngineerTemplate";

export const templates = [
  {
    id: 1,
    name: "ATS Resume",
    description: "Clean single-column format for ATS systems.",
    category: "ATS Friendly",
    component: ATSResume,
  },

  {
    id: 2,
    name: "Modern Template",
    description: "Premium modern resume design.",
    category: "Modern",
    component: ModernTemplate,
  },

  {
    id: 3,
    name: "Minimal Template",
    description: "Minimal and elegant resume layout.",
    category: "Minimal",
    component: MinimalTemplate,
  },

  {
    id: 4,
    name: "Backend Engineer",
    description: "Best for backend developer roles.",
    category: "Backend",
    component: BackendEngineerTemplate,
  },

  {
    id: 5,
    name: "Frontend Engineer",
    description: "Perfect for React/frontend jobs.",
    category: "Frontend",
    component: FrontendEngineerTemplate,
  },

  {
    id: 6,
    name: "Full Stack Engineer",
    description: "Complete full stack developer resume.",
    category: "Full Stack",
    component: FullStackEngineerTemplate,
  },
];

