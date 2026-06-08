"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { searchJW } from "@/app/actions/searchJW";

const LANGUAGES = [
  { code: "en", label: "English",  nativeLabel: "English",  flag: "🇬🇧" },
  { code: "ne", label: "Nepali",   nativeLabel: "नेपाली",    flag: "🇳🇵" },
  { code: "hi", label: "Hindi",    nativeLabel: "हिन्दी",    flag: "🇮🇳" },
  { code: "es", label: "Spanish",  nativeLabel: "Español",  flag: "🇪🇸" },
  { code: "fr", label: "French",   nativeLabel: "Français",  flag: "🇫🇷" },
];

export default function SearchJWPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const [allData, setAllData] = useState<{texts: any[], images: any[], videos: any[]} | null>(null);
  const [mediaResults, setMediaResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  const performSearch = async (tab: string, searchQuery: string, lang: string = selectedLang) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    if (tab === "all") setAllData(null);
    else setMediaResults([]);
    
    try {
      const data = await searchJW(searchQuery, tab, lang);
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

  const changeLang = (langCode: string) => {
    setSelectedLang(langCode);
    setLangDropdownOpen(false);
    if (query.trim() && searched) {
      performSearch(activeTab, query, langCode);
    }
  };

  const hasResults = activeTab === "all" ? 
    (allData && (allData.texts?.length > 0 || allData.images?.length > 0 || allData.videos?.length > 0)) : 
    (mediaResults?.length > 0);

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar />
      <div className="page-container">
        
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>
            Search JW
          </h1>
        </div>

        {/* Language Selector */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: 16, 
          position: "relative" 
        }}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 24,
              border: "1px solid var(--color-border)",
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-text)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 18 }}>{currentLang.flag}</span>
            <span>{currentLang.nativeLabel}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, transform: langDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {langDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div 
                onClick={() => setLangDropdownOpen(false)} 
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 49 }} 
              />
              <div style={{
                position: "absolute",
                top: "100%",
                marginTop: 6,
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                zIndex: 50,
                overflow: "hidden",
                minWidth: 180,
                animation: "fadeSlideDown 0.15s ease-out",
              }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "12px 18px",
                      border: "none",
                      background: selectedLang === lang.code ? "var(--color-bg-alt)" : "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: selectedLang === lang.code ? 600 : 400,
                      color: selectedLang === lang.code ? "var(--color-primary)" : "var(--color-text)",
                      textAlign: "left",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-bg-alt)"}
                    onMouseLeave={e => e.currentTarget.style.background = selectedLang === lang.code ? "var(--color-bg-alt)" : "transparent"}
                  >
                    <span style={{ fontSize: 18 }}>{lang.flag}</span>
                    <div>
                      <div>{lang.nativeLabel}</div>
                      {lang.nativeLabel !== lang.label && (
                        <div style={{ fontSize: 11, color: "var(--color-text-light)", marginTop: 1 }}>{lang.label}</div>
                      )}
                    </div>
                    {selectedLang === lang.code && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
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
            placeholder={selectedLang === "ne" ? "jw.org मा खोज्नुहोस्..." : selectedLang === "hi" ? "jw.org पर खोजें..." : "Search jw.org topics..."} 
            required
            style={{ 
              flex: 1, 
              padding: "16px 20px", 
              fontSize: "16px", 
              border: "none", 
              outline: "none",
              color: "var(--color-text)",
              minWidth: 0
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
            {loading ? "..." : selectedLang === "ne" ? "खोज" : selectedLang === "hi" ? "खोजें" : "Search"}
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
            {selectedLang === "ne" ? "jw.org बाट खोजी गर्दै..." : selectedLang === "hi" ? "jw.org से खोज रहे हैं..." : "Fetching authentic results from jw.org..."}
          </div>
        )}

        {!loading && searched && !hasResults && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
            No results found for &quot;{query}&quot; in {currentLang.nativeLabel}.
          </div>
        )}

        {/* "All" Tab View */}
        {!loading && activeTab === "all" && allData && hasResults && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Top Articles (WOL) */}
            {allData.texts?.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-text)", marginBottom: 16 }}>
                  {selectedLang === "ne" ? "लेखहरू" : selectedLang === "hi" ? "लेख" : "Articles"}
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
                        {(() => { try { return new URL(res.link).hostname; } catch { return "wol.jw.org"; } })()}
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
                  {selectedLang === "ne" ? "तस्बिरहरू" : selectedLang === "hi" ? "चित्र" : "Images"}
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
                  {selectedLang === "ne" ? "भिडियोहरू" : selectedLang === "hi" ? "वीडियो" : "Videos"}
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

      {/* Dropdown animation */}
      <style jsx>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
