import { AIConfigurationError } from "./errors";

export function validateEnvironment(): void {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const missing: string[] = [];

  if (provider === "ollama") {
    if (!process.env.OLLAMA_MODEL) missing.push("OLLAMA_MODEL");
  } else if (provider === "groq") {
    if (!process.env.GROQ_API_KEY) missing.push("GROQ_API_KEY");
    if (!process.env.GROQ_MODEL) missing.push("GROQ_MODEL");
  } else if (provider === "mock") {
    // Mock mode requires no configuration
  } else {
    // Default: gemini
    if (!process.env.GEMINI_API_KEY) missing.push("GEMINI_API_KEY");
    if (!process.env.GEMINI_MODEL) missing.push("GEMINI_MODEL");
  }

  if (missing.length > 0) {
    console.error(`\n[FATAL] Missing required AI environment variables for provider "${provider}": ${missing.join(", ")}`);
    console.error("Please add these to your .env file and restart the server.\n");
    throw new AIConfigurationError(`Missing required AI environment variables for provider "${provider}": ${missing.join(", ")}`);
  }

  // Validate timeout and retries if present
  if (process.env.GEMINI_TIMEOUT && isNaN(Number(process.env.GEMINI_TIMEOUT))) {
    throw new AIConfigurationError("GEMINI_TIMEOUT environment variable must be a number.");
  }
  if (process.env.GEMINI_MAX_RETRIES && isNaN(Number(process.env.GEMINI_MAX_RETRIES))) {
    throw new AIConfigurationError("GEMINI_MAX_RETRIES environment variable must be a number.");
  }

  console.log(`[AI Startup Check] Environment variables for provider "${provider}" validated successfully.`);
}
