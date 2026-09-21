"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils/format";

export function SortWeightInput({
  id,
  value,
  action,
  className,
}: {
  id: string;
  value: number;
  action: (formData: FormData) => Promise<void>;
  className?: string;
}) {
  const [text, setText] = useState(String(value));
  const [isPending, startTransition] = useTransition();

  function commit() {
    const num = Number(text);
    if (!Number.isFinite(num) || num === value) {
      setText(String(value));
      return;
    }
    const formData = new FormData();
    formData.set("id", id);
    formData.set("value", String(Math.round(num)));
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <input
      type="number"
      value={text}
      disabled={isPending}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      aria-label="Sort weight"
      title="Sort weight — lower shows first"
      className={cn(
        "w-12 rounded-md border border-ink/15 bg-white px-1 py-1 text-center text-xs text-ink outline-none focus:border-amber disabled:opacity-50",
        className,
      )}
    />
  );
}
