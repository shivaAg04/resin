export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export interface Category {
  id: string;
  code: string;
  name: string;
  slug: string;
  show_on_home: boolean;
  home_position: number;
  created_at: string;
  updated_at: string;
}

export interface BundleItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  quantity: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active: boolean;
  images: string[];
  categories: Category[];
  sort_order: number;
  reel_url: string | null;
  bundle_items: BundleItem[];
  created_at: string;
  updated_at: string;
}

export type ProductInput = {
  name: string;
  slug?: string;
  description: string;
  price: number;
  categoryIds: string[];
  is_active: boolean;
  images: string[];
  reelUrl?: string;
  bundleItemIds?: string[];
};

export interface Reel {
  id: string;
  url: string;
  caption: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  whatsapp_number: string;
  address: string;
  city: string;
  state: string | null;
  pincode: string;
  instagram_username: string | null;
  special_instructions: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}
