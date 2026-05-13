// export { default as ATSResume } from "./ATSResume";
// export { default as MinimalTemplate } from "./MinimalTemplate";
// export { default as ModernTemplate } from "./ModernTemplate";

// export { default as FAANGClassicTemplate } from "./FAANGClassicTemplate";
// export { default as SoftwareEngineerTemplate } from "./SoftwareEngineerTemplate";
// export { default as BackendEngineerTemplate } from "./BackendEngineerTemplate";
// export { default as FrontendEngineerTemplate } from "./FrontendEngineerTemplate";
// export { default as FullStackEngineerTemplate } from "./FullStackEngineerTemplate";
// export { default as JavaDeveloperTemplate } from "./JavaDeveloperTemplate";
// export { default as MERNDeveloperTemplate } from "./MERNDeveloperTemplate";
// export { default as InternshipTemplate } from "./InternshipTemplate";
// export { default as TechnicalResumeTemplate } from "./TechnicalResumeTemplate";
// export { default as ProductEngineerTemplate } from "./ProductEngineerTemplate";














import type { ComponentType } from "react";
import type { ResumeData } from "./resume.types";

import ATSResume from "./ATSResume";
import ModernResume from "./ModernTemplate";
import MinimalResume from "./MinimalTemplate";
import FAANGClassicTemplate from "./FAANGClassicTemplate";
import FrontendEngineerTemplate from "./FrontendEngineerTemplate";
import InternshipTemplate from "./InternshipTemplate";
import JavaDeveloperTemplate from "./JavaDeveloperTemplate";
import BackendEngineerTemplate from "./BackendEngineerTemplate";
import FullStackEngineerTemplate from "./FullStackEngineerTemplate";
import ProductEngineerTemplate from "./ProductEngineerTemplate";
import SoftwareEngineerTemplate from "./SoftwareEngineerTemplate";
import TechnicalResumeTemplate from "./TechnicalResumeTemplate";
import MERNDeveloperTemplate from "./MERNDeveloperTemplate";

type ResumeTemplateComponent =
  ComponentType<{ data: ResumeData }>;

export const templateMap: Record<
  string,
  ResumeTemplateComponent
> = {
  ats: ATSResume,

  modern: ModernResume,

  minimal: MinimalResume,

  faang: FAANGClassicTemplate,

  frontend: FrontendEngineerTemplate,

  internship: InternshipTemplate,

  java: JavaDeveloperTemplate,

  backend: BackendEngineerTemplate,

  fullstack: FullStackEngineerTemplate,

  product: ProductEngineerTemplate,

  software: SoftwareEngineerTemplate,

  technical: TechnicalResumeTemplate,

  mern: MERNDeveloperTemplate,
};
