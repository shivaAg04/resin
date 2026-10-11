"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Field";
import { updateCustomRequestStatusAction } from "@/app/admin/(protected)/custom-requests/actions";
import { CUSTOM_REQUEST_STATUSES, type CustomRequestStatus } from "@/lib/custom-requests/options";

export function CustomRequestStatusSelect({ id, status }: { id: string; status: CustomRequestStatus }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleChange(next: CustomRequestStatus) {
    setCurrent(next);
    setSaved(false);
    startTransition(async () => {
      const result = await updateCustomRequestStatusAction(id, next);
      if (!result.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={current}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as CustomRequestStatus)}
        className="w-auto py-1.5"
        aria-label="Request status"
      >
        {CUSTOM_REQUEST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </Select>
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-ink-soft" />}
      {saved && !isPending && <Check className="h-4 w-4 text-green-600" />}
    </div>
  );
}
