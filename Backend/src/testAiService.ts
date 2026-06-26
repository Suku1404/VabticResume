import dotenv from "dotenv";
import path from "path";

// Load configuration
dotenv.config({ path: path.join(__dirname, "../.env") });

import { aiService } from "./modules/ai";

async function runTests() {
  console.log("=== Starting AI Service Refactor Verification ===");

  // Test 1: Classify Resume
  try {
    console.log("\n[Test 1] Classifying a sample resume...");
    const sampleResumeText = "John Doe\nEmail: john.doe@email.com\nSkills: React, Node, SQL\nExperience:\nSoftware Engineer at ABC Corp\n- Built full stack applications";
    const classification = await aiService.classifyResume({ resumeText: sampleResumeText });
    console.log("Classification result:", classification);
  } catch (err: any) {
    console.error("Test 1 failed:", err.message);
  }

  // Test 2: Caching Validation
  try {
    console.log("\n[Test 2] Testing Caching (First call)...");
    const role = "Backend Developer";
    const currentSkills = ["Node.js", "Express"];
    
    const startTime1 = Date.now();
    const skills1 = await aiService.generateSkills(role, currentSkills);
    const duration1 = Date.now() - startTime1;
    console.log(`First call skills: ${JSON.stringify(skills1)} (took ${duration1}ms)`);

    console.log("Testing Caching (Second call, should hit cache)...");
    const startTime2 = Date.now();
    const skills2 = await aiService.generateSkills(role, currentSkills);
    const duration2 = Date.now() - startTime2;
    console.log(`Second call skills: ${JSON.stringify(skills2)} (took ${duration2}ms)`);
    
    if (duration2 < 50) {
      console.log("SUCCESS: Cache hit confirmed (second call completed almost instantly).");
    } else {
      console.warn("WARNING: Cache hit did not complete instantly. Check caching service.");
    }
  } catch (err: any) {
    console.error("Test 2 failed:", err.message);
  }

  // Test 3: Suggest Portfolio Projects
  try {
    console.log("\n[Test 3] Requesting portfolio projects suggestion...");
    const projects = await aiService.generateProjects("React Developer", ["React", "TypeScript", "Tailwind CSS"]);
    console.log("Suggested Projects count:", projects.length);
    console.log("First project title:", projects[0]?.title);
    console.log("First project tech stack:", projects[0]?.techStack);
  } catch (err: any) {
    console.error("Test 3 failed:", err.message);
  }

  console.log("\n=== AI Service Verification Completed ===");
}

runTests();
