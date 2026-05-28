import { useState, useEffect } from "react";
import "./Flashcard.css";

export default function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [card]);

  return (
    <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard-inner ${flipped ? "is-flipped" : ""}`}>
        
        <div className="flashcard-face flashcard-front">
          <div className="card-label">QUESTION</div>
          <p className="card-text">{card.front}</p>
          <span className="hint-text">💡 Click card to reveal answer</span>
        </div>

        <div className="flashcard-face flashcard-back">
          <div className="card-label">ANSWER</div>
          <p className="card-text">{card.back}</p>
          <span className="hint-text" style={{ color: "#93c5fd" }}>Click card to see question</span>
        </div>

      </div>
    </div>
  );
}