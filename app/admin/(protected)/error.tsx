"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border-soft py-20 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
      <h1 className="font-display text-xl font-semibold text-ink">Something went wrong</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        This page couldn&apos;t load. Please try again — if the problem continues, check your
        Supabase connection settings.
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
