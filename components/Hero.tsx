"use client";
import { useState, useEffect } from "react";

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
  "Not a master of anything, just a passionate beginner at everything.",
  "Learning is a lifetime process, and I have only just begun.",
  "I make mistakes, and I learn from them every single day.",
  "Curiosity drives me far more than the desire to be perfect.",
  "The more I learn, the more I realize how much there is to know.",
  "I want to spend my entire life exploring, building, and learning.",
  "Growing slowly, learning constantly, and staying humble.",
  "There is no finish line when it comes to acquiring knowledge.",
  "I am simply a work in progress, dedicated to improving.",
  "Committed to the lifelong pursuit of curiosity and learning."
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

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

  return (
    <section className="hero-section" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 20px 120px",
      textAlign: "center",
      position: "relative",
    }}>
      <h1 style={{
        fontSize: "clamp(2.5rem, 8vw, 5rem)",
        fontWeight: 800,
        color: "var(--color-primary)",
        letterSpacing: "-0.04em",
        lineHeight: 1.1,
        marginBottom: 24,
      }}>
        Hi, I am Ganesh.
      </h1>
      <p style={{
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        color: "var(--color-text-muted)",
        maxWidth: 600,
        lineHeight: 1.6,
        marginBottom: 20,
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

      {/* Copyright - placed below quotes so it's not hidden by mobile bottom nav */}
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
          <a href="/privacy-policy" style={{ color: "var(--color-text-light)", textDecoration: "none", fontSize: 12 }}>Privacy Policy</a>
          <a href="/terms-and-conditions" style={{ color: "var(--color-text-light)", textDecoration: "none", fontSize: 12 }}>Terms</a>
        </div>
        
        {/* Visitor Counter */}
        {visitorCount !== null && (
          <div style={{ fontSize: "11px", opacity: 0.7, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>{visitorCount.toLocaleString()} visitors</span>
          </div>
        )}
      </div>
    </section>
  );
}
