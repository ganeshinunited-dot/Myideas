import Navbar from "@/components/Navbar";

export default function TermsAndConditionsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "120px 28px 60px", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, color: "var(--color-text)" }}>
          Terms and Conditions
        </h1>
        <div style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <p style={{ marginBottom: 16 }}>
            Please read these terms and conditions carefully before using our service. By accessing or using the service, you agree to be bound by these Terms.
          </p>
          <p>
            If you disagree with any part of the terms, then you may not access the service.
          </p>
        </div>
      </div>
    </main>
  );
}
