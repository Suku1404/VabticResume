// export interface ResumeData {
//   personalInfo: {
//     name: string;
//     email: string;
//     phone: string;
//   };

//   summary: string;

//   skills: string[];
// }

 

export interface ResumeData  {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  skills: string[];
  education: string;
  experience: string[];
  projects: string[];
  achievements?: string[];
  certifications?: string[];
};