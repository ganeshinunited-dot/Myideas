"use client";
import { useState, useEffect, useRef } from "react";
import { searchJW } from "@/app/actions/searchJW";
import { processEmotionChat } from "@/app/actions/chatAction";
import { useTranslation } from "./I18nProvider";

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
  { id: "anxiety", labelKey: "emotion.anxiety", query: "anxiety worry stress" },
  { id: "peace", labelKey: "emotion.peace", query: "peace of mind calmness" },
  { id: "grief", labelKey: "emotion.grief", query: "grief loss death" },
  { id: "purpose", labelKey: "emotion.purpose", query: "meaning of life purpose" },
  { id: "resilience", labelKey: "emotion.resilience", query: "endurance strength courage" },
  { id: "family", labelKey: "emotion.family", query: "family marriage parenting" },
  { id: "hope", labelKey: "emotion.hope", query: "hope future promises" },
];

export default function Hero() {
  const { t, lang } = useTranslation();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  
  // Emotion state
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [loadingEmotion, setLoadingEmotion] = useState(false);
  const [emotionArticles, setEmotionArticles] = useState<any[]>([]);

  // Custom AI State
  const [customInput, setCustomInput] = useState("");
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Drag to scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast multiplier
    if (Math.abs(walk) > 5) setDragMoved(true);
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleEmotionClick = async (emotion: typeof EMOTIONS[0]) => {
    if (dragMoved) return; // Prevent click if the user was dragging

    if (selectedEmotion === emotion.id) {
      setSelectedEmotion(null);
      setEmotionArticles([]);
      setErrorMessage(null);
      return;
    }
    
    setCustomInput("");
    setLastQuery(emotion.query);
    setSelectedEmotion(emotion.id);
    setLoadingEmotion(true);
    setEmotionArticles([]);
    setErrorMessage(null);
    
    try {
      const res: any = await searchJW(emotion.query, "all", lang); 
      if (res && res.texts) {
        setEmotionArticles(res.texts.slice(0, 50));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching articles.");
    } finally {
      setLoadingEmotion(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setSelectedEmotion(null);
    setLastQuery(customInput);
    setEmotionArticles([]);
    setErrorMessage(null);
    setIsAiLoading(true);

    try {
      const aiRes = await processEmotionChat(customInput);
      
      if ("error" in aiRes && aiRes.error) {
        console.error(aiRes.error);
        setErrorMessage("AI Error: " + aiRes.error);
        return;
      }

      // Fetch JW.org articles using the extracted keywords and detected language
      if ("keywords" in aiRes && aiRes.keywords) {
        const searchRes: any = await searchJW(aiRes.keywords as string, "all", (aiRes as any).lang || "en");
        if (searchRes && searchRes.texts) {
          setEmotionArticles(searchRes.texts.slice(0, 50));
        } else {
          setErrorMessage("No articles found.");
        }
      } else {
        setErrorMessage("Error extracting keywords.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("System Error. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const isChatStarted = isAiLoading || emotionArticles.length > 0 || errorMessage;

  return (
    <section className="hero-section" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "100px 20px 180px",
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
          <span style={{ fontWeight: 600 }}>{visitorCount.toLocaleString()}</span> {t("hero.visitors")}
        </div>
      )}



      {/* Dynamic Results Area */}
      <div style={{ width: "100%", maxWidth: "600px", zIndex: 10 }}>
        {(selectedEmotion || isAiLoading || emotionArticles.length > 0 || errorMessage) && (
          <div style={{ width: "100%", textAlign: "left", marginBottom: "40px" }}>
            {lastQuery && (
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                marginBottom: "24px",
                padding: "0 16px"
              }}>
                <div style={{
                  background: "var(--color-bg-alt)",
                  color: "var(--color-text)",
                  padding: "12px 20px",
                  borderRadius: "20px 20px 4px 20px",
                  fontSize: "1rem",
                  maxWidth: "85%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  border: "1px solid var(--color-border)",
                  wordBreak: "break-word"
                }}>
                  {lastQuery}
                </div>
              </div>
            )}
            
            {(loadingEmotion || isAiLoading) ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0", color: "var(--color-primary)", fontWeight: 500, fontSize: "1.1rem" }}>
                <span className="loading-dots">{isAiLoading ? "Finding the best articles" : "Finding the best articles"}</span>
              </div>
            ) : errorMessage ? (
              <p style={{ textAlign: "center", color: "#ff4d4f", fontSize: "0.9rem", padding: "16px", background: "rgba(255, 77, 79, 0.1)", borderRadius: "8px", border: "1px solid rgba(255, 77, 79, 0.3)" }}>
                {errorMessage}
              </p>
            ) : (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {emotionArticles.length > 0 ? (
                  <>
                    {emotionArticles.map((article, i) => (
                      <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" style={{
                        display: "block",
                        padding: "16px",
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        textDecoration: "none",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.02)"; }}
                      >
                        <h4 style={{ color: "var(--color-primary-dark)", margin: "0 0 6px 0", fontSize: "1.05rem", lineHeight: 1.3 }}>{article.title}</h4>
                        <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.9rem", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {article.description}
                        </p>
                      </a>
                    ))}
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

        {/* Fixed Chat Input Area */}
      <div className="chat-box-container">
        {!isChatStarted && (
          <h3 style={{ 
            fontSize: "1.4rem", 
            fontWeight: 800, 
            textAlign: "center", 
            marginBottom: "20px", 
            marginTop: "12px", 
            background: "linear-gradient(135deg, var(--color-primary), #00ffff)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}>
            {t("hero.question")}
          </h3>
        )}
        
        <div style={{ width: "100%" }}>
          <div className="animated-border-box">
            <form 
              onSubmit={handleCustomSubmit} 
              className="animated-border-box-inner"
            >
              <input 
                type="text" 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={t("search.placeholder")}
                style={{
                  flex: 1,
                  border: "none",
                  fontSize: "0.95rem",
                  outline: "none",
                  background: "transparent",
                  color: "var(--color-text)"
                }}
              />
              <button 
                type="submit" 
                disabled={!customInput.trim() || isAiLoading}
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: (!customInput.trim() || isAiLoading) ? "not-allowed" : "pointer",
                  opacity: (!customInput.trim() || isAiLoading) ? 0.5 : 1,
                  transition: "all 0.2s ease",
                  transform: (!customInput.trim() || isAiLoading) ? "scale(0.95)" : "scale(1)",
                  boxShadow: (!customInput.trim() || isAiLoading) ? "none" : "0 4px 12px rgba(74, 109, 167, 0.4)"
                }}
                title="Search"
              >
                {isAiLoading ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                )}
              </button>
            </form>
          </div>
          
          <div style={{
            color: "var(--color-text-light)",
            fontSize: "12px",
            marginTop: 12,
            textAlign: "center"
          }}>
            &copy; {new Date().getFullYear()} Ganesh Karki
          </div>
        </div>
      </div>
    </section>
  );
}
