import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-braces: proxy.ts already redirects unauthenticated requests,
  // but every server render re-checks the session directly too.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminSidebar />
      <div className="flex-1">
        <div className="flex items-center justify-end border-b border-border-soft/70 bg-white px-4 py-2 sm:hidden">
          <LogoutButton />
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
