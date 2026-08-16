import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <>
      <div className="bg-grid pointer-events-none fixed inset-0 bg-ink-950 opacity-40" />
      <AdminDashboard />
    </>
  );
}
