import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ganesh Karki — Designer & Developer",
  description: "Product Designer & Full Stack Developer from Nepal",
  manifest: "/manifest.json",
  themeColor: "#4a6da7",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
