/**
 * Centralized Prompt Builder module.
 * Holds template prompt strings for all AI capabilities.
 */

export function buildResumeImprovementPrompt(resumeText: string, jobRole?: string): string {
  return `
You are an expert resume writer and career consultant.
Examine the following resume text and perform a complete improvement.
${jobRole ? `Tailor the resume specifically for the job role: "${jobRole}".` : ""}

Your tasks:
1. Examine the resume using these parameters: "Impact of descriptions" (quantifiable metrics), "Grammar & Spellings", "Clarity & Style", "Skills coverage".
2. Provide concrete observations and an action plan for each parameter.
3. Rewrite the entire resume into a highly polished, professional, and ATS-friendly format, preserving the overall section order and user-entered details but making them sound more professional and impactful.
4. Output the result ONLY as a valid JSON object with the following structure:
{
  "personalInfo": {
    "fullName": "Polished name",
    "title": "Polished professional title",
    "email": "email",
    "phone": "phone",
    "location": "location",
    "summary": "Polished professional summary"
  },
  "education": [
    {
      "degree": "Degree",
      "institute": "Institute/University",
      "location": "Location",
      "startYear": "Start Year",
      "endYear": "End Year"
    }
  ],
  "experience": [
    {
      "role": "Job Role",
      "company": "Company Name",
      "location": "Location",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Polished description using strong action verbs and quantifiable achievements"
    }
  ],
  "skills": ["Skill1", "Skill2"],
  "suggestions": [
    {
      "parameter": "Impact of descriptions",
      "observations": "Detailed observations.",
      "actionPlan": "Action plan."
    },
    {
      "parameter": "Grammar & Spellings",
      "observations": "Observations.",
      "actionPlan": "Action plan."
    },
    {
      "parameter": "Clarity & Style",
      "observations": "Observations.",
      "actionPlan": "Action plan."
    },
    {
      "parameter": "Skills coverage",
      "observations": "Observations.",
      "actionPlan": "Action plan."
    }
  ]
}

Resume Text:
${resumeText}
`;
}

export function buildResumeMatchPrompt(title: string, resumeData: any, jobDescription: string): string {
  return `
You are an expert ATS (Applicant Tracking System) optimizer and professional recruiter.
Analyze the following resume against the job description.

Resume details:
Title: "${title}"
Content: ${JSON.stringify(resumeData)}

Job Description:
"${jobDescription}"

Provide a detailed ATS analysis. Return ONLY a valid JSON object matching the following structure:
{
  "atsScore": number from 0 to 100 representing the compatibility score,
  "resumeScore": number from 0 to 100 representing overall resume quality and structure,
  "missingSkills": ["Skill 1", "Skill 2", ...],
  "missingKeywords": ["Keyword 1", "Keyword 2", ...],
  "suggestedSkills": ["Suggested Skill 1", "Suggested Skill 2", ...],
  "suggestedImprovements": "Overall summary of suggestions to tailor the resume",
  "strengths": "Key strengths of the resume",
  "weaknesses": "Key weaknesses of the resume",
  "keywordOptimization": "Advice on inserting terms and phrases from the job description",
  "experienceImprovements": "Specific advice on rephrasing job experience items",
  "suggestedProjects": ["Project Idea 1 (with recommended tech stack)", "Project Idea 2", ...],
  "suggestedCertifications": ["Cert 1", "Cert 2", ...],
  "recruiterTips": "Expert tip from a professional recruiter to stand out for this role",
  "improvedContent": {
    "personalInfo": {
      "summary": "Improved professional summary tailored to this job description"
    },
    "skills": ["Skill 1", "Skill 2", ...],
    "experience": [
      {
        "role": "Role",
        "company": "Company",
        "description": "Improved experience description optimized with keywords and impact metrics tailored for this job description"
      }
    ]
  }
}
`;
}

export function buildCareerAdvicePrompt(title: string, resumeData: any): string {
  return `
You are a premium AI Career Copilot, resume auditor, and expert career strategist.
Analyze the following resume details and provide highly personalized career advice, roadmap, and insights.

Resume details:
Title: "${title}"
Content: ${JSON.stringify(resumeData)}

Return ONLY a valid JSON object matching the following structure:
{
  "resumeReview": "Detailed critical review of their resume, listing strengths and key areas of improvement.",
  "resumeImprovements": "Specific bullet-by-bullet list of suggestions to improve the resume text, summary, and formatting.",
  "careerRoadmap": [
    { "step": 1, "title": "Next milestone title", "description": "Description of the milestone and how to reach it" },
    { "step": 2, "title": "Mid-term milestone", "description": "Description" }
  ],
  "interviewPrepRoadmap": [
    { "step": 1, "topic": "Behavioral / Technical focus", "description": "Key questions, how to prepare, tips." }
  ],
  "skillGapAnalysis": "A detailed comparison of their current skills versus top industry requirements.",
  "recommendedSkills": ["Skill to learn 1", "Skill to learn 2", "Skill to learn 3"],
  "recommendedCertifications": [
    { "name": "Certification Name", "provider": "e.g. AWS / Google / Coursera", "url": "Recommended platform" }
  ],
  "learningResources": [
    { "topic": "Topic Name", "type": "Course / Tutorial / Documentation", "platform": "Platform details", "resource": "Resource Name" }
  ],
  "salaryInsights": {
    "role": "Target role title",
    "range": "Market average salary range (Annual/Hourly)",
    "marketDemand": "High, Medium, or Growing",
    "advice": "Negotiation and market value advice"
  },
  "careerAdvice": "Strategic advice for long term career growth and promotions.",
  "jobSearchTips": "Job hunting and application strategies specific to this profile.",
  "jobRecommendations": [
    { "title": "Target Job Title", "companies": "Target companies/sectors", "relevance": "Why this matches their profile" }
  ],
  "portfolioSuggestions": [
    { "title": "Standout Portfolio Project", "description": "Highly impactful project idea with recommended tech stack and features to build." }
  ]
}
`;
}

