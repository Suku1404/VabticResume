import { getGenerativeModel } from "./gemini.client";
import { aiCacheService } from "./cache.service";
import { aiQueueService } from "./queue.service";
import { retryWithBackoff } from "./retryHandler";
import { safeParseJSON } from "./responseParser";
import { aiLogger } from "./logger";
import * as prompts from "./promptBuilder";
import * as types from "./ai.types";

export class AIService {
  
  /**
   * Helper to execute prompts through caching, queueing, retries, and parsing.
   */
  private async executeQuery<T>(
    featureName: string,
    prompt: string,
    useCache = true,
    cacheInputs: any[] = []
  ): Promise<T> {
    const cacheKey = useCache ? aiCacheService.generateKey([featureName, ...cacheInputs]) : "";
    
    if (useCache) {
      const cached = aiCacheService.get<T>(cacheKey);
      if (cached) {
        console.log(`[AI Cache Hit] Reusing cached result for: "${featureName}"`);
        return cached;
      }
    }

    const modelInstance = getGenerativeModel();
    const startTime = Date.now();
    aiLogger.logRequest(featureName, modelInstance.model, prompt.length);

    try {
     const rawText = await aiQueueService.enqueue(() =>
  retryWithBackoff(async () => {
    console.log("====================================");
    console.log("Feature:", featureName);
    console.log("Model:", modelInstance.model);
    console.log("Prompt Length:", prompt.length);
    console.log("====================================");

    try {
      const result = await modelInstance.generateContent(prompt);

      console.log("========== GEMINI RAW RESPONSE ==========");
      console.dir(result, { depth: null });

      const responseText = result.response?.text();

      console.log("========== GEMINI TEXT ==========");
      console.log(responseText);

      if (!responseText) {
        throw new Error("Empty response returned from Gemini SDK");
      }

      return responseText;
    } catch (err) {
      console.error("========== GEMINI ERROR ==========");
      console.error(err);
      console.error("==================================");
      throw err;
    }
  })
);

      const parsed = safeParseJSON(rawText);
      const duration = Date.now() - startTime;
      
      aiLogger.logResponse({
        feature: featureName,
        model: modelInstance.model,
        promptLength: prompt.length,
        responseTimeMs: duration,
        success: true
      });

      if (useCache) {
        aiCacheService.set(cacheKey, parsed);
      }

      return parsed;
    } catch (err: any) {
      const duration = Date.now() - startTime;
      aiLogger.logResponse({
        feature: featureName,
        model: modelInstance.model,
        promptLength: prompt.length,
        responseTimeMs: duration,
        success: false,
        error: err.message || String(err)
      });

      console.warn(`[AI Service Fallback] Provider failed: ${err.message || err}. Falling back to local mock response.`);
      try {
        const mockModel = getGenerativeModel("local-mock-llm");
        const mockResult = await mockModel.generateContent(prompt);
        const mockText = mockResult.response.text();
        const parsed = safeParseJSON(mockText);
        
        if (useCache) {
          aiCacheService.set(cacheKey, parsed);
        }
        return parsed;
      } catch (mockErr: any) {
        console.error("[AI Service Fallback] Even mock generation failed:", mockErr);
        throw err;
      }
    }
  }

  /**
   * Rewrite and optimize a resume based on target role
   */
  public async improveResume(args: types.ImproveResumeArgs): Promise<types.ImproveResumeResult> {
    const prompt = prompts.buildResumeImprovementPrompt(args.resumeText, args.jobRole);
    // Don't cache complete resume improvements as they are personalized and large
    return this.executeQuery<types.ImproveResumeResult>("improveResume", prompt, false);
  }

  /**
   * Extract information from raw resume text and organize it into structured JSON
   */
  public async parseResume(resumeText: string): Promise<any> {
    const prompt = prompts.buildResumeParsingPrompt(resumeText);
    return this.executeQuery<any>("parseResume", prompt, false);
  }

  /**
   * Validate if text is actually a resume
   */
  public async classifyResume(args: types.ClassifyResumeArgs): Promise<types.ResumeClassificationResult> {
    const prompt = prompts.buildResumeClassificationPrompt(args.resumeText);
    return this.executeQuery<types.ResumeClassificationResult>("classifyResume", prompt, true, [args.resumeText.slice(0, 1000)]);
  }

