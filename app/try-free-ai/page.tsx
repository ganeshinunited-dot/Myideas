"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { searchJW } from "@/app/actions/searchJW";

export default function TryFreeAIPage() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string, links?: any[]}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateSmartResponse = (query: string, articles: any[]) => {
    if (articles.length === 0) {
      return `I couldn't find any direct articles on JW.org regarding "${query}". Try using different keywords or a more general topic!`;
    }

    const openers = [
      `I searched JW.org and found some excellent resources related to "${query}".`,
      `Here is what I found on JW.org regarding your question about "${query}".`,
      `I've gathered some helpful information from JW.org about "${query}".`
    ];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    
    let summary = `${opener}\n\n`;
    
    articles.forEach((article, idx) => {
      let snippet = article.description;
      if (snippet.length > 120) snippet = snippet.substring(0, 120) + "...";
      
      if (idx === 0) {
        summary += `The primary article, "${article.title}", explains: "${snippet}"\n\n`;
      } else if (idx === 1) {
        summary += `Another great resource is "${article.title}", which mentions: "${snippet}"\n\n`;
      } else {
        summary += `You might also find "${article.title}" useful for more context.\n\n`;
      }
    });

    summary += `I have attached the direct links below so you can easily review them and decide which one you'd like to read in full!`;
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
      const searchResults = await searchJW(userMessage, "all");
      const texts = (searchResults as any).texts || [];
      const topArticles = texts.slice(0, 3);
      
      const aiResponse = generateSmartResponse(userMessage, topArticles);

      setMessages(prev => [...prev, { 
          role: 'ai', 
          content: aiResponse,
          links: topArticles 
      }]);
      
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error while trying to fetch the information." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div className="page-container" style={{ flex: 1, paddingBottom: 0 }}>
        
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>
            JW Smart Assistant
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Ask a question and I'll find & summarize JW.org articles!
          </p>
        </div>

        {/* Chat Box - Edge-to-edge on mobile */}
        <div className="chat-container">
          
          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px", scrollBehavior: "smooth" }}>
            {messages.length === 0 ? (
              <div style={{ margin: "auto", color: "var(--color-text-muted)", textAlign: "center", fontSize: "0.9rem" }}>
                Send a message to get started! <br/>Try: &quot;What is the purpose of life?&quot;
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
                    padding: "14px 16px",
                    borderRadius: msg.role === 'user' ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    lineHeight: 1.5,
                    fontSize: "0.9rem",
                    whiteSpace: "pre-wrap"
                  }}>
                    {msg.content}
                  </div>
                  
                  {msg.links && msg.links.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                      {msg.links.map((link: any, i: number) => (
                        <a key={i} href={link.link} target="_blank" rel="noopener noreferrer" style={{
                          display: "block",
                          padding: 10,
                          background: "#fff",
                          border: "1px solid var(--color-border)",
                          borderRadius: 8,
                          textDecoration: "none",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                        }}>
                          <h4 style={{ color: "var(--color-primary)", margin: "0 0 4px 0", fontSize: "0.85rem", lineHeight: 1.3 }}>{link.title}</h4>
                          <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.75rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
              <div style={{ alignSelf: "flex-start", background: "#f4f6f9", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                Searching JW.org...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ 
            display: "flex", 
            padding: "12px 16px", 
            borderTop: "1px solid var(--color-border)",
            background: "#fff"
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..." 
              disabled={isLoading}
              style={{ 
                flex: 1, 
                border: "1px solid var(--color-border)", 
                borderRadius: 24,
                padding: "10px 16px",
                fontSize: "15px",
                outline: "none",
                background: "var(--color-bg-alt)",
                minWidth: 0
              }} 
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: isLoading || !input.trim() ? "var(--color-text-light)" : "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                padding: "0 20px",
                marginLeft: 8,
                fontWeight: 600,
                fontSize: "14px",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s ease"
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
