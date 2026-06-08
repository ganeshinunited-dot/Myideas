import { checkAuth } from "@/app/actions/authActions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    redirect("/onlymeadmin");
  }

  return <>{children}</>;
}
