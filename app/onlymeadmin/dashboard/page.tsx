"use client";
import { useState, useEffect } from "react";
import { createBlog, getBlogs, deleteBlog, BlogPost } from "@/app/actions/blogActions";
import { logoutAdmin } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { Trash2, Plus, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const data = await getBlogs();
    setBlogs(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createBlog(formData);
    if (res.success) {
      setIsWriting(false);
      loadBlogs();
    } else {
      alert(res.error || "Failed to publish");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await deleteBlog(id);
    if (res.success) {
      loadBlogs();
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-alt)", paddingBottom: "80px" }}>
      {/* Header */}
      <header style={{ background: "var(--color-bg)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", position: "sticky", top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)", margin: 0 }}>Dashboard</h1>
        <button onClick={() => logoutAdmin()} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "0.9rem", cursor: "pointer" }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        
        {!isWriting ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-text)" }}>Your Posts</h2>
              <button 
                onClick={() => setIsWriting(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-primary)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
              >
                <Plus size={16} /> Write Post
              </button>
            </div>

            {loading ? (
              <p style={{ color: "var(--color-text-muted)" }}>Loading posts...</p>
            ) : blogs.length === 0 ? (
              <div style={{ background: "var(--color-bg)", padding: "40px", borderRadius: "12px", textAlign: "center", color: "var(--color-text-muted)", border: "1px dashed var(--color-border)" }}>
                No posts yet. Write your first blog!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {blogs.map(blog => (
                  <div key={blog.id} style={{ background: "var(--color-bg)", padding: "16px", borderRadius: "12px", border: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{blog.title}</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>{new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDelete(blog.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", width: 36, height: 36, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ background: "var(--color-bg)", padding: "20px", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-text)" }}>Write New Post</h2>
              <button onClick={() => setIsWriting(false)} style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "0.9rem", cursor: "pointer" }}>Cancel</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>Title</label>
                <input name="title" required placeholder="Catchy title here..." style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "1rem", outline: "none" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>Cover Image</label>
                <input type="file" name="imageFile" accept="image/*" style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem", outline: "none", background: "var(--color-bg-alt)" }} />
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", margin: 0 }}>Upload an image (or leave blank). It will be saved on the server.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>Content</label>
                <textarea name="content" required placeholder="Write your amazing post here..." style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "1rem", minHeight: "200px", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
              </div>

              <button type="submit" disabled={submitting} style={{ background: "var(--color-primary)", color: "#fff", padding: "14px", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "1rem", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, marginTop: 8 }}>
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
