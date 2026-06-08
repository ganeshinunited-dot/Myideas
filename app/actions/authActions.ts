"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Hardcoded credentials for the hidden admin panel
const ADMIN_ID = "ganeshcarkeyjw@nepal";
const ADMIN_PASS = "Ganeshisthebestinnepal@@";

export async function loginAdmin(formData: FormData) {
  const id = formData.get("id");
  const password = formData.get("password");

  if (id === ADMIN_ID && password === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  redirect("/");
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  return auth?.value === "true";
}
