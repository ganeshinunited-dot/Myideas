"use client";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "120px 20px 60px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "var(--color-primary)", marginBottom: 24, textAlign: "center" }}>
          About
        </h1>
        
        <div style={{ background: "var(--color-bg)", padding: "40px", borderRadius: 16, border: "1px solid var(--color-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: 20 }}>
            Hi, I am Ganesh. I created this platform to help users find high-quality, authentic information efficiently.
          </p>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: 20 }}>
            The JW Search engine built here is designed purely to assist individuals in finding Bible-based articles, images, and videos directly sourced from JW.org. My goal is to make accessing reliable spiritual material as simple and fast as possible.
          </p>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: 24 }}>
            If you have any questions or would like to reach out, please feel free to email me at <strong>ganeshmaankarki0@gmail.com</strong>.
          </p>
          
          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "24px 0" }} />
          
          <div style={{ textAlign: "center" }}>
            <a href="/privacy-policy" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "1rem", fontWeight: 600 }}>
              Terms & Privacy Policy
            </a>
          </div>
        </div>
        
      </div>
    </main>
  );
}
