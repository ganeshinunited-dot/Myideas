"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { searchJW } from "@/app/actions/searchJW";

export default function SearchJWPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  
  const [allData, setAllData] = useState<{texts: any[], images: any[], videos: any[]} | null>(null);
  const [mediaResults, setMediaResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const performSearch = async (tab: string, searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    if (tab === "all") setAllData(null);
    else setMediaResults([]);
    
    try {
      const data = await searchJW(searchQuery, tab);
      if (tab === "all") {
        setAllData(data as {texts: any[], images: any[], videos: any[]});
      } else {
        setMediaResults((data as {results: any[]}).results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(activeTab, query);
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    if (query.trim() && searched) {
      performSearch(tab, query);
    }
  };

  const hasResults = activeTab === "all" ? 
    (allData && (allData.texts?.length > 0 || allData.images?.length > 0 || allData.videos?.length > 0)) : 
    (mediaResults?.length > 0);

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar />
      <div className="page-container">
        
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>
            Search JW
          </h1>
        </div>

        <form 
          onSubmit={handleSearch}
          style={{ 
            display: "flex", 
            width: "100%", 
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: 20
          }}
        >
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jw.org topics..." 
            required
            style={{ 
              flex: 1, 
              padding: "16px 20px", 
              fontSize: "16px", 
              border: "none", 
              outline: "none",
              color: "var(--color-text)",
              minWidth: 0 // fixes mobile flex overflow
            }} 
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "0 20px", 
              background: loading ? "var(--color-text-light)" : "var(--color-primary)", 
              color: "#fff", 
              border: "none", 
              fontWeight: 600, 
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
              whiteSpace: "nowrap"
            }}
          >
            {loading ? "..." : "Search"}
          </button>
        </form>

        {/* Tabs - Scrollable on mobile */}
        <div style={{ 
          display: "flex", 
          gap: "16px", 
          borderBottom: "1px solid var(--color-border)",
          marginBottom: "24px",
          paddingBottom: "8px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none"
        }}>
          {["all", "images", "videos"].map(tab => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1rem",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "var(--color-primary)" : "var(--color-text-muted)",
                cursor: "pointer",
                padding: "4px 8px",
                position: "relative",
                textTransform: "capitalize",
                whiteSpace: "nowrap"
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{ 
                  position: "absolute", 
                  bottom: "-10px", 
                  left: 0, 
                  right: 0, 
                  height: 3, 
                  background: "var(--color-primary)",
                  borderRadius: "4px 4px 0 0"
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Loading & Empty states */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
            Fetching authentic results from jw.org...
          </div>
        )}

        {!loading && searched && !hasResults && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
            No results found for &quot;{query}&quot;.
          </div>
        )}

        {/* "All" Tab View */}
        {!loading && activeTab === "all" && allData && hasResults && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Top Articles (WOL) */}
            {allData.texts?.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-text)", marginBottom: 16 }}>
                  Articles
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {allData.texts.map((res: any, i: number) => (
                    <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", flexDirection: "column", background: "#fff",
                        padding: "16px", border: "1px solid var(--color-border)", borderRadius: 12,
                        textDecoration: "none"
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginBottom: 4 }}>
                        {new URL(res.link).hostname}
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: 6 }}>
                        {res.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {res.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Top Images */}
            {allData.images?.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-text)", marginBottom: 16 }}>
                  Images
                </h2>
                <div className="all-tab-grid">
                  {allData.images.map((res: any, i: number) => (
                    <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", borderRadius: 12, overflow: "hidden", border: "1px solid var(--color-border)",
                      textDecoration: "none"
                    }}>
                      <div style={{ height: 100, backgroundImage: `url(${res.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                      <div style={{ padding: "8px", fontSize: "0.75rem", color: "var(--color-text)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {res.title}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Top Videos */}
            {allData.videos?.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-text)", marginBottom: 16 }}>
                  Videos
                </h2>
                <div className="all-tab-grid">
                  {allData.videos.map((res: any, i: number) => (
                    <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", borderRadius: 12, overflow: "hidden", border: "1px solid var(--color-border)",
                      textDecoration: "none"
                    }}>
                      <div style={{ height: 100, backgroundImage: `url(${res.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                         <div style={{
                            position: "absolute", bottom: 8, left: 8, width: 24, height: 24,
                            background: "rgba(0,0,0,0.7)", borderRadius: "50%", display: "flex",
                            alignItems: "center", justifyContent: "center", color: "#fff"
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                      </div>
                      <div style={{ padding: "8px", fontSize: "0.75rem", color: "var(--color-text)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {res.title}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid View for "Images" & "Videos" Tabs */}
        {!loading && (activeTab === "images" || activeTab === "videos") && hasResults && (
          <div className="media-grid">
            {mediaResults.map((res: any, i: number) => (
              <a 
                key={i} 
                href={res.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  overflow: "hidden",
                  textDecoration: "none"
                }}
              >
                <div style={{ 
                  height: 120, 
                  width: "100%", 
                  backgroundImage: `url(${res.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderBottom: "1px solid var(--color-border)",
                  position: "relative"
                }}>
                  {activeTab === "videos" && (
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 36,
                      height: 36,
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff"
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ padding: "10px" }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {res.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
