export class AIError extends Error {
  public code: string;
  public details?: string;

  constructor(message: string, code = "AI_ERROR", details?: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AIConfigurationError extends AIError {
  constructor(message: string, details?: string) {
    super(message, "AI_CONFIG_ERROR", details);
  }
}

export class AIAuthenticationError extends AIError {
  constructor(message: string, details?: string) {
    super(message, "AI_AUTH_ERROR", details);
  }
}

export class AIRateLimitError extends AIError {
  constructor(message: string, details?: string) {
    super(message, "AI_RATE_LIMIT_ERROR", details);
  }
}

export class AITimeoutError extends AIError {
  constructor(message: string, details?: string) {
    super(message, "AI_TIMEOUT_ERROR", details);
  }
}

export class AIResponseParseError extends AIError {
  constructor(message: string, details?: string) {
    super(message, "AI_PARSE_ERROR", details);
  }
}

export class AIUnavailableError extends AIError {
  constructor(message: string, details?: string) {
    super(message, "AI_UNAVAILABLE_ERROR", details);
  }
}
