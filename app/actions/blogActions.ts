"use server";
import fs from "fs";
import path from "path";
import os from "os";
import { checkAuth } from "./authActions";
import { revalidatePath } from "next/cache";

const DATA_FILE = path.join(os.tmpdir(), "blogs.json");

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

// Helper to ensure data file exists in tmp dir
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data) as BlogPost[];
  } catch (err) {
    console.error("Failed to read blogs", err);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find(b => b.slug === slug) || null;
}

export async function createBlog(formData: FormData) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  let imageUrl = formData.get("imageUrl") as string;
  const imageFile = formData.get("imageFile") as File | null;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  // Handle Image Upload - Convert to Base64 to avoid read-only file system issues
  if (imageFile && imageFile.size > 0) {
    try {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = imageFile.type || "image/jpeg";
      imageUrl = `data:${mimeType};base64,${base64}`;
    } catch (err) {
      console.error("Failed to process image", err);
    }
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const newBlog: BlogPost = {
    id: Date.now().toString(),
    title,
    slug: `${slug}-${Math.floor(Math.random() * 1000)}`, // avoid duplicates
    content,
    imageUrl: imageUrl || "",
    createdAt: new Date().toISOString()
  };

  try {
    const blogs = await getBlogs();
    blogs.unshift(newBlog); // Add to top
    fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
    revalidatePath("/blog");
    return { success: true, slug: newBlog.slug };
  } catch (err) {
    console.error("Failed to save blog", err);
    return { error: "Failed to save blog post" };
  }
}

export async function deleteBlog(id: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return { error: "Unauthorized" };

  try {
    let blogs = await getBlogs();
    blogs = blogs.filter(b => b.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
    revalidatePath("/blog");
    return { success: true };
  } catch (err) {
    return { error: "Failed to delete blog" };
  }
}

