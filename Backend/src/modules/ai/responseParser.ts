import { AIResponseParseError } from "./errors";

/**
 * Safely parses LLM string outputs into standard JS objects or arrays.
 * Handles markdown block tags, conversational text wrappers, and common syntax errors like trailing commas.
 */
export function safeParseJSON(text: string): any {
  if (!text) {
    throw new AIResponseParseError("Empty response text received from Gemini API.");
  }

  let cleaned = text.trim();
  
  // 1. Strip standard markdown wrappers
  cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();

  // 2. Find JSON boundaries ({ ... } or [ ... ]) to discard conversational headers
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  
  let jsonStart = -1;
  let jsonEnd = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    jsonStart = firstBrace;
    jsonEnd = cleaned.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    jsonStart = firstBracket;
    jsonEnd = cleaned.lastIndexOf("]");
  }

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  // 3. Remove trailing commas before closing brackets or braces (common LLM parsing issue)
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("[AI Response Parser] Failed to parse JSON text. Raw text snippet:", text.substring(0, 300));
    console.error("[AI Response Parser] Cleaned text attempt:", cleaned.substring(0, 300));
    throw new AIResponseParseError("Gemini response is not a valid JSON structure.", err.message);
  }
}
