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















import ATSResume from "./ATSResume";
import ModernResume from "./ModernTemplate";
import MinimalResume from "./MinimalTemplate";

export const templateMap = {
  ats: ATSResume,
  modern: ModernResume,
  minimal: MinimalResume,
};