"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Monospace ID with a one-click copy, for pasting Razorpay IDs into the Razorpay dashboard search. */
export function CopyableId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (e.g. non-HTTPS); the ID is still selectable by hand.
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="break-all font-mono text-xs text-ink">{value}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : `Copy ${value}`}
        className="shrink-0 rounded p-1 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </span>
  );
}
