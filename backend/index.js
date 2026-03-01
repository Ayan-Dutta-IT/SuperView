import express from "express";
import cors from "cors";
import { generateQuestions, evaluateAnswers } from "./ollama.js";

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

/*
==============================
Generate Interview Questions
==============================
Body:
{
  "role": "Frontend Developer"
}
*/
app.post("/generate-questions", async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const questions = await generateQuestions(role);

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

/*
==============================
Evaluate Candidate Answers
==============================
Body:
{
  "role": "Frontend Developer",
  "answers": ["answer1", "answer2"]
}
*/
app.post("/evaluate", async (req, res) => {
  try {
    const { role, answers } = req.body;

    if (!role || !answers) {
      return res.status(400).json({ error: "Role and answers required" });
    }

    const result = await evaluateAnswers(role, answers);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});