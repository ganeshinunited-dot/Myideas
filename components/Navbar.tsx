"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/", icon: <HomeIcon /> },
  { label: "About", href: "/about", icon: <InfoIcon /> },
  { label: "Search JW", href: "/search-jw", icon: <SearchIcon /> },
  { label: "More", href: "#", icon: <MoreIcon /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="desktop-only" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text)", textDecoration: "none", letterSpacing: "-0.02em" }}>
            Ganesh<span style={{ color: "var(--color-primary)" }}>.</span>
          </a>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {links.filter(l => l.label !== "Home").map(({ label, href }) => (
              <a key={label} href={href} style={{
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
                {label}
              </a>
            ))}

            {/* CTA */}
            <a href="/try-free-ai" style={{
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 8,
              background: "var(--color-primary)",
              color: "#fff",
              textDecoration: "none",
              marginLeft: 8,
              transition: "background 0.2s ease",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-primary-dark)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--color-primary)")}
            >
              Try Free AI
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar (Just Logo + AI Button) */}
      <header className="mobile-only" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
      }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text)", textDecoration: "none" }}>
          Ganesh<span style={{ color: "var(--color-primary)" }}>.</span>
        </a>
        <a href="/try-free-ai" style={{
          fontSize: 13,
          fontWeight: 600,
          padding: "6px 14px",
          borderRadius: 8,
          background: "var(--color-primary)",
          color: "#fff",
          textDecoration: "none",
        }}>
          AI Chat
        </a>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-only mobile-bottom-nav" style={{ display: "none" /* handled by CSS class */ }}>
        {links.map(({ label, href, icon }) => (
          <a key={label} href={href} className={`mobile-nav-link ${pathname === href ? "active" : ""}`}>
            {icon}
            <span>{label}</span>
          </a>
        ))}
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

function MoreIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}
