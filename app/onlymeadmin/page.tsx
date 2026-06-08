"use client";
import { useState } from "react";
import { loginAdmin } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);
    
    if (res.success) {
      router.push("/onlymeadmin/dashboard");
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-alt)", padding: 20 }}>
      <form onSubmit={handleLogin} style={{
        background: "var(--color-bg)",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>Owner Access</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Please sign in to continue.</p>
        </div>

        {error && <div style={{ color: "#e11d48", fontSize: "0.85rem", background: "#ffe4e6", padding: "10px", borderRadius: "8px", textAlign: "center" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>ID</label>
          <input 
            type="text" 
            name="id" 
            required 
            style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none", fontSize: "1rem" }} 
            placeholder="Enter your ID"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>Password</label>
          <input 
            type="password" 
            name="password" 
            required 
            style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none", fontSize: "1rem" }} 
            placeholder="Enter password"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            marginTop: "10px",
            background: "var(--color-primary)",
            color: "#fff",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
