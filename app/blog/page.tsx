import Navbar from "@/components/Navbar";
import { getBlogs } from "@/app/actions/blogActions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  const blogs = await getBlogs();

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-alt)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: "100px 20px 80px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, color: "var(--color-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
            My Notes & Thoughts
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
            A collection of my recent writings, tutorials, and personal updates.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--color-bg)", borderRadius: "24px", border: "1px solid var(--color-border)" }}>
            <p style={{ color: "var(--color-text-light)", fontSize: "1.1rem" }}>No posts available right now. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article style={{
                  background: "var(--color-bg)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)"; }}
                >
                  {blog.imageUrl && (
                    <div style={{ height: "200px", width: "100%", overflow: "hidden" }}>
                      <img src={blog.imageUrl} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "24px" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: 600 }}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "12px", lineHeight: 1.3 }}>
                      {blog.title}
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "16px" }}>
                      {blog.content}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                      Read More <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
