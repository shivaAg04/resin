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
  name: string;
  slug: string;
  show_on_home: boolean;
  home_position: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active: boolean;
  images: string[];
  categories: Category[];
  sort_order: number;
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
