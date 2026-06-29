"use client";

import { useState } from "react";
import { prepareMinistry } from "@/app/actions/ministryAction";
import { useTranslation } from "@/components/I18nProvider";
import Navbar from "@/components/Navbar";

export default function MinistryPage() {
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { lang, t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await prepareMinistry(situation, lang);
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container" style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "800px", margin: "0 auto", padding: "40px 0" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }} className="animate-fade-in">
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent",
            marginBottom: "12px"
          }}>
            {t("ministry.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>
            {t("ministry.subtitle")}
          </p>
        </div>

        <div className="glass-panel animate-fade-in" style={{ width: "100%", padding: "24px", marginBottom: "32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <textarea 
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={t("ministry.placeholder")}
              rows={3}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text)",
                fontSize: "1rem",
                resize: "none",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
            <button 
              type="submit" 
              disabled={!situation.trim() || loading}
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "#fff",
                border: "none",
                padding: "14px 24px",
                borderRadius: "16px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: (!situation.trim() || loading) ? "not-allowed" : "pointer",
                opacity: (!situation.trim() || loading) ? 0.7 : 1,
                transition: "all 0.2s ease",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {loading ? (
                <div className="typing-indicator" style={{ margin: 0, padding: 0 }}>
                  <div className="typing-dot" style={{ backgroundColor: "#fff" }}></div>
                  <div className="typing-dot" style={{ backgroundColor: "#fff" }}></div>
                  <div className="typing-dot" style={{ backgroundColor: "#fff" }}></div>
                </div>
              ) : (
                t("ministry.button")
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="animate-fade-in" style={{ width: "100%", padding: "16px", background: "#fee2e2", color: "#b91c1c", borderRadius: "16px", textAlign: "center", border: "1px solid #fca5a5" }}>
            {error}
          </div>
        )}

        {result && (
          <div className="glass-panel animate-fade-in" style={{ width: "100%", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div>
              <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-primary)", marginBottom: "8px" }}>Suggested Topic</h3>
              <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-text)" }}>{result.topic}</p>
            </div>

            <div style={{ background: "var(--color-bg-alt)", padding: "20px", borderRadius: "16px", borderLeft: "4px solid var(--color-accent)" }}>
              <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "8px" }}>Scripture</h3>
              <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-text)", fontStyle: "italic" }}>{result.scripture}</p>
            </div>

            <div>
              <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "8px" }}>Practical Advice</h3>
              <p style={{ fontSize: "1.1rem", color: "var(--color-text)", lineHeight: 1.6 }}>{result.advice}</p>
            </div>

            <div style={{ background: "var(--color-bg)", padding: "24px", borderRadius: "16px", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Conversation Starter
              </h3>
              <p style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--color-text)", lineHeight: 1.5 }}>"{result.starter}"</p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
