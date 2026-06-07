import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ganesh Karki — Designer & Developer",
  description: "Product Designer & Full Stack Developer from Nepal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>{children}</div>
        <footer style={{ 
          padding: "24px", 
          textAlign: "center", 
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-bg)",
          color: "var(--color-text-muted)",
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap"
        }}>
          <span>&copy; {new Date().getFullYear()} Ganesh Karki</span>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
            <a href="/terms-and-conditions" style={{ color: "inherit", textDecoration: "none" }}>Terms and Conditions</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
