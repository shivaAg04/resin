import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as Testimonial[];
  } catch (error) {
    console.error("getActiveTestimonials error", error);
    return [];
  }
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllTestimonialsAdmin error", error);
    return [];
  }
  return data as Testimonial[];
}

export interface CreateTestimonialInput {
  customerName: string;
  rating: number;
  reviewText: string;
  imageUrl?: string;
}

export async function createTestimonial(
  input: CreateTestimonialInput,
): Promise<{ testimonial?: Testimonial; error?: string }> {
  const customerName = input.customerName.trim();
  if (!customerName) return { error: "Customer name is required." };

  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      customer_name: customerName,
      rating,
      review_text: input.reviewText.trim() || null,
      image_url: input.imageUrl || null,
      sort_order: (existing?.sort_order ?? -1) + 1,
    })
    .select("*")
    .single();

  if (error) {
    console.error("createTestimonial error", error);
    return { error: "Could not add this testimonial. Please try again." };
  }
  return { testimonial: data as Testimonial };
}

export async function deleteTestimonial(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("deleteTestimonial error", error);
    return { error: "Could not delete this testimonial." };
  }
  return {};
}

export async function setTestimonialActive(id: string, isActive: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update({ is_active: isActive }).eq("id", id);
  if (error) {
    console.error("setTestimonialActive error", error);
    return { error: "Could not update testimonial." };
  }
  return {};
}
