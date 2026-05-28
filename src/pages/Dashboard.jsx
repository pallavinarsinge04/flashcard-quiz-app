import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ onSelectDeck }) {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "decks"), (snapshot) => {
      const folders = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(deck => deck.userId === user.uid);
      
      setDecks(folders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    try {
      await addDoc(collection(db, "decks"), {
        title: newDeckTitle,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewDeckTitle("");
    } catch (err) {
      console.error("Error creating deck: ", err);
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "5px" }}>Syncing collections with server...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#0f172a", marginBottom: "25px" }}>Your Study Decks</h1>
      
      <form onSubmit={handleCreateDeck} style={{ display: "flex", gap: "10px", marginBottom: "30px", background: "#fff", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <input 
          type="text" 
          placeholder="Create new deck (e.g., JavaScript Fundamentals...)" 
          value={newDeckTitle}
          onChange={(e) => setNewDeckTitle(e.target.value)}
          style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem" }}
        />
        <button type="submit" style={{ padding: "12px 24px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>+ Create Deck</button>
      </form>

      {decks.length === 0 ? (
        <p style={{ color: "#64748b", textAlign: "center", padding: "40px", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>You haven't added any study modules yet. Create one above to get moving!</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
          {decks.map(deck => (
            <div 
              key={deck.id} 
              onClick={() => onSelectDeck(deck.id)}
              style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: "10px", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <h3 style={{ margin: "0 0 15px 0", color: "#1e293b" }}>{deck.title}</h3>
              <span style={{ fontSize: "0.85rem", color: "#3b82f6", fontWeight: "600" }}>Start Quiz →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}