  /**
   * Match a resume against a job description for ATS optimization
   */
  public async resumeMatch(args: types.ResumeMatchArgs): Promise<types.ResumeMatchResult> {
    const prompt = prompts.buildResumeMatchPrompt(
      String(args.resumeId || "custom"),
      args.resumeData,
      args.jobDescription
    );
    // Cache matching results since job descriptions and resumes are frequently compared multiple times
    return this.executeQuery<types.ResumeMatchResult>("resumeMatch", prompt, true, [args.resumeId, args.jobDescription]);
  }

  /**
   * Career Copilot recommendations
   */
  public async careerCopilot(args: types.CareerCopilotArgs): Promise<types.CareerCopilotResult> {
    const prompt = prompts.buildCareerAdvicePrompt(
      String(args.resumeId || "default"),
      args.resumeData
    );
    return this.executeQuery<types.CareerCopilotResult>("careerCopilot", prompt, true, [args.resumeId, JSON.stringify(args.resumeData || {})]);
  }

  /**
   * Generate interview questions
   */
  public async generateInterviewQuestions(args: types.GenerateInterviewQuestionsArgs): Promise<types.InterviewQuestion[]> {
    const prompt = prompts.buildInterviewQuestionsPrompt(args.category, args.difficulty, args.jobRole);
    return this.executeQuery<types.InterviewQuestion[]>("generateInterviewQuestions", prompt, false);
  }

  /**
   * Evaluate interview responses
   */
  public async submitFeedback(args: types.SubmitFeedbackArgs): Promise<types.InterviewFeedbackResult> {
    const prompt = prompts.buildInterviewFeedbackPrompt(args.question, args.answer, args.difficulty, args.category);
    return this.executeQuery<types.InterviewFeedbackResult>("submitFeedback", prompt, false);
  }

  /**
   * Rewrite a professional summary
   */
  public async rewriteProfessionalSummary(experienceText: string): Promise<{ summary: string }> {
    const prompt = prompts.buildSummaryPrompt(experienceText);
    return this.executeQuery<{ summary: string }>("rewriteProfessionalSummary", prompt, false);
  }

  /**
   * Generate interactive mock interviews
   */
  public async generateMockInterview(topic: string, role: string, history: any[]): Promise<any> {
    const prompt = prompts.buildMockInterviewPrompt(topic, role, history);
    return this.executeQuery<any>("generateMockInterview", prompt, false);
  }

  /**
   * Central ATS check helper method
   */
  public async atsCheck(args: types.ResumeMatchArgs): Promise<types.ResumeMatchResult> {
    return this.resumeMatch(args);
  }

  /**
   * Generate a milestone career roadmap
   */
  public async generateCareerRoadmap(title: string, resumeData: any): Promise<any> {
    const result = await this.careerCopilot({ resumeId: "roadmap", resumeData });
    return result.careerRoadmap;
  }

  /**
   * General resume summarizer
   */
  public async summarizeResume(resumeText: string): Promise<{ summary: string }> {
    return this.rewriteProfessionalSummary(resumeText);
  }

  /**
   * General resume optimizer
   */
  public async optimizeResume(resumeText: string, jobRole?: string): Promise<types.ImproveResumeResult> {
    return this.improveResume({ resumeText, jobRole });
  }

  /**
   * Suggest stand-out portfolio projects
   */
  public async generateProjects(role: string, skills: string[]): Promise<types.ProjectSuggestionResult[]> {
    const prompt = prompts.buildProjectSuggestionPrompt(role, skills);
    return this.executeQuery<types.ProjectSuggestionResult[]>("generateProjects", prompt, true, [role, skills]);
  }

  /**
   * Suggest high-value skills to add
   */
  public async generateSkills(role: string, currentSkills: string[]): Promise<string[]> {
    const prompt = prompts.buildSkillSuggestionPrompt(role, currentSkills);
    const result = await this.executeQuery<{ skills: string[] }>("generateSkills", prompt, true, [role, currentSkills]);
    return result.skills || [];
  }
}

export const aiService = new AIService();
export default aiService;
