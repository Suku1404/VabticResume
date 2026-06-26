import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { AIConfigurationError } from "./errors";
import { validateEnvironment } from "./ai.validation";

let genAIInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (genAIInstance) {
    return genAIInstance;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AIConfigurationError("GEMINI_API_KEY is not configured in environment variables.");
  }

  genAIInstance = new GoogleGenerativeAI(apiKey);
  return genAIInstance;
}

export interface GenerativeModelWrapper {
  model: string;
  generateContent(prompt: string): Promise<{ response: { text(): string } }>;
}

class GeminiModelWrapper implements GenerativeModelWrapper {
  private innerModel: any;
  constructor(public model: string) {
    const client = getGeminiClient();
    this.innerModel = client.getGenerativeModel({ model });
  }

  async generateContent(prompt: string) {
    return this.innerModel.generateContent(prompt);
  }
}

class OllamaModelWrapper implements GenerativeModelWrapper {
  constructor(public model: string) {}

  async generateContent(prompt: string) {
    const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    try {
      const response = await axios.post(
        `${baseUrl}/api/generate`,
        {
          model: this.model,
          prompt: prompt,
          stream: false,
        },
        { timeout: 60000 }
      );

      const text = response.data?.response || "";
      return {
        response: {
          text: () => text,
        },
      };
    } catch (err: any) {
      console.error("[Ollama API Error]:", err.message || err);
      throw err;
    }
  }
}

class GroqModelWrapper implements GenerativeModelWrapper {
  constructor(public model: string) {}

  async generateContent(prompt: string) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured in environment variables.");
    }
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: this.model,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 45000,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content || "";
      return {
        response: {
          text: () => text,
        },
      };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || err.message || String(err);
      console.error("[Groq API Error]:", errorMsg);
      throw new Error(`Groq API Error: ${errorMsg}`);
    }
  }
}

class MockModelWrapper implements GenerativeModelWrapper {
  constructor(public model: string) {}

