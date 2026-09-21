"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Pencil, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { SortWeightInput } from "@/components/admin/SortWeightInput";
import {
  deleteCategoryAction,
  moveCategoryHomeAction,
  renameCategoryAction,
  setCategoryHomePositionAction,
  toggleCategoryShowOnHomeAction,
} from "@/app/admin/(protected)/categories/actions";
import type { Category } from "@/types";

export function CategoryRow({
  category,
  isFirstOnHome,
  isLastOnHome,
}: {
  category: Category;
  isFirstOnHome: boolean;
  isLastOnHome: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim() || name.trim() === category.name) {
      setEditing(false);
      setName(category.name);
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.set("id", category.id);
    formData.set("name", name.trim());
    await renameCategoryAction(formData);
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border-soft/70 bg-white p-3">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditing(false);
              setName(category.name);
            }
          }}
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex h-9 w-9 items-center justify-center rounded-full text-green-700 hover:bg-green-50"
          aria-label="Save"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setName(category.name);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-border-soft/70 bg-white p-3">
      <div className="flex items-center gap-2">
        {category.show_on_home && (
          <div className="flex items-center gap-1">
            <SortWeightInput
              id={category.id}
              value={category.home_position}
              action={setCategoryHomePositionAction}
            />
            <div className="flex flex-col gap-0.5">
              <form action={moveCategoryHomeAction}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={isFirstOnHome}
                  className="flex h-6 w-6 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-20"
                  aria-label={`Move ${category.name} up on home`}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
              </form>
              <form action={moveCategoryHomeAction}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={isLastOnHome}
                  className="flex h-6 w-6 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-20"
                  aria-label={`Move ${category.name} down on home`}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
        <span className="font-medium text-ink">{category.name}</span>
      </div>

      <div className="flex items-center gap-1">
        <form action={toggleCategoryShowOnHomeAction}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="nextShowOnHome" value={String(!category.show_on_home)} />
          <button
            type="submit"
            className={
              category.show_on_home
                ? "rounded-full border border-ink bg-ink px-3 py-1.5 text-xs font-medium text-cream"
                : "rounded-full border border-border-soft px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-ink/30"
            }
          >
            {category.show_on_home ? "On Home" : "Show on Home"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label={`Rename ${category.name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <form
          action={deleteCategoryAction}
          onSubmit={(e) => {
            if (!confirm(`Delete category "${category.name}"? Products keep their other tags.`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={category.id} />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
