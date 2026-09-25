import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border-soft/70 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Spilled Colours" width={158} height={54} className="h-10 w-auto" />
          <h1 className="mt-3 font-display text-xl font-semibold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-soft">Sign in to manage products and orders.</p>
        </div>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
