import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";

export default function App() {
  const { user, login, logout } = useAuth();
  const [currentDeckId, setCurrentDeckId] = useState(null);
  
  // Local state form handles for authentication inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      await login(email, password);
    } catch (err) {
      setAuthError("Invalid email or password credentials.");
    }
  };

  // 1. Unauthenticated Wall (If user is not logged in, force Login screen)
  if (!user) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontFamily: "system-ui" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign In to Study</h2>
        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          </div>
          {authError && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{authError}</p>}
          <button type="submit" style={{ padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Login</button>
        </form>
      </div>
    );
  }

  // 2. Application UI Shell Framework
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Universal Top Application Bar */}
      <nav style={{ background: "#fff", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
        <span style={{ fontWeight: "700", fontSize: "1.2rem", color: "#1e293b", cursor: "pointer" }} onClick={() => setCurrentDeckId(null)}>⚡ FlashQuiz</span>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ color: "#64748b", fontSize: "0.9rem" }}>{user.email}</span>
          <button onClick={logout} style={{ padding: "6px 12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", color: "#475569" }}>Log Out</button>
        </div>
      </nav>

      {/* Main Container Core Router Simulation */}
      <main style={{ padding: "20px" }}>
        {currentDeckId ? (
          <div>
            <button onClick={() => setCurrentDeckId(null)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "1rem", marginBottom: "20px" }}>← Back to Decks</button>
            <QuizPage deckId={currentDeckId} />
          </div>
        ) : (
          <Dashboard onSelectDeck={(deckId) => setCurrentDeckId(deckId)} />
        )}
      </main>
    </div>
  );
}