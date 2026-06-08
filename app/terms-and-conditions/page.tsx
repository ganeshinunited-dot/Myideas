import Navbar from "@/components/Navbar";

export default function TermsAndConditionsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-alt)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: "120px 20px 80px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
        <article style={{
          background: "#ffffff",
          padding: "clamp(30px, 8vw, 60px)",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
          border: "1px solid var(--color-border)"
        }}>
          
          <h1 style={{ 
            fontSize: "clamp(2rem, 5vw, 2.75rem)", 
            fontWeight: 800, 
            color: "var(--color-primary)", 
            marginBottom: "8px",
            letterSpacing: "-0.03em",
            fontFamily: "'Inter', sans-serif"
          }}>
            Terms & Conditions
          </h1>
          
          <p style={{ 
            color: "var(--color-text-light)", 
            fontSize: "0.95rem", 
            marginBottom: "40px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div style={{ 
            color: "var(--color-text)", 
            lineHeight: 1.8, 
            fontSize: "1.05rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            
            <p>
              Welcome to our platform. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              1. How Our Search Engine Works
            </h2>
            <p>
              Our website features a search tool designed to help users quickly find resources. <strong>We do not host, scrape, download, or reproduce any content.</strong> When our search engine displays images, videos, or articles, it acts purely as an indexer. It simply provides a direct link stating, "Here is a video/article that matches your search." 
            </p>
            <p>
              To actually view or read any material found through our search, users are seamlessly redirected to the official source website. We do not store their intellectual property on our servers.
            </p>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              2. Non-Affiliation Disclaimer
            </h2>
            <p>
              This website is an independent, privately-operated portfolio project. It is <strong>not affiliated with, endorsed by, authorized by, or in any way officially connected with JW.org</strong> or the Watch Tower Bible and Tract Society of Pennsylvania. All trademarks, logos, and copyrights related to JW.org are the property of their respective owners. We strictly respect their Terms of Use by acting only as a gateway that links outward to their official public URLs.
            </p>

            <div style={{
              background: "#fdf8f5",
              borderLeft: "4px solid #e08b6c",
              padding: "24px",
              marginTop: "24px",
              borderRadius: "0 12px 12px 0"
            }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#c26543", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>
                A Personal Note & Apology
              </h2>
              <p style={{ margin: 0, fontStyle: "italic", color: "#5a433a" }}>
                This tool was built entirely with good intentions—to help people access information more efficiently and to showcase technical skills. However, I deeply apologize if the existence or use of this tool has inadvertently caused any distress, misunderstanding, or difficulty in anyone's personal life. Technology should connect and help us, and I am genuinely sorry if my work has brought unintended hardship to anyone.
              </p>
            </div>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              3. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>

          </div>
        </article>
      </div>
    </main>
  );
}
