"use client";
import { useState, useEffect, useRef } from "react";
import { searchJW } from "@/app/actions/searchJW";
import { processEmotionChat, generateConversationalAnswer } from "@/app/actions/chatAction";
import { useTranslation } from "./I18nProvider";
import { User, Bot } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content?: string;
  reasoning?: string;
  articles?: any[];
  isError?: boolean;
};

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
  
  // Chat History State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiLoading]);

  // Custom Input State
  const [customInput, setCustomInput] = useState("");

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
    if (dragMoved) return; 
    
    setCustomInput("");
    setIsAiLoading(true);

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: emotion.query };
    const currentHistory = [...chatHistory, userMessage];
    setChatHistory(currentHistory);
    
    try {
      const res: any = await searchJW(emotion.query, "all", lang); 
      if (res && res.texts && res.texts.length > 0) {
        const answerRes = await generateConversationalAnswer(currentHistory, emotion.query, res.texts.slice(0, 10), lang);
        
        setChatHistory(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: "ai", 
          content: answerRes.text || "Here are some articles I found:",
          articles: res.texts.slice(0, 10),
          isError: !!answerRes.error
        }]);
      } else {
        setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: "I couldn't find any articles about this.", isError: true }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: "Error fetching articles.", isError: true }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const query = customInput;
    setCustomInput("");
    setIsAiLoading(true);

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: query };
    const currentHistory = [...chatHistory, userMessage];
    setChatHistory(currentHistory);

    try {
      const aiRes = await processEmotionChat(query, currentHistory);
      
      if ("error" in aiRes && aiRes.error) {
        setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: "AI Error: " + aiRes.error, isError: true }]);
        return;
      }

      if ("keywords" in aiRes && aiRes.keywords) {
        const searchRes: any = await searchJW(aiRes.keywords as string, "all", (aiRes as any).lang || "en");
        if (searchRes && searchRes.texts && searchRes.texts.length > 0) {
          const answerRes = await generateConversationalAnswer(currentHistory, query, searchRes.texts.slice(0, 10), (aiRes as any).lang || "en");

          setChatHistory(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: "ai", 
            reasoning: aiRes.reasoning, 
            content: answerRes.text || "Here are some articles I found:",
            articles: searchRes.texts.slice(0, 10),
            isError: !!answerRes.error
          }]);
        } else {
          setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", reasoning: aiRes.reasoning, content: "I could not find any relevant articles on JW.org.", isError: true }]);
        }
      } else {
        setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: "Error understanding the question.", isError: true }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: "System Error. Please try again.", isError: true }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const isChatStarted = chatHistory.length > 0 || isAiLoading;

  return (
    <section className="hero-section" style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "80px 20px 180px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden" // To allow inner scrolling
    }}>
      
      {/* Top Visitor Counter */}
      {visitorCount !== null && !isChatStarted && (
        <div className="desktop-only" style={{
          background: "var(--color-bg-alt)",
          border: "1px solid var(--color-border)",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          color: "var(--color-text-muted)",
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

      {/* Dynamic Chat Area */}
      <div className="chat-history-container hide-scrollbar" style={{ zIndex: 10 }}>
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`chat-message-row ${msg.role}`} style={{ display: "flex", gap: "12px", alignItems: "flex-start", width: "100%", justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'ai' && (
              <div style={{ background: "var(--color-primary)", color: "#fff", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bot size={20} />
              </div>
            )}
            <div className={`chat-bubble ${msg.role} ${msg.isError ? 'error' : ''}`} style={{ maxWidth: "85%", borderRadius: "16px", padding: "16px", textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", background: msg.role === 'user' ? "var(--color-bg-alt)" : "var(--color-bg)", border: "1px solid var(--color-border)" }}>
              {msg.reasoning && (
                <details className="reasoning-container">
                  <summary className="reasoning-toggle" style={{ listStyle: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Thought Process
                  </summary>
                  <div className="reasoning-content" style={{ fontSize: "0.85rem", padding: "8px", background: "rgba(0,0,0,0.03)", borderRadius: "8px", marginBottom: "12px" }}>
                    {msg.reasoning}
                  </div>
                </details>
              )}
              {msg.content && (
                <div style={{ color: msg.isError ? "#ff4d4f" : "var(--color-text)", fontSize: "1rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </div>
              )}
              {msg.articles && msg.articles.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Sources from JW.org:
                  </p>
                  {msg.articles.map((article, i) => (
                    <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "block",
                      padding: "12px",
                      background: "var(--color-bg-alt)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "10px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                      textAlign: "left"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--color-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
                    >
                      <h4 style={{ color: "var(--color-primary)", margin: "0 0 6px 0", fontSize: "0.95rem", lineHeight: 1.3 }}>{article.title}</h4>
                      <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.85rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {article.description}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div style={{ background: "var(--color-text)", color: "var(--color-bg)", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        
        {isAiLoading && (
          <div className="chat-message-row ai" style={{ display: "flex", gap: "12px", alignItems: "flex-start", width: "100%" }}>
            <div style={{ background: "var(--color-primary)", color: "#fff", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={20} />
            </div>
            <div className="chat-bubble ai" style={{ maxWidth: "85%", borderRadius: "16px", padding: "16px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center" }}>
              <div className="typing-indicator" style={{ margin: 0 }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
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
