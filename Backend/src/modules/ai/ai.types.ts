export interface AIConfig {
  apiKey: string;
  model: string;
  timeout: number;
  maxRetries: number;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  message?: string;
}

// Service Method Argument Types
export interface ImproveResumeArgs {
  resumeText: string;
  jobRole?: string;
}

export interface ClassifyResumeArgs {
  resumeText: string;
}

export interface ResumeMatchArgs {
  resumeId: string | number;
  resumeData: any;
  jobDescription: string;
}

export interface CareerCopilotArgs {
  resumeId?: string | number;
  resumeData?: any;
}

export interface GenerateInterviewQuestionsArgs {
  category: string;
  difficulty: string;
  jobRole?: string;
}

export interface SubmitFeedbackArgs {
  question: string;
  answer: string;
  difficulty?: string;
  category?: string;
}

export interface ResumeSuggestionArgs {
  resumeText: string;
  jobDescription: string;
}

// AI Feature Output Interfaces
export interface ResumeClassificationResult {
  isResume: boolean;
  confidence: number;
  reason: string;
  source: "gemini" | "local-fallback";
}

export interface ImproveResumeResult {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: Array<{
    degree: string;
    institute: string;
    location: string;
    startYear: string;
    endYear: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  suggestions: Array<{
    parameter: string;
    observations: string;
    actionPlan: string;
  }>;
}

export interface ResumeMatchResult {
  atsScore: number;
  resumeScore: number;
  missingSkills: string[];
  missingKeywords: string[];
  suggestedSkills: string[];
  suggestedImprovements: string;
  strengths: string;
  weaknesses: string;
  keywordOptimization: string;
  experienceImprovements: string;
  suggestedProjects: string[];
  suggestedCertifications: string[];
  recruiterTips: string;
  improvedContent: {
    personalInfo: {
      summary: string;
    };
    skills: string[];
    experience: Array<{
      role: string;
      company: string;
      description: string;
    }>;
  };
}

export interface CareerCopilotResult {
  resumeReview: string;
  resumeImprovements: string;
  careerRoadmap: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  interviewPrepRoadmap: Array<{
    step: number;
    topic: string;
    description: string;
  }>;
  skillGapAnalysis: string;
  recommendedSkills: string[];
  recommendedCertifications: Array<{
    name: string;
    provider: string;
    url: string;
  }>;
  learningResources: Array<{
    topic: string;
    type: string;
    platform: string;
    resource: string;
  }>;
  salaryInsights: {
    role: string;
    range: string;
    marketDemand: string;
    advice: string;
  };
  careerAdvice: string;
  jobSearchTips: string;
  jobRecommendations: Array<{
    title: string;
    companies: string;
    relevance: string;
  }>;
  portfolioSuggestions: Array<{
    title: string;
    description: string;
  }>;
}

export interface InterviewQuestion {
  id: number;
  question: string;
}

export interface InterviewFeedbackResult {
  score: number;
  feedback: string;
  strengths: string;
  weaknesses: string;
  tips: string;
  modelAnswer: string;
}

export interface ProjectSuggestionResult {
  title: string;
  description: string;
  techStack: string[];
  features: string[];
}