export function buildInterviewQuestionsPrompt(category: string, difficulty: string, jobRole?: string): string {
  return `
You are an expert tech recruiter.
Generate exactly 5 interview questions for the category: "${category}" (HR, Technical, Behavioral, or Company Specific) and difficulty level: "${difficulty}" (Easy, Medium, Hard).
${jobRole ? `Tailor the questions for the job role: "${jobRole}".` : ""}

Return the output ONLY as a valid JSON array of objects, with no extra text or explanations. Structure:
[
  {
    "id": 1,
    "question": "Question 1 text"
  },
  {
    "id": 2,
    "question": "Question 2 text"
  },
  ...
]
`;
}

export function buildInterviewFeedbackPrompt(
  question: string,
  answer: string,
  difficulty = "Medium",
  category = "General"
): string {
  return `
You are an expert interviewer.
Evaluate the user's answer to the interview question below.

Question: "${question}"
User's Answer: "${answer}"
Difficulty: "${difficulty}"
Category: "${category}"

Evaluate the answer and return ONLY a valid JSON object matching the following structure:
{
  "score": number from 0 to 100,
  "feedback": "General feedback about their response",
  "strengths": "Points they covered well or highlights",
  "weaknesses": "Points they missed or answered poorly",
  "tips": "Tips on how they can structure their answer better (e.g. STAR method)",
  "modelAnswer": "A professional, exemplary answer for this question"
}
`;
}

export function buildResumeClassificationPrompt(resumeText: string): string {
  return `
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
}

export function buildResumeParsingPrompt(resumeText: string): string {
  return `
You are an expert resume parser. Extract information from the following raw resume text and organize it into a structured JSON object.
Return ONLY valid JSON that matches the following structure exactly:
{
  "personalInfo": {
    "fullName": "Candidate's full name",
    "title": "Professional title (e.g., Software Engineer)",
    "email": "Email address",
    "phone": "Phone number",
    "location": "City, State/Country",
    "summary": "Professional summary or objective statement"
  },
  "skills": ["Skill 1", "Skill 2", ...],
  "education": [
    {
      "degree": "Degree/Diploma title",
      "institute": "School/University name",
      "location": "Location (City, State/Country)",
      "startYear": "Start year (YYYY)",
      "endYear": "End year or 'Present'",
      "description": "Any details like GPA, courses"
    }
  ],
  "experience": [
    {
      "role": "Job role title",
      "company": "Company name",
      "location": "Location",
      "startDate": "Start date (e.g. Month YYYY or YYYY)",
      "endDate": "End date or 'Present'",
      "description": "Responsibilities and achievements"
    }
  ],
  "projects": ["Project 1 detail", "Project 2 detail", ...],
  "certifications": ["Certification 1", "Certification 2", ...],
  "languages": ["Language 1", "Language 2", ...]
}

Make sure to preserve line breaks and detail in the descriptions. Do not invent any data; only extract what exists. If a field is not present, use an empty string or empty array.

Resume Text:
${resumeText.slice(0, 8000)}
`;
}

export function buildMockInterviewPrompt(topic: string, role: string, history: any[]): string {
  return `
You are a hiring manager interviewing a candidate for the role of "${role}".
The topic is "${topic}".

Previous interview flow:
${JSON.stringify(history)}

Generate the next question or response. Evaluate any answer if given, and return ONLY a valid JSON object matching:
{
  "feedback": "Short critique of candidate's last reply, if any. Keep it constructive.",
  "nextQuestion": "The next question you want to ask the candidate.",
  "isComplete": true or false if the interview should terminate (max 5 questions)
}
`;
}

export function buildSummaryPrompt(experienceText: string): string {
  return `
You are a professional resume writer.
Rewrite the following raw professional details into a compelling, ATS-friendly, and impact-driven professional summary (approx. 3-4 sentences).

Content:
"${experienceText}"

Return ONLY a valid JSON object:
{
  "summary": "The rewritten summary text"
}
`;
}

export function buildSkillSuggestionPrompt(role: string, currentSkills: string[]): string {
  return `
Analyze the target job role "${role}" and current skills: ${JSON.stringify(currentSkills)}.
Suggest a list of 10 relevant, high-demand skills the candidate should add.

Return ONLY a valid JSON object:
{
  "skills": ["Skill 1", "Skill 2", ...]
}
`;
}

export function buildProjectSuggestionPrompt(role: string, skills: string[]): string {
  return `
Suggest 3 portfolio projects matching the job role "${role}" and skills: ${JSON.stringify(skills)}.
Each project should contain a title, detailed description, key technical features, and recommended tech stack.

Return ONLY a valid JSON object matching:
{
  "projects": [
    {
      "title": "Project Title",
      "description": "Short description of project",
      "techStack": ["React", "Node", ...],
      "features": ["Feature 1", "Feature 2", ...]
    }
  ]
}
`;
}
