import { useState } from "react";

const API = "http://localhost:5000";

function App() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerInput, setAnswerInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // start interview
  const startInterview = async () => {
    if (!role) return alert("Enter job role");

    setLoading(true);

    const res = await fetch(`${API}/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  // next question
  const nextQuestion = async () => {
    if (!answerInput) return alert("Write answer");

    const newAnswers = [...answers, answerInput];
    setAnswers(newAnswers);
    setAnswerInput("");

    if (current === questions.length - 1) {
      setLoading(true);

      const res = await fetch(`${API}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, answers: newAnswers }),
      });

      const data = await res.json();
      setResult(data);
      setLoading(false);
      return;
    }

    setCurrent(current + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          AI Interview
        </h1>

        {/* ROLE INPUT */}
        {questions.length === 0 && !result && (
          <div className="space-y-4">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter job role (Frontend Developer)"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
            />

            <button
              onClick={startInterview}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
            >
              {loading ? "Loading..." : "Start Interview"}
            </button>
          </div>
        )}

        {/* INTERVIEW */}
        {questions.length > 0 && !result && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">
              {questions[current]}
            </h2>

            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-3 h-32 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
            />

            <button
              onClick={nextQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
            >
              {loading ? "Evaluating..." : "Next"}
            </button>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Evaluation Result</h2>

            <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;