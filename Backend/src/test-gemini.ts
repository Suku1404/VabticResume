import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "UNDEFINED");

async function testGemini() {
  const prompt = "Hello, respond with a short message if you can hear me.";
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

  for (const model of models) {
    try {
      console.log(`Testing model ${model}...`);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { timeout: 10000 }
      );
      console.log(`Success with ${model}! Response:`);
      console.log(JSON.stringify(response.data, null, 2));
      return;
    } catch (err: any) {
      console.error(`Failed with ${model}:`, err.response?.status, err.response?.data || err.message);
    }
  }
}

testGemini();
