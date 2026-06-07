"use client";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "120px 20px 60px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "var(--color-primary)", marginBottom: 24, textAlign: "center" }}>
          Terms & Privacy Policy
        </h1>
        
        <div style={{ background: "#fff", padding: "40px", borderRadius: 16, border: "1px solid var(--color-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: 12 }}>1. Data Collection</h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text)" }}>
              This website is designed with absolute respect for your privacy. <strong>This site does not collect, store, or track any of your personal data.</strong> Your searches, queries, and activities remain completely private and are never saved on our servers.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: 12 }}>2. Purpose of JW Search</h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text)" }}>
              The JW Search engine was created with good intentions—to help individuals easily search and access spiritually uplifting articles, images, and videos from the official JW.org website. It is simply a helpful tool designed to connect users with authentic, Bible-based information efficiently.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: 12 }}>3. Google Policy & Free API Usage</h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text)" }}>
              To provide accurate results, this site may utilize free search APIs, including those adhering to Google's policies for non-commercial, educational use. All content pulled through these APIs, including images and videos, strictly redirects back to the original source. We comply with all fair-use guidelines and Free API policies to ensure continuous, safe access.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: 12 }}>4. Apologies & Limitations</h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text)" }}>
              We sincerely apologize if anything on this site causes any unintended inconvenience, harm, or technical difficulties. Since this platform relies on free public APIs, there may occasionally be downtime or unexpected errors. Please know that any disruption is entirely unintentional.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: 12 }}>5. Contact Us</h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text)" }}>
              If anyone faces any difficulty, has concerns, or wishes to request changes, please feel free to reach out. You can contact me directly at:
              <br />
              <a href="mailto:ganeshmaankarki0@gmail.com" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 8 }}>
                ganeshmaankarki0@gmail.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
