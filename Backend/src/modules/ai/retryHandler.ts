import { AIRateLimitError, AITimeoutError, AIUnavailableError, AIError } from "./errors";

/**
 * Executes a task with automatic exponential backoff retry for rate limits, timeouts, and server errors.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<T> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      
      // Extract status and message from the error
      const status = err.status || err.response?.status;
      const message = err.message || "";
      
      // Determine if error is transient and retryable
      const isRateLimit = status === 429 || message.includes("429") || message.toLowerCase().includes("rate limit");
      const isTimeout = message.toLowerCase().includes("timeout") || message.includes("ETIMEDOUT");
      const isServerErr = (status >= 500 && status <= 504) || 
                          message.includes("500") || 
                          message.includes("502") || 
                          message.includes("503") || 
                          message.includes("504") || 
                          message.toLowerCase().includes("unavailable");
      
      const shouldRetry = isRateLimit || isTimeout || isServerErr;
      
      if (!shouldRetry || attempt >= maxRetries) {
        // Map to custom errors before propagating
        if (isRateLimit) {
          throw new AIRateLimitError("Gemini API rate limit exceeded. Please try again in a moment.", message);
        }
        if (isTimeout) {
          throw new AITimeoutError("Gemini API request timed out. Please try again.", message);
        }
        if (isServerErr) {
          throw new AIUnavailableError("Gemini AI service is currently unavailable or returned a server error.", message);
        }
        throw new AIError(err.message || "Failed after multiple attempts", "AI_EXECUTION_FAILURE", err.stack);
      }
      
      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[AI Retry] Attempt ${attempt} failed: ${message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new AIError("Failed after maximum retries", "AI_MAX_RETRIES_EXCEEDED");
}
