"use client";
import { useState, useEffect, useRef } from "react";
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
  { id: "anxiety", label: "Overcoming Anxiety", query: "anxiety worry stress" },
  { id: "peace", label: "Inner Peace", query: "peace of mind calmness" },
  { id: "grief", label: "Coping with Grief", query: "grief loss death" },
  { id: "purpose", label: "Finding Purpose", query: "meaning of life purpose" },
  { id: "resilience", label: "Building Resilience", query: "endurance strength courage" },
  { id: "family", label: "Family & Marriage", query: "family marriage parenting" },
  { id: "hope", label: "Seeking Hope", query: "hope future promises" },
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: 20 }}>
        <h1 style={{
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: 800,
          color: "var(--color-primary)",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          margin: 0,
        }}>
          Hi, I am Ganesh.
        </h1>
        {/* Verified Badge */}
        <div title="Verified Profile" style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          animation: "fade-in 1s ease-out forwards"
        }}>
          <svg viewBox="0 0 24 24" style={{ 
            width: "clamp(2rem, 6vw, 4rem)", 
            height: "clamp(2rem, 6vw, 4rem)", 
            filter: "drop-shadow(0 4px 6px rgba(34, 197, 94, 0.3))"
          }}>
            {/* 3D Drop shadow layer for the star */}
            <path d="M11.99 2.5L14.25 4.84L17.5 4.52L18.47 7.65L21.49 9.28L20.5 12.5L21.49 15.72L18.47 17.35L17.5 20.48L14.25 20.16L11.99 22.5L9.73 20.16L6.48 20.48L5.51 17.35L2.49 15.72L3.48 12.5L2.49 9.28L5.51 7.65L6.48 4.52L9.73 4.84L11.99 2.5Z" fill="#16a34a" />
            {/* Main star background */}
            <path d="M11.99 1.5L14.25 3.84L17.5 3.52L18.47 6.65L21.49 8.28L20.5 11.5L21.49 14.72L18.47 16.35L17.5 19.48L14.25 19.16L11.99 21.5L9.73 19.16L6.48 19.48L5.51 16.35L2.49 14.72L3.48 11.5L2.49 8.28L5.51 6.65L6.48 3.52L9.73 3.84L11.99 1.5Z" fill="#22c55e" />
            {/* 3D Checkmark Shadow */}
            <path d="M10.5 15.5L6.5 11.5L7.91 10.09L10.5 12.67L16.09 7.09L17.5 8.5L10.5 15.5Z" fill="#15803d" transform="translate(0, 0.5)" />
            {/* Main White Checkmark */}
            <path d="M10.5 15L6.5 11L7.91 9.59L10.5 12.17L16.09 6.59L17.5 8L10.5 15Z" fill="#ffffff" />
          </svg>
        </div>
      </div>
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

      {/* Emotion Section */}
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "24px",
        padding: "24px 0 24px",
        boxShadow: "0 10px 40px rgba(74, 109, 167, 0.15)", // JW Blue glow
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "32px",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Subtle top gradient bar to add more color pop */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary), var(--color-accent))" }}></div>

        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "16px", marginTop: "8px" }}>
          How are you feeling today?
        </h3>
        
        {/* Horizontal Scrollable Emotions */}
        <div 
          ref={scrollRef}
          className="hide-scrollbar" 
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUpOrLeave}
          onMouseUp={handleMouseUpOrLeave}
          onMouseMove={handleMouseMove}
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
            overflowX: "auto",
            padding: "0 24px 16px",
            WebkitOverflowScrolling: "touch",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none"
        }}>
          {EMOTIONS.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionClick(emotion)}
              style={{
                scrollSnapAlign: "start",
                whiteSpace: "nowrap",
                background: selectedEmotion === emotion.id ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))" : "var(--color-bg-alt)",
                color: selectedEmotion === emotion.id ? "#fff" : "var(--color-text)",
                border: selectedEmotion === emotion.id ? "1px solid transparent" : "1px solid var(--color-border)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "0.95rem",
                fontWeight: selectedEmotion === emotion.id ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                flexShrink: 0,
                boxShadow: selectedEmotion === emotion.id ? "0 4px 12px rgba(74, 109, 167, 0.3)" : "none"
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
          
          <form 
            onSubmit={handleCustomSubmit} 
            style={{ 
              display: "flex", 
              alignItems: "center",
              background: "var(--color-bg-alt)",
              border: "1px solid var(--color-border)",
              borderRadius: "30px",
              padding: "6px 6px 6px 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease",
              position: "relative"
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)"; }}
          >
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask anything (e.g. malai life katnai garo chha...)"
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
