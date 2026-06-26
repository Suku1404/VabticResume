import { aiService } from "../modules/ai";

export type ResumeClassification = {
  isResume: boolean;
  confidence: number;
  reason: string;
  source: 'gemini' | 'local-fallback';
};

const getLocalResumeClassification = (resumeText: string, reasonPrefix = 'Local resume check'): ResumeClassification => {
  const text = resumeText.toLowerCase();

  const resumeSignals = [
    /@/.test(text),
    /\b(phone|mobile|\+?\d{10,})\b/.test(text),
    /\b(summary|profile|objective)\b/.test(text),
    /\b(skills|technical skills|technologies)\b/.test(text),
    /\b(experience|employment|internship|work history)\b/.test(text),
    /\b(projects|project)\b/.test(text),
    /\b(education|degree|university|college|b\.?tech|m\.?tech)\b/.test(text),
    /\b(linkedin|github|portfolio)\b/.test(text),
  ];

  const nonResumeSignals = [
    /\b(invoice|receipt|bill to|amount due|tax invoice)\b/.test(text),
    /\b(question paper|marks|chapter|exercise)\b/.test(text),
    /\b(article|abstract|references|journal)\b/.test(text),
  ];

  const matchedSignals = resumeSignals.filter(Boolean).length;
  const matchedNonResumeSignals = nonResumeSignals.filter(Boolean).length;
  const confidence = Math.max(30, Math.min(95, matchedSignals * 12 - matchedNonResumeSignals * 20));

  return {
    isResume: matchedSignals >= 4 && matchedNonResumeSignals === 0,
    confidence,
    reason: `${reasonPrefix}. Found ${matchedSignals} resume signals.`,
    source: 'local-fallback',
  };
};

export const classifyResumeWithAI = async (resumeText: string): Promise<ResumeClassification> => {
  try {
    const result = await aiService.classifyResume({ resumeText });
    return result;
  } catch (error: any) {
    const message = error.message || 'Gemini request failed';
    console.warn(`Gemini classifier unavailable: ${message}. Using local fallback.`);
    return getLocalResumeClassification(resumeText, message);
  }
};
