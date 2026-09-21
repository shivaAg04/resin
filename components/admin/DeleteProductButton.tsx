"use client";

import { deleteProductAction } from "@/app/admin/(protected)/products/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
