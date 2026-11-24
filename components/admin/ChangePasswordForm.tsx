"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";

const MIN_LENGTH = 8;

export function ChangePasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (next.length < MIN_LENGTH) return setError(`New password must be at least ${MIN_LENGTH} characters.`);
    if (next !== confirm) return setError("The new passwords don't match.");
    if (next === current) return setError("The new password is the same as the current one.");

    setLoading(true);
    const supabase = createClient();

    // Supabase doesn't check the old password on update, so confirm it first.
    const { error: checkError } = await supabase.auth.signInWithPassword({ email, password: current });
    if (checkError) {
      setLoading(false);
      return setError("Current password is wrong.");
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setLoading(false);
    if (updateError) return setError(updateError.message || "Could not change the password. Please try again.");

    setCurrent("");
    setNext("");
    setConfirm("");
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldWrapper label="Current password" htmlFor="current-password">
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="New password" htmlFor="new-password">
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_LENGTH}
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="Confirm new password" htmlFor="confirm-password">
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_LENGTH}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </FieldWrapper>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {done && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Password changed. Use the new one next time you log in.
        </div>
      )}

      <Button type="submit" disabled={loading} className="self-start">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Change password
      </Button>
    </form>
  );
}
