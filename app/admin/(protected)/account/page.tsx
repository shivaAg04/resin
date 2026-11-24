import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Account" };

export default async function AdminAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl font-semibold text-ink">Account</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Signed in as <span className="font-medium text-ink">{user?.email}</span>
      </p>

      <div className="mt-6 rounded-2xl border border-border-soft/70 bg-white p-5">
        <h2 className="mb-4 font-medium text-ink">Change password</h2>
        <ChangePasswordForm email={user?.email ?? ""} />
      </div>
    </div>
  );
}
