"use client";
import { useState, useEffect } from "react";
import { searchJW } from "@/app/actions/searchJW";
import { processEmotionChat } from "@/app/actions/chatAction";

const quotes = [
  "I'm not perfect at anything; I'm just a lifelong learner.",
  "Every day is a chance to learn something completely new.",
  "I don't have all the answers, but I have the curiosity to find them.",
  "Striving for progress and growth, not perfection.",
  "A student of life, learning one step at a time.",
  "Embracing my imperfections while constantly growing.",
  "I know very little, and that's exactly why I want to learn everything.",
  "Perfection is an illusion; continuous learning is reality.",
  "My biggest strength is knowing how much I still have to learn.",
  "I am on a beautiful journey of endless discovery.",
];

const EMOTIONS = [
  { id: "worried", label: "Worried 😟", query: "anxiety worry" },
  { id: "sad", label: "Sad 😢", query: "sadness depression grief" },
  { id: "discouraged", label: "Discouraged 😞", query: "discouraged feeling down" },
  { id: "thankful", label: "Thankful 🙏", query: "gratitude thankful" },
  { id: "strength", label: "Need Strength 💪", query: "endurance strength from God" },
  { id: "angry", label: "Angry 😠", query: "anger control resentment" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  
  // Emotion state
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [loadingEmotion, setLoadingEmotion] = useState(false);
  const [emotionArticles, setEmotionArticles] = useState<any[]>([]);

  // Custom AI State
  const [customInput, setCustomInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Fetch and increment visitor count
    fetch("https://api.counterapi.dev/v1/ganeshkarki/portfolio/up")
      .then(res => res.json())
      .then(data => {
        if (data && data.count) setVisitorCount(data.count);
      })
      .catch(err => console.error("Error fetching visitor count:", err));

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500); 
    }, 4500); 

    return () => clearInterval(interval);
  }, []);

  const handleEmotionClick = async (emotion: typeof EMOTIONS[0]) => {
    if (selectedEmotion === emotion.id) {
      setSelectedEmotion(null);
      setEmotionArticles([]);
      return;
    }
    
    setCustomInput("");
    setSelectedEmotion(emotion.id);
    setLoadingEmotion(true);
    setEmotionArticles([]);
    
    try {
      const res: any = await searchJW(emotion.query, "all", "en"); 
      if (res && res.texts) {
        setEmotionArticles(res.texts.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmotion(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setSelectedEmotion(null);
    setEmotionArticles([]);
    setIsAiLoading(true);

    try {
      const aiRes = await processEmotionChat(customInput);
      
      if (aiRes.error) {
        console.error(aiRes.error);
        return;
      }

      // Fetch JW.org articles using the extracted keywords and detected language
      if (aiRes.keywords) {
        const searchRes: any = await searchJW(aiRes.keywords, "all", aiRes.lang || "en");
        if (searchRes && searchRes.texts) {
          setEmotionArticles(searchRes.texts.slice(0, 3));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section className="hero-section" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 20px 80px",
      textAlign: "center",
      position: "relative",
    }}>
      
      {/* Top Visitor Counter */}
      {visitorCount !== null && (
        <div style={{
          background: "var(--color-bg-alt)",
          border: "1px solid var(--color-border)",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          color: "var(--color-text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          marginBottom: "24px"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-primary)" }}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span style={{ fontWeight: 600 }}>{visitorCount.toLocaleString()}</span> visitors
        </div>
      )}

      <h1 style={{
        fontSize: "clamp(2.5rem, 8vw, 5rem)",
        fontWeight: 800,
        color: "var(--color-primary)",
        letterSpacing: "-0.04em",
        lineHeight: 1.1,
        marginBottom: 20,
      }}>
        Hi, I am Ganesh.
      </h1>
      <p style={{
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        color: "var(--color-text-muted)",
        maxWidth: 600,
        lineHeight: 1.6,
        marginBottom: 32,
        opacity: fade ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}>
        &quot;{quotes[index]}&quot;
      </p>

      {/* Emotion & AI Section */}
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "#ffffff",
        border: "1px solid var(--color-border)",
        borderRadius: "24px",
        padding: "24px 0 24px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "32px",
        overflow: "hidden"
      }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "16px" }}>
          How are you feeling today?
        </h3>
        
        {/* Horizontal Scrollable Emotions */}
        <div className="hide-scrollbar" style={{
          display: "flex",
          gap: "12px",
          width: "100%",
          overflowX: "auto",
          padding: "0 24px 16px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}>
          {EMOTIONS.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionClick(emotion)}
              style={{
                scrollSnapAlign: "start",
                whiteSpace: "nowrap",
                background: selectedEmotion === emotion.id ? "var(--color-primary)" : "var(--color-bg-alt)",
                color: selectedEmotion === emotion.id ? "#fff" : "var(--color-text)",
                border: selectedEmotion === emotion.id ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                flexShrink: 0
              }}
            >
              {emotion.label}
            </button>
          ))}
        </div>

        {/* AI Custom Input */}
        <div style={{ width: "100%", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", margin: "8px 0 16px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }}></div>
            <span style={{ padding: "0 12px", fontSize: "0.8rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }}></div>
          </div>
          
          <form onSubmit={handleCustomSubmit} style={{ display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type how you feel (e.g. malai life katnai garo chha...)"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                fontSize: "0.95rem",
                outline: "none",
                background: "var(--color-bg-alt)",
              }}
            />
            <button 
              type="submit" 
              disabled={!customInput.trim() || isAiLoading}
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                padding: "0 20px",
                fontWeight: 600,
                cursor: (!customInput.trim() || isAiLoading) ? "not-allowed" : "pointer",
                opacity: (!customInput.trim() || isAiLoading) ? 0.7 : 1,
                transition: "background 0.2s ease"
              }}
            >
              Ask
            </button>
          </form>
        </div>

        {/* Dynamic Results Area */}
        {(selectedEmotion || isAiLoading || emotionArticles.length > 0) && (
          <div style={{ width: "100%", padding: "0 24px", textAlign: "left", marginTop: "24px" }}>
            {(loadingEmotion || isAiLoading) ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px 0", color: "var(--color-primary)", fontWeight: 500, fontSize: "0.9rem" }}>
                <span className="loading-dots">{isAiLoading ? "Finding the best articles" : "Finding the best articles"}</span>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {emotionArticles.length > 0 ? (
                  <>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "0px", fontWeight: 600 }}>Suggested reading for you:</p>
                    {emotionArticles.map((article, i) => (
                      <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" style={{
                        display: "block",
                        padding: "16px",
                        background: "var(--color-bg-alt)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        textDecoration: "none",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <h4 style={{ color: "var(--color-primary-dark)", margin: "0 0 6px 0", fontSize: "0.95rem", lineHeight: 1.3 }}>{article.title}</h4>
                        <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.85rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {article.description}
                        </p>
                      </a>
                    ))}
                  </>
                ) : (
                  <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem", padding: "16px" }}>
                    Could not find specific articles right now.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Copyright */}
      <div style={{
        color: "var(--color-text-light)",
        fontSize: "13px",
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        <span>&copy; {new Date().getFullYear()} Ganesh Karki</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/privacy-policy" style={{ color: "var(--color-text-light)", textDecoration: "none", fontSize: 12 }}>Terms & Privacy Policy</a>
        </div>
      </div>
    </section>
  );
}
