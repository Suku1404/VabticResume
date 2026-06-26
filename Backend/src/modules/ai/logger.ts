export interface LoggerPayload {
  requestId?: string;
  feature: string;
  promptLength: number;
  model: string;
  responseTimeMs?: number;
  success: boolean;
  error?: string;
}

export const aiLogger = {
  logRequest: (feature: string, model: string, promptLength: number, requestId?: string) => {
    const idStr = requestId ? `[ReqID: ${requestId}]` : "";
    console.log(`[AI Request]${idStr} Feature: "${feature}" | Model: "${model}" | Prompt Length: ${promptLength} chars`);
  },

  logResponse: (payload: LoggerPayload) => {
    const idStr = payload.requestId ? `[ReqID: ${payload.requestId}]` : "";
    const status = payload.success ? "SUCCESS" : "FAILURE";
    const timeStr = payload.responseTimeMs ? ` | Duration: ${payload.responseTimeMs}ms` : "";
    const errorStr = payload.error ? ` | Error: ${payload.error}` : "";

    if (payload.success) {
      console.log(`[AI Response]${idStr} Status: ${status}${timeStr} | Feature: "${payload.feature}"`);
    } else {
      console.error(`[AI Response]${idStr} Status: ${status}${timeStr}${errorStr} | Feature: "${payload.feature}"`);
    }
  }
};
