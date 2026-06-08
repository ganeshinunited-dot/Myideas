"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "./I18nProvider";

// Translation key mapping for link labels
const linkKeys: Record<string, string> = {
  "Home": "nav.home",
  "About": "nav.about",
  "Search JW": "nav.search",
  "Blog": "nav.blog",
};

const linkDefs = [
  { id: "Home", href: "/", icon: <HomeIcon /> },
  { id: "About", href: "/about", icon: <InfoIcon /> },
  { id: "Search JW", href: "/search-jw", icon: <SearchIcon /> },
  { id: "Blog", href: "/blog", icon: <BookOpenIcon /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState("light");
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    
    // Check admin status
    const cookieString = document.cookie;
    if (cookieString.includes("admin_session=true")) {
      setIsAdmin(true);
    }
    
    // Fetch visitor count
    fetch("/api/visitors")
      .then(r => r.json())
      .then(data => setVisitorCount(data.count))
      .catch(e => console.error(e));
    
    // Check dark mode
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ne" : "en");
  };

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="desktop-only" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "color-mix(in srgb, var(--color-bg) 95%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo & Visitor Counter */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text)", textDecoration: "none", letterSpacing: "-0.02em" }}>
              Ganesh<span style={{ color: "var(--color-primary)" }}>.</span>
            </a>
            {visitorCount !== null && (
              <div style={{
                background: "var(--color-bg-alt)",
                border: "1px solid var(--color-border)",
                padding: "4px 8px",
                borderRadius: "16px",
                fontSize: "11px",
                color: "var(--color-text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-primary)" }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span style={{ fontWeight: 600 }}>{visitorCount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Desktop Right Side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              style={{
                background: "var(--color-bg-alt)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                height: "36px",
                padding: "0 14px",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              title="Switch Language"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              {lang === "en" ? "नेपाली" : "English"}
            </button>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              style={{
                background: "var(--color-bg-alt)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              title="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {linkDefs.filter(l => l.id !== "Home").map(({ id, href }) => (
                <a key={id} href={href} style={{
                  fontSize: 14,
                  fontWeight: pathname === href ? 600 : 500,
                  color: pathname === href ? "var(--color-text)" : "var(--color-text-muted)",
                  textDecoration: "none",
                  padding: "6px 16px",
                  borderRadius: 8,
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--color-text)"; e.currentTarget.style.background = "var(--color-bg-alt)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = pathname === href ? "var(--color-text)" : "var(--color-text-muted)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {t(linkKeys[id])}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="mobile-only" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--color-bg) 95%, transparent)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text)", textDecoration: "none" }}>
            Ganesh<span style={{ color: "var(--color-primary)" }}>.</span>
          </a>
          {visitorCount !== null && (
            <div style={{
              background: "var(--color-bg-alt)",
              border: "1px solid var(--color-border)",
              padding: "2px 6px",
              borderRadius: "16px",
              fontSize: "10px",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-primary)" }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span style={{ fontWeight: 600 }}>{visitorCount.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLang}
            style={{
              background: "var(--color-bg-alt)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              height: "32px",
              padding: "0 10px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            title="Switch Language"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            {lang === "en" ? "ने" : "EN"}
          </button>
          {/* Mobile Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              background: "var(--color-bg-alt)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            title="Toggle Dark Mode"
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-only mobile-bottom-nav" style={{ display: "none" /* handled by CSS class */ }}>
        {linkDefs.map(({ id, href, icon }) => (
          <a key={id} href={href} className={`mobile-nav-link ${pathname === href ? "active" : ""}`}>
            {icon}
            <span>{t(linkKeys[id])}</span>
          </a>
        ))}
        {isAdmin && (
          <a href="/onlymeadmin" className={`mobile-nav-link ${pathname === "/onlymeadmin" ? "active" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            {t("nav.admin")}
          </a>
        )}
      </nav>
    </>
  );
}

function HomeIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  );
}

function InfoIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
}

function SearchIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  );
}

function BookOpenIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
