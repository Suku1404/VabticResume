import axios from 'axios';

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

const getAxiosErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : 'Unknown error';

  const status = error.response?.status;
  const apiMessage = (error.response?.data as any)?.error?.message;

  if (status === 429) return 'Gemini quota/rate limit reached';
  return apiMessage || error.message || 'Gemini request failed';
};

export const classifyResumeWithAI = async (resumeText: string): Promise<ResumeClassification> => {
  if (!process.env.GEMINI_API_KEY) {
    return getLocalResumeClassification(resumeText, 'Gemini API key is missing');
  }

  const prompt = `
You are an ATS resume classifier.

Check whether the following extracted PDF text is actually a resume/CV.

Return ONLY valid JSON:
{
  "isResume": true or false,
  "confidence": number from 0 to 100,
  "reason": "short reason"
}

Rules:
- A resume usually contains name, email/phone, education, skills, projects, experience, internship, certifications, links.
- If it is an invoice, notes, story, question paper, article, book page, or random PDF, return false.

PDF Text:
${resumeText.slice(0, 5000)}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      },
      {
        timeout: 30000,
      }
    );

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = aiText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      isResume: Boolean(parsed.isResume),
      confidence: Number(parsed.confidence) || 0,
      reason: String(parsed.reason || 'Gemini classified the document.'),
      source: 'gemini',
    };
  } catch (error) {
    const message = getAxiosErrorMessage(error);
    console.warn(`Gemini classifier unavailable: ${message}. Using local fallback.`);

    return getLocalResumeClassification(resumeText, message);
  }
};
