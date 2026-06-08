import Navbar from "@/components/Navbar";
import { getBlogBySlug, getBlogs } from "@/app/actions/blogActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogReadPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <article style={{ flex: 1, padding: "100px 20px 80px", maxWidth: "760px", margin: "0 auto", width: "100%" }}>
        
        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {blog.imageUrl && (
          <div style={{ width: "100%", height: "auto", maxHeight: "400px", borderRadius: "24px", overflow: "hidden", marginBottom: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <img src={blog.imageUrl} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <header style={{ marginBottom: "32px" }}>
          <p style={{ color: "var(--color-text-light)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 12 }}>
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 800, color: "var(--color-text)", lineHeight: 1.2, letterSpacing: "-0.03em" }}>
            {blog.title}
          </h1>
        </header>

        <div style={{
          color: "var(--color-text)",
          fontSize: "1.1rem",
          lineHeight: 1.8,
          fontFamily: "Georgia, 'Times New Roman', serif",
          whiteSpace: "pre-wrap"
        }}>
          {blog.content}
        </div>

      </article>
    </main>
  );
}
