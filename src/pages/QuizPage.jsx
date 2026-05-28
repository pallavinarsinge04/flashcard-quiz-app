import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import Flashcard from "../components/Flashcard";

export default function QuizPage({ deckId }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "flashcards"), where("deckId", "==", deckId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlashcards(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deckId]);

  const handleAnswer = (wasCorrect) => {
    if (wasCorrect) setScore(prev => prev + 1);

    const nextIndex = currentIndex + 1;
    if (nextIndex < flashcards.length) {
      setCurrentIndex(nextIndex);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading Cards...</div>;
  
  if (flashcards.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <h3>No cards found in this deck.</h3>
        <p style={{ color: "#64748b" }}>Add card documents into the Firestore collection matching deckId field value: <br/><code>{deckId}</code></p>
      </div>
    );
  }

  const progressPercent = Math.round((currentIndex / flashcards.length) * 100);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      {!quizFinished ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.9rem", fontWeight: "500" }}>
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <span>Score: {score}</span>
          </div>

          <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "3px", margin: "10px 0 30px" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: "#3b82f6", borderRadius: "3px", transition: "width 0.3s ease" }}></div>
          </div>

          <Flashcard card={flashcards[currentIndex]} />

          <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
            <button 
              onClick={() => handleAnswer(false)} 
              style={{ flex: 1, padding: "14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
            >
              ❌ Incorrect
            </button>
            <button 
              onClick={() => handleAnswer(true)} 
              style={{ flex: 1, padding: "14px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
            >
              ✅ Correct
            </button>
          </div>
        </>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "40px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h2 style={{ margin: "0 0 10px 0" }}>Quiz Completed! 🎉</h2>
          <p style={{ fontSize: "1.25rem", margin: "20px 0", color: "#334155" }}>
            You scored <strong>{score}</strong> out of <strong>{flashcards.length}</strong> ({Math.round((score / flashcards.length) * 100)}%)
          </p>
          <button 
            onClick={restartQuiz} 
            style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}