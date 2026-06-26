import axios from "axios";

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

interface GeminiRequestPayload {
  contents: { parts: { text: string }[] }[];
  generationConfig?: {
    responseMimeType?: string;
  };
}

export async function callGemini(prompt: string, expectJson = true): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  let lastError: any = null;

  for (const model of MODELS) {
    try {
      console.log(`[Gemini API] Requesting ${model}...`);
      
      const payload: GeminiRequestPayload = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      
      if (expectJson) {
        payload.generationConfig = {
          responseMimeType: "application/json",
        };
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        payload,
        { timeout: 45000 }
      );

      const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!aiText) {
        throw new Error("Empty response returned from Gemini API");
      }

      if (expectJson) {
        try {
          const cleanJson = aiText.replace(/```json|```/g, "").trim();
          return JSON.parse(cleanJson);
        } catch (parseErr: any) {
          console.error("[Gemini API] JSON Parse Error on text:", aiText);
          throw new Error("Gemini returned invalid JSON structure.");
        }
      }

      return aiText;
    } catch (err: any) {
      console.error(`[Gemini API] Failed with ${model}:`, err.response?.status || err.message);
      lastError = err;
      
      // If it's a rate limit (429) or quota error, try next model immediately
      if (err.response?.status === 429) {
        console.warn(`[Gemini API] Rate limit reached on ${model}. Trying next model...`);
        continue;
      }
      
      // If it is another HTTP error, log detail and fallback
      if (err.response?.data) {
        console.error("[Gemini API] Error Response Data:", JSON.stringify(err.response.data));
      }
    }
  }

  const status = lastError?.response?.status;
  const message = lastError?.response?.data?.error?.message || lastError?.message || "Unknown API error";
  
  if (status === 401 || status === 403) {
    throw new Error(`Authentication failed: Invalid or restricted Gemini API Key. (${message})`);
  }
  
  if (status === 429) {
    throw new Error(`Rate limit exceeded: Gemini API quota reached. Please try again later.`);
  }

  throw new Error(`Gemini API Error: ${message}`);
}
