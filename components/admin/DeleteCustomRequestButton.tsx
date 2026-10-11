"use client";

import { Trash2 } from "lucide-react";
import { deleteCustomRequestAction } from "@/app/admin/(protected)/custom-requests/actions";

export function DeleteCustomRequestButton({ id, requestNumber }: { id: string; requestNumber: string }) {
  return (
    <form
      action={deleteCustomRequestAction}
      onSubmit={(e) => {
        if (!confirm(`Delete request ${requestNumber} and its photos? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete request ${requestNumber}`}
        className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
