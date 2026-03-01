/*
========================================
Ollama AI Functions
- generateQuestions(role)
- evaluateAnswers(role, answers)
========================================
*/
import 'dotenv/config';
import { Ollama } from 'ollama';

// Initialize Ollama client for Ollama Cloud
const client = new Ollama({
  host: "https://ollama.com",
  headers: {
    'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY
  }
});

const MODEL = "gpt-oss:120b";

/*
========================================
Helper: Call Ollama API
========================================
*/
async function callOllama(prompt) {
  try {
    const response = await client.chat({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });
    
    if (!response || !response.message || !response.message.content) {
      throw new Error("Invalid response format from Ollama Cloud");
    }

    return response.message.content.trim();
  } catch (error) {
    console.error("Error communicating with Ollama Cloud:", error.message);
    throw error;
  }
}

/*
========================================
Generate Interview Questions
========================================
Input: role (string)
Output: array of questions
========================================
*/
export async function generateQuestions(role) {
  const prompt = `
You are an expert interviewer.

Generate exactly 5 short interview questions for a ${role}.

Rules:
- Keep questions simple
- Return only a numbered list
- No explanations
`;

  const text = await callOllama(prompt);

  // Convert numbered list → array
  const questions = text
    .split("\n")
    .map((q) => q.replace(/^\d+[\).\s-]*/, "").trim())
    .filter((q) => q.length > 0);

  return questions;
}

/*
========================================
Evaluate Candidate Answers
========================================
Input: role, answers[]
Output: structured evaluation
========================================
*/
export async function evaluateAnswers(role, answers) {
  const formattedAnswers = answers
    .map((ans, i) => `Q${i + 1}: ${ans}`)
    .join("\n");

  const prompt = `
You are an expert hiring manager.

Evaluate a candidate for the role of ${role}.

Candidate answers:
${formattedAnswers}

Return response strictly in JSON format:

{
  "communication_score": number (1-10),
  "technical_score": number (1-10),
  "strengths": "text",
  "weaknesses": "text",
  "hire_recommendation": "Hire or No Hire"
}
`;

  const text = await callOllama(prompt);

  // Try parsing JSON safely
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    const cleanJSON = text.substring(jsonStart, jsonEnd);
    return JSON.parse(cleanJSON);
  } catch (err) {
    console.error("Failed parsing AI response:", text);

    return {
      communication_score: 5,
      technical_score: 5,
      strengths: "Could not parse AI response",
      weaknesses: "Retry evaluation",
      hire_recommendation: "Unknown",
    };
  }
}