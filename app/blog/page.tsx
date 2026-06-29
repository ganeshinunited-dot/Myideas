"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { generateSpeechAI } from "@/app/actions/chatAction";
import { FileText, Copy, CheckCircle } from "lucide-react";

export default function SpeechGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("5 minutes");
  const [language, setLanguage] = useState("Nepali");
  const [bibleVerse, setBibleVerse] = useState("");
  const [loading, setLoading] = useState(false);
  const [speechContent, setSpeechContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return alert("Please enter a topic");
    
    setLoading(true);
    setSpeechContent("");
    
    const res = await generateSpeechAI(topic, duration, language, bibleVerse);
    if (res.error) {
      alert(res.error);
    } else {
      setSpeechContent(res.text || "");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(speechContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-alt)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: "100px 20px 80px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, color: "var(--color-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
            Make Speech
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
            Create powerful, well-researched, and engaging speeches instantly.
          </p>
        </div>

        <div style={{ background: "var(--color-bg)", borderRadius: "20px", border: "1px solid var(--color-border)", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text)" }}>Subject(s) / Theme(s) of the Speech</label>
              <input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. The importance of education..."
                required
                style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--color-border)", fontSize: "1rem", outline: "none", background: "var(--color-bg-alt)", color: "var(--color-text)" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text)" }}>Bible Verse (Optional)</label>
              <textarea 
                value={bibleVerse}
                onChange={e => setBibleVerse(e.target.value)}
                placeholder="Paste a Bible verse here to weave into the speech..."
                style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--color-border)", fontSize: "1rem", outline: "none", background: "var(--color-bg-alt)", color: "var(--color-text)", minHeight: "80px", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text)" }}>Language</label>
                <select 
                  value={language} 
                  onChange={e => setLanguage(e.target.value)}
                  style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--color-border)", fontSize: "1rem", outline: "none", background: "var(--color-bg-alt)", color: "var(--color-text)", cursor: "pointer" }}
                >
                  <option value="Nepali">Nepali</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text)" }}>Duration</label>
                <select 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)}
                  style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--color-border)", fontSize: "1rem", outline: "none", background: "var(--color-bg-alt)", color: "var(--color-text)", cursor: "pointer" }}
                >
                  <option value="5 minutes">5 minutes</option>
                  <option value="10 minutes">10 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--color-primary)", color: "#fff", padding: "16px", borderRadius: "12px", border: "none", fontWeight: 600, fontSize: "1.05rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 10 }}
            >
              <FileText size={20} /> {loading ? "Preparing Speech..." : "Make Speech"}
            </button>
          </form>

          {speechContent && (
            <div style={{ marginTop: 40, borderTop: "1px solid var(--color-border)", paddingTop: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text)" }}>Your Speech</h2>
                <button 
                  onClick={handleCopy}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", color: "var(--color-text)", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 }}
                >
                  {copied ? <CheckCircle size={16} color="#10b981" /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>
              
              <div style={{ background: "var(--color-bg-alt)", padding: "24px", borderRadius: "16px", border: "1px solid var(--color-border)", maxHeight: "500px", overflowY: "auto" }}>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--color-text)", fontSize: "1.05rem", margin: 0 }}>
                  {speechContent}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
