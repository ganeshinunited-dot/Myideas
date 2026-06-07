import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "120px 28px 60px", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, color: "var(--color-text)" }}>
          Privacy Policy
        </h1>
        <div style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <p style={{ marginBottom: 16 }}>
            This is a simple privacy policy page. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you as to how we look after your personal data when you visit our website.
          </p>
          <p>
            By using this website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>
      </div>
    </main>
  );
}
