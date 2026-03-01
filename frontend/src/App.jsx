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
    if (!role.trim()) return alert("Please enter a job role.");

    setLoading(true);

    try {
      const res = await fetch(`${API}/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        alert("Could not generate questions. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // next question
  const nextQuestion = async () => {
    if (!answerInput.trim()) return alert("Please write an answer.");

    const newAnswers = [...answers, answerInput];
    setAnswers(newAnswers);
    setAnswerInput("");

    if (current === questions.length - 1) {
      setLoading(true);

      try {
        const res = await fetch(`${API}/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, answers: newAnswers }),
        });

        const data = await res.json();
        setResult(data);
      } catch (e) {
        console.error(e);
        alert("Failed to evaluate answers.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setCurrent(current + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 font-sans relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="w-full max-w-2xl glass-panel text-white rounded-3xl p-8 sm:p-12 relative z-10 animate-fade-in shadow-2xl transition-all duration-500">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-3">
            SuperView AI
          </h1>
          <p className="text-slate-400 font-medium">Your intelligent interview companion</p>
        </div>

        {/* ROLE INPUT */}
        {questions.length === 0 && !result && (
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-slate-300 ml-1">
                Target Role
              </label>
              <input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 shadow-inner"
              />
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/25 border border-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10 font-bold flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing...
                  </>
                ) : "Start Interview"}
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </div>
        )}

        {/* INTERVIEW */}
        {questions.length > 0 && !result && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">Question {current + 1} of {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 flex-1 ${idx === current ? 'w-6 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : idx < current ? 'w-2 bg-indigo-500/80' : 'w-2 bg-slate-700'}`}></div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-8">
              {questions[current]}
            </h2>

            <div className="space-y-3 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type your comprehensive answer here..."
                className="relative w-full p-5 h-48 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-0 leading-relaxed resize-none transition-all"
              />
            </div>

            <button
              onClick={nextQuestion}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-500/25 border border-purple-500/30 mt-4 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Evaluating...
                </>
              ) : (
                <>
                  {current === questions.length - 1 ? "Submit & View Results" : "Next Question"}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2">Evaluation Complete</h2>
            <p className="text-slate-400 text-center mb-8">Here's your feedback based on the interview.</p>

            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 shadow-inner max-h-[50vh] overflow-y-auto custom-scrollbar">
              <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl font-bold text-lg transition-all duration-300 mt-6 cursor-pointer"
            >
              Start New Interview
            </button>
          </div>
        )}

      </div>

      {/* Global CSS for shimmer effect and scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}} />
    </div>
  );
}

export default App;