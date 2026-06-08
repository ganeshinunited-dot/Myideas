"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { searchJW } from "@/app/actions/searchJW";
import { Send, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English",  nativeLabel: "English",  flag: "🇬🇧" },
  { code: "ne", label: "Nepali",   nativeLabel: "नेपाली",    flag: "🇳🇵" },
  { code: "hi", label: "Hindi",    nativeLabel: "हिन्दी",    flag: "🇮🇳" },
  { code: "es", label: "Spanish",  nativeLabel: "Español",  flag: "🇪🇸" },
  { code: "fr", label: "French",   nativeLabel: "Français",  flag: "🇫🇷" },
];

export default function TryFreeAIPage() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string, links?: any[]}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateSmartResponse = (query: string, articles: any[], lang: string) => {
    if (articles.length === 0) {
      if (lang === "ne") return `मैले "${query}" को बारेमा JW.org मा कुनै लेख भेट्टाउन सकिनँ। कृपया फरक शब्द प्रयोग गरेर खोज्नुहोस्।`;
      if (lang === "hi") return `मुझे JW.org पर "${query}" के बारे में कोई लेख नहीं मिला। कृपया अलग शब्दों का प्रयोग करें।`;
      return `I couldn't find any direct articles on JW.org regarding "${query}". Try using different keywords or a more general topic!`;
    }

    let summary = "";
    if (lang === "ne") {
      summary = `मैले JW.org मा "${query}" सम्बन्धी केही राम्रा जानकारी फेला पारेको छु:\n\n`;
      articles.forEach((article, idx) => {
        let snippet = article.description;
        if (snippet.length > 120) snippet = snippet.substring(0, 120) + "...";
        summary += `${idx + 1}. "${article.title}": "${snippet}"\n\n`;
      });
      summary += `विस्तृत जानकारीका लागि तलका लिङ्कहरू खोल्नुहोस्।`;
    } else if (lang === "hi") {
      summary = `मैंने JW.org पर "${query}" से संबंधित कुछ उपयोगी जानकारी खोजी है:\n\n`;
      articles.forEach((article, idx) => {
        let snippet = article.description;
        if (snippet.length > 120) snippet = snippet.substring(0, 120) + "...";
        summary += `${idx + 1}. "${article.title}": "${snippet}"\n\n`;
      });
      summary += `अधिक जानकारी के लिए नीचे दिए गए लिंक खोलें।`;
    } else {
      summary = `I searched JW.org and found some excellent resources related to "${query}":\n\n`;
      articles.forEach((article, idx) => {
        let snippet = article.description;
        if (snippet.length > 120) snippet = snippet.substring(0, 120) + "...";
        summary += `${idx + 1}. "${article.title}": "${snippet}"\n\n`;
      });
      summary += `I have attached the direct links below so you can easily read them in full!`;
    }
    
    return summary;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const searchResults = await searchJW(userMessage, "all", selectedLang);
      const texts = (searchResults as any).texts || [];
      const topArticles = texts.slice(0, 3);
      
      const aiResponse = generateSmartResponse(userMessage, topArticles, selectedLang);

      setMessages(prev => [...prev, { 
          role: 'ai', 
          content: aiResponse,
          links: topArticles 
      }]);
      
    } catch (err) {
      console.error(err);
      const errorMsg = selectedLang === "ne" ? "माफ गर्नुहोस्, जानकारी खोज्दा समस्या आयो।" : "Sorry, I encountered an error while trying to fetch the information.";
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ height: "100dvh", background: "var(--color-bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Navbar />
      
      <div className="page-container" style={{ flex: 1, paddingBottom: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        
        {/* Header Area */}
        <div style={{ textAlign: "center", marginBottom: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 700, color: "var(--color-primary)", margin: 0 }}>
            Smart Assistance
          </h1>
          
          {/* Language Selector Pill */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 20, border: "1px solid var(--color-border)",
                background: "#fff", cursor: "pointer", fontSize: 13,
                fontWeight: 500, color: "var(--color-text-muted)"
              }}
            >
              <Globe size={14} />
              <span>{currentLang.nativeLabel}</span>
            </button>

            {langDropdownOpen && (
              <>
                <div onClick={() => setLangDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
                <div style={{
                  position: "absolute", top: "100%", marginTop: 4, left: "50%", transform: "translateX(-50%)",
                  background: "#fff", border: "1px solid var(--color-border)", borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 50, minWidth: 140, overflow: "hidden"
                }}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); setLangDropdownOpen(false); }}
                      style={{
                        display: "block", width: "100%", padding: "10px 16px", border: "none",
                        background: selectedLang === lang.code ? "var(--color-bg-alt)" : "transparent",
                        cursor: "pointer", fontSize: 14, textAlign: "left",
                        color: selectedLang === lang.code ? "var(--color-primary)" : "var(--color-text)",
                      }}
                    >
                      {lang.flag} {lang.nativeLabel}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Box - Edge-to-edge on mobile */}
        <div className="chat-container" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          
          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.length === 0 ? (
              <div style={{ margin: "auto", color: "var(--color-text-muted)", textAlign: "center", fontSize: "0.95rem" }}>
                {selectedLang === "ne" ? "प्रश्न सोध्न सुरु गर्नुहोस्!" : "Send a message to get started!"} <br/>
                <span style={{ opacity: 0.7, fontSize: "0.85rem", marginTop: 8, display: "block" }}>
                  {selectedLang === "ne" ? 'प्रयास गर्नुहोस्: "जीवनको उद्देश्य के हो?"' : 'Try: "What is the purpose of life?"'}
                </span>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  alignSelf: msg.role === 'user' ? "flex-end" : "flex-start",
                  maxWidth: "90%"
                }}>
                  <div style={{
                    background: msg.role === 'user' ? "var(--color-primary)" : "#f4f6f9",
                    color: msg.role === 'user' ? "#fff" : "var(--color-text)",
                    padding: "12px 16px",
                    borderRadius: msg.role === 'user' ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    lineHeight: 1.5,
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    {msg.content}
                  </div>
                  
                  {msg.links && msg.links.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      {msg.links.map((link: any, i: number) => (
                        <a key={i} href={link.link} target="_blank" rel="noopener noreferrer" style={{
                          display: "block", padding: 12, background: "#fff",
                          border: "1px solid var(--color-border)", borderRadius: 12,
                          textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                        }}>
                          <h4 style={{ color: "var(--color-primary)", margin: "0 0 6px 0", fontSize: "0.9rem", lineHeight: 1.3 }}>{link.title}</h4>
                          <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.8rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {link.description}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div style={{ alignSelf: "flex-start", background: "#f4f6f9", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                <span className="loading-dots">
                  {selectedLang === "ne" ? "खोज्दैछु" : "Searching"}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (Mobile Optimized Floating/Sticky) */}
          <div style={{ padding: "10px 16px", background: "#fff", borderTop: "1px solid var(--color-border)" }}>
            <form onSubmit={handleSend} style={{ 
              display: "flex", alignItems: "center",
              background: "var(--color-bg-alt)",
              borderRadius: 24, padding: "4px 4px 4px 16px",
              border: "1px solid var(--color-border)"
            }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedLang === "ne" ? "प्रश्न सोध्नुहोस्..." : "Ask a question..."} 
                disabled={isLoading}
                style={{ 
                  flex: 1, border: "none", background: "transparent",
                  fontSize: "16px", outline: "none", padding: "8px 0"
                }} 
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  background: isLoading || !input.trim() ? "transparent" : "var(--color-primary)",
                  color: isLoading || !input.trim() ? "var(--color-text-light)" : "#fff",
                  border: "none", borderRadius: "50%", width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: isLoading || !input.trim() ? "default" : "pointer",
                  transition: "all 0.2s ease", flexShrink: 0
                }}
              >
                <Send size={18} style={{ marginLeft: isLoading || !input.trim() ? 0 : -2 }} />
              </button>
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
        .loading-dots::after { content: '.'; animation: blink 1.4s infinite both; }
        .loading-dots { display: inline-block; position: relative; }
        .loading-dots::before { content: '..'; position: absolute; left: 100%; top: 0; animation: blink 1.4s infinite both; animation-delay: 0.2s; letter-spacing: 2px; }
      `}</style>
    </main>
  );
}
