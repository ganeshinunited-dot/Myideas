import Navbar from "@/components/Navbar";

export default function TermsAndPrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-alt)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: "120px 20px 80px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
        <article style={{
          background: "var(--color-bg)",
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
            Terms & Privacy Policy
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
              Welcome to our platform. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy. Please read them carefully.
            </p>

            {/* --- TERMS SECTION --- */}
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "16px", fontFamily: "'Inter', sans-serif", borderBottom: "1px solid var(--color-border)", paddingBottom: "8px" }}>
              Terms of Use
            </h2>
            
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", marginTop: "8px", fontFamily: "'Inter', sans-serif" }}>
              1. How Our Search Engine Works
            </h3>
            <p>
              Our website features a search tool designed to help users quickly find resources. <strong>We do not host, scrape, download, or reproduce any content.</strong> When our search engine displays images, videos, or articles, it acts purely as an indexer. It simply provides a direct link stating, "Here is a video/article that matches your search." 
            </p>
            <p>
              To actually view or read any material found through our search, users are seamlessly redirected to the official source website. We do not store their intellectual property on our servers.
            </p>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", marginTop: "8px", fontFamily: "'Inter', sans-serif" }}>
              2. Non-Affiliation Disclaimer
            </h3>
            <p>
              This website is an independent, privately-operated portfolio project. It is <strong>not affiliated with, endorsed by, authorized by, or in any way officially connected with JW.org</strong> or the Watch Tower Bible and Tract Society of Pennsylvania. All trademarks, logos, and copyrights related to JW.org are the property of their respective owners. We strictly respect their Terms of Use by acting only as a gateway that links outward to their official public URLs.
            </p>

            <div style={{
              background: "#fdf8f5",
              borderLeft: "4px solid #e08b6c",
              padding: "24px",
              marginTop: "8px",
              borderRadius: "0 12px 12px 0"
            }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#c26543", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>
                A Personal Note & Apology
              </h3>
              <p style={{ margin: 0, fontStyle: "italic", color: "#5a433a" }}>
                This tool was built entirely with good intentions—to help people access information more efficiently and to showcase technical skills. However, I deeply apologize if the existence or use of this tool has inadvertently caused any distress, misunderstanding, or difficulty in anyone's personal life. Technology should connect and help us, and I am genuinely sorry if my work has brought unintended hardship to anyone.
              </p>
            </div>


            {/* --- PRIVACY SECTION --- */}
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary-dark)", marginTop: "32px", fontFamily: "'Inter', sans-serif", borderBottom: "1px solid var(--color-border)", paddingBottom: "8px" }}>
              Privacy Policy
            </h2>
            
            <p>
              Your privacy is extremely important to us. This section outlines how we handle any information when you visit and use our search tools and services.
            </p>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", marginTop: "8px", fontFamily: "'Inter', sans-serif" }}>
              1. Information Collection
            </h3>
            <p>
              We believe in minimal data collection. We do not require you to create an account, nor do we collect personally identifiable information (PII) such as your name, email address, or phone number to use the core features of this site.
            </p>
            <p>
              When you use our search and smart assistance features, your queries are processed in real-time to fetch relevant links. <strong>We do not permanently store or track your individual search history.</strong>
            </p>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", marginTop: "8px", fontFamily: "'Inter', sans-serif" }}>
              2. Third-Party Links
            </h3>
            <p>
              Our service acts as a search indexer that directs you to external websites (such as JW.org). Once you click on a search result or a link provided by our smart assistant, you will leave our platform. We are not responsible for the privacy practices or the content of these external websites. We encourage you to read the privacy policies of any site you visit.
            </p>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", marginTop: "8px", fontFamily: "'Inter', sans-serif" }}>
              3. Analytics & Cookies
            </h3>
            <p>
              We may use basic, anonymized analytics (such as simple hit counters) to understand how many people visit our site. These tools do not track you across the internet or collect personal data.
            </p>

          </div>
        </article>
      </div>
    </main>
  );
}
