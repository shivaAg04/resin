"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, Check, ChevronDown, ChevronUp, ImageIcon, Loader2, Pencil, Trash2, X } from "lucide-react";
import { FieldWrapper, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortWeightInput } from "@/components/admin/SortWeightInput";
import {
  deleteCategoryAction,
  moveCategoryHomeAction,
  renameCategoryAction,
  setCategoryHomePositionAction,
  toggleCategoryShowOnHomeAction,
  updateCategoryDetailsAction,
} from "@/app/admin/(protected)/categories/actions";
import type { Category } from "@/types";

export function CategoryRow({
  category,
  productCount,
  isFirstOnHome,
  isLastOnHome,
}: {
  category: Category;
  productCount: number;
  isFirstOnHome: boolean;
  isLastOnHome: boolean;
}) {
  const emptyOnHome = category.show_on_home && productCount === 0;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [saving, setSaving] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(category.image_url ?? "");
  const [description, setDescription] = useState(category.description ?? "");
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  async function handleSaveDetails() {
    setSavingDetails(true);
    setDetailsError(null);
    const result = await updateCategoryDetailsAction(category.id, { imageUrl, description });
    setSavingDetails(false);
    if (result.error) setDetailsError(result.error);
    else setDetailsOpen(false);
  }

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
    <div className="rounded-xl border border-border-soft/70 bg-white">
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2">
          {category.show_on_home && (
            <div className="flex items-center gap-1">
              <SortWeightInput id={category.id} value={category.home_position} action={setCategoryHomePositionAction} />
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
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-amber-light/40">
            {category.image_url ? (
              <Image src={category.image_url} alt="" fill sizes="36px" className="object-cover" />
            ) : (
              <ImageIcon className="m-2.5 h-4 w-4 text-ink-soft/50" />
            )}
          </div>
          <span className="font-mono text-xs text-ink-soft/70">{category.code}</span>
          <span className="font-medium text-ink">{category.name}</span>
          {emptyOnHome && (
            <span
              title="This category has no active products yet, so its homepage row won't show up until you tag one."
              className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
            >
              <AlertTriangle className="h-3 w-3" /> No products yet
            </span>
          )}
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
            onClick={() => setDetailsOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label={`Edit image and description for ${category.name}`}
            aria-expanded={detailsOpen}
          >
            <ImageIcon className="h-4 w-4" />
          </button>
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

      {detailsOpen && (
        <div className="flex flex-col gap-3 border-t border-border-soft/70 p-3">
          <FieldWrapper label="Cover image" htmlFor={`category-image-${category.id}`} optional>
            <ImageUploader
              images={imageUrl ? [imageUrl] : []}
              onChange={(imgs) => setImageUrl(imgs[imgs.length - 1] ?? "")}
            />
          </FieldWrapper>
          <FieldWrapper label="Short description" htmlFor={`category-description-${category.id}`} optional>
            <Input
              id={`category-description-${category.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Birthdays, weddings, milestones"
              maxLength={80}
            />
          </FieldWrapper>
          {detailsError && <p className="text-xs text-red-600">{detailsError}</p>}
          <Button type="button" size="sm" onClick={handleSaveDetails} disabled={savingDetails} className="self-start">
            {savingDetails && <Loader2 className="h-4 w-4 animate-spin" />}
            Save details
          </Button>
        </div>
      )}
    </div>
  );
}
