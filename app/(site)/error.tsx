"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
      <h1 className="font-display text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="text-sm text-ink-soft">
        We couldn&apos;t load this page. Please try again, or head back to the homepage.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <ButtonLink href="/">Go home</ButtonLink>
      </div>
    </div>
  );
}
