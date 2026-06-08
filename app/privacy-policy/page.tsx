import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              Your privacy is extremely important to us. This Privacy Policy outlines how we handle any information when you visit and use our search tools and services.
            </p>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              1. Information Collection
            </h2>
            <p>
              We believe in minimal data collection. We do not require you to create an account, nor do we collect personally identifiable information (PII) such as your name, email address, or phone number to use the core features of this site.
            </p>
            <p>
              When you use our search and smart assistance features, your queries are processed in real-time to fetch relevant links. <strong>We do not permanently store or track your individual search history.</strong>
            </p>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              2. Third-Party Links
            </h2>
            <p>
              Our service acts as a search indexer that directs you to external websites (such as JW.org). Once you click on a search result or a link provided by our smart assistant, you will leave our platform. We are not responsible for the privacy practices or the content of these external websites. We encourage you to read the privacy policies of any site you visit.
            </p>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              3. Analytics & Cookies
            </h2>
            <p>
              We may use basic, anonymized analytics (such as simple hit counters) to understand how many people visit our site. These tools do not track you across the internet or collect personal data.
            </p>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
              4. Consent
            </h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms. If we make any updates to this policy, we will post the changes clearly on this page.
            </p>

          </div>
        </article>
      </div>
    </main>
  );
}