  async generateContent(prompt: string) {
    console.log("[AI Mock Model] Simulating response...");
    let responseText = "";

    // 1. Career Copilot / Roadmap
    if (prompt.includes("careerRoadmap") || prompt.includes("salaryInsights") || prompt.includes("Career Copilot") || prompt.includes("careerCopilot") || prompt.includes("roadmap") || prompt.includes("learningResources")) {
      responseText = JSON.stringify({
        resumeReview: "Your resume presents a solid baseline for a Backend Engineer role. The experience highlights clear responsibilities but would benefit from more impact metrics.",
        resumeImprovements: "Focus on adding numeric achievements (e.g., '% optimization', 'dollar amounts saved', 'number of users served').",
        careerRoadmap: [
          {
            step: 1,
            title: "Master TypeScript & Cloud Services",
            description: "Deepen backend skills with TypeScript and deploy a project on AWS or Google Cloud."
          },
          {
            step: 2,
            title: "Contribute to Architecture Decisions",
            description: "Lead the design of a database schema or microservice at your current role to gain design experience."
          }
        ],
        interviewPrepRoadmap: [
          {
            step: 1,
            topic: "System Design Fundamentals",
            description: "Study load balancing, caching, databases (SQL vs NoSQL), and scaling strategies."
          },
          {
            step: 2,
            topic: "Coding Challenges",
            description: "Solve 2 medium problems daily on platforms like LeetCode, focusing on arrays, strings, and trees."
          }
        ],
        skillGapAnalysis: "Missing advanced cloud infrastructure (Terraform, AWS ECS) and automated CI/CD pipeline experience.",
        recommendedSkills: ["Terraform", "AWS", "Redis", "Jest"],
        recommendedCertifications: [
          {
            name: "AWS Certified Solutions Architect",
            provider: "Amazon Web Services",
            url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
          }
        ],
        learningResources: [
          {
            topic: "System Design Primer",
            type: "Open Source Course",
            platform: "GitHub",
            resource: "https://github.com/donnemartin/system-design-primer"
          }
        ],
        salaryInsights: {
          role: "Backend Engineer",
          range: "$90,000 - $140,000",
          marketDemand: "High",
          advice: "Backend roles remain highly sought after, especially those showing competencies in system optimization and cloud operations."
        },
        careerAdvice: "Network with senior engineers and seek mentorship in systems architecture.",
        jobSearchTips: "Target companies in the series A/B stage where you can assume ownership of large service components.",
        jobRecommendations: [
          {
            title: "Software Engineer - Backend",
            companies: "Stripe, Slack, Datadog",
            relevance: "90%"
          }
        ],
        portfolioSuggestions: [
          {
            title: "Real-time Chat Engine",
            description: "A chat server using WebSockets, Redis pub/sub, and PostgreSQL storage, packaged in Docker."
          }
        ]
      });
    }
    // 2. Classification
    else if (prompt.includes("classify") || prompt.includes("isResume")) {
      responseText = JSON.stringify({
        isResume: true,
        confidence: 95,
        reason: "The document contains standard resume sections (experience, education, skills) and contact information.",
        source: "local-fallback"
      });
    }
    // 3. ATS Match
    else if (prompt.includes("atsScore") || prompt.includes("resumeScore") || prompt.includes("ATS Score") || prompt.includes("atsCheck")) {
      responseText = JSON.stringify({
        atsScore: 85,
        resumeScore: 82,
        missingSkills: ["TypeScript", "Docker", "AWS"],
        missingKeywords: ["CI/CD", "microservices", "optimization"],
        suggestedSkills: ["Kubernetes", "GraphQL", "Redis"],
        suggestedImprovements: "Add more quantifiable metrics to your experience descriptions.",
        strengths: "Strong backend experience with Express and database management.",
        weaknesses: "Lacks detail on cloud infrastructure and DevOps practices.",
        keywordOptimization: "Include words like 'Scalability', 'Performance Tuning', and 'Agile methodology'.",
        experienceImprovements: "Rephrase bullet points to emphasize impact: 'Improved load time by 30% by refactoring queries'.",
        suggestedProjects: ["Microservices-based e-commerce backend", "Serverless image processing pipeline"],
        suggestedCertifications: ["AWS Certified Developer - Associate", "Certified Kubernetes Administrator (CKA)"],
        recruiterTips: "Make sure to highlight your contribution to database design and API security.",
        improvedContent: {
          personalInfo: {
            summary: "Experienced Software Engineer specializing in backend systems development, Node.js microservices, and database optimization."
          },
          skills: ["Node.js", "Express", "PostgreSQL", "TypeScript", "Docker"],
          experience: [
            {
              role: "Software Engineer",
              company: "Vabtic Systems",
              description: "Designed and implemented robust Node.js microservices, optimizing database queries to reduce API latency by 25%."
            }
          ]
        }
      });
    }
    // 4. Improve Resume
    else if (prompt.includes("improve") || prompt.includes("suggestions") || prompt.includes("Action Plan") || prompt.includes("improveResume")) {
      responseText = JSON.stringify({
        personalInfo: {
          fullName: "John Doe",
          title: "Full Stack Developer",
          email: "johndoe@example.com",
          phone: "+1 234 567 890",
          location: "San Francisco, CA",
          summary: "Results-driven Full Stack Developer with 3+ years of experience building scalable web applications. Expert in React, Node.js, and database optimization."
        },
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institute: "State University",
            location: "San Francisco, CA",
            startYear: "2018",
            endYear: "2022"
          }
        ],
        experience: [
          {
            role: "Software Engineer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            startDate: "June 2022",
            endDate: "Present",
            description: "Developed and maintained web applications using React and Node.js. Optimized SQL queries, improving backend response time by 40%."
          }
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "Git", "Docker"],
        suggestions: [
          {
            parameter: "Skills Section",
            observations: "Your skills list is strong but could include more backend technologies mentioned in standard job listings.",
            actionPlan: "Add database performance tuning and caching mechanisms (like Redis)."
          }
        ]
      });
    }
    // 5. Interview Questions
    else if (prompt.includes("InterviewQuestion") || prompt.includes("interview questions") || prompt.includes("generateInterviewQuestions")) {
      responseText = JSON.stringify([
        { id: 1, question: "Explain the difference between SQL and NoSQL databases, and when you would use each." },
        { id: 2, question: "How does the Node.js event loop work under the hood?" },
        { id: 3, question: "What is your approach to optimizing slow database queries?" }
      ]);
    }
    // 6. Submit Feedback
    else if (prompt.includes("modelAnswer") || prompt.includes("submitFeedback") || prompt.includes("feedback")) {
      responseText = JSON.stringify({
        score: 82,
        feedback: "Your answer provides a good high-level overview. You correctly identified key points, but could expand on the operational trade-offs.",
        strengths: "Clear structure, accurate terms, and direct answer to the main question.",
        weaknesses: "Lacked practical examples from past experiences or specific configuration details.",
        tips: "Try adding a concrete scenario: 'For example, in my last project, we used PostgreSQL because...'.",
        modelAnswer: "A complete answer would explain: 1) SQL is relational, structured, supports ACID transactions, and scales vertically. 2) NoSQL is non-relational, schema-less, handles unstructured data, and scales horizontally. Choose SQL for transactions and complex queries; NoSQL for scale, speed, and changing data schemas."
      });
    }
    // 7. Rewrite Summary / General Summary
    else if (prompt.includes("summary") || prompt.includes("rewriteProfessionalSummary") || prompt.includes("summarize")) {
      responseText = JSON.stringify({
        summary: "Highly skilled Software Developer with a background in database optimization and developing performant React and Node.js web applications."
      });
    }
    // 8. Projects suggestion
    else if (prompt.includes("techStack") || prompt.includes("generateProjects")) {
      responseText = JSON.stringify([
        {
          title: "Distributed Task Scheduler",
          description: "A server system to process background tasks with cron schedule support and queue processing.",
          techStack: ["Node.js", "Redis", "TypeScript", "PostgreSQL"],
          features: ["Retry mechanisms", "Email notifications on failure", "Dashboard to view status"]
        }
      ]);
    }
    // 9. Skills suggestion
    else if (prompt.includes("skills") || prompt.includes("generateSkills")) {
      responseText = JSON.stringify({
        skills: ["TypeScript", "Docker", "AWS", "CI/CD", "Redis"]
      });
    }
    // 10. Default / Parse Resume
    else {
      responseText = JSON.stringify({
        personalInfo: {
          fullName: "John Doe",
          title: "Developer",
          email: "johndoe@example.com",
          phone: "123-456-7890",
          location: "San Francisco, CA",
          summary: "Developer with experience in building web apps."
        },
        education: [],
        experience: [],
        skills: ["React", "Node.js", "JavaScript"]
      });
    }

    // Small delay to simulate API response latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      response: {
        text: () => responseText,
      },
    };
  }
}

export function getGenerativeModel(modelName?: string): GenerativeModelWrapper {
  validateEnvironment();
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  if (provider === "mock") {
    console.log("========== MOCK AI ==========");
    console.log("MODEL: local-mock-llm");
    console.log("=============================");
    return new MockModelWrapper("local-mock-llm");
  }

  if (provider === "ollama") {
    const model = modelName || process.env.OLLAMA_MODEL || "gemma2:9b";
    console.log("========== OLLAMA ==========");
    console.log("BASE URL:", process.env.OLLAMA_BASE_URL || "http://localhost:11434");
    console.log("MODEL:", model);
    console.log("============================");
    return new OllamaModelWrapper(model);
  }

  if (provider === "groq") {
    const model = modelName || process.env.GROQ_MODEL || "llama-3.3-70b-specdec";
    console.log("========== GROQ ==========");
    console.log("API KEY EXISTS:", !!process.env.GROQ_API_KEY);
    console.log("MODEL:", model);
    console.log("==========================");
    return new GroqModelWrapper(model);
  }

  // Default to Gemini
  const model = modelName || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  console.log("========== GEMINI ==========");
  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
  console.log("MODEL:", model);
  console.log("============================");
  return new GeminiModelWrapper(model);
}