"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Field";
import { updateOrderStatusAction } from "@/app/admin/(protected)/orders/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/types";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleChange(next: OrderStatus) {
    setCurrent(next);
    setSaved(false);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);
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
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="w-auto capitalize"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </Select>
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-ink-soft" />}
      {saved && !isPending && <Check className="h-4 w-4 text-green-600" />}
    </div>
  );
}
