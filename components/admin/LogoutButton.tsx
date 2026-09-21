"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" /> Logout
    </button>
  );
}
