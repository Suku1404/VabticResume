import axios from "axios";

export const classifyResumeWithAI = async(resumeText:string) =>{
    const prompt =`
    You are an ATS resume Classifier.

    Check whether the following extracted PDF text is actually resume/cv.

    Return ONLY valid JSON :
    {
    "isResume": true or false,
    "confidence": number from 0 to 100,
    "reason":"short reason"
    }
    Rules:
- A resume usually contains name, email/phone, education, skills, projects, experience, internship, certifications, links.
- If it is an invoice, notes, story, question paper, article, book page, or random PDF, return false.

PDF Text:
${resumeText.slice(0, 8000)}
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  const aiText =
    response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const cleanJson = aiText.replace(/```json|```/g, "").trim();

  return JSON.parse(cleanJson);
};