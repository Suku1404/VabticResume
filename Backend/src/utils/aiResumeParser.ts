import { aiService } from "../modules/ai";

export const parseResumeWithAI = async (resumeText: string) => {
  try {
    return await aiService.parseResume(resumeText);
  } catch (error: any) {
    console.error("Gemini Parsing error:", error.message || error);
    throw error;
  }
};
