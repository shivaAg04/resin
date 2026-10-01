-- Online payments (Razorpay), alongside the existing WhatsApp/COD flow.
-- payment_method/payment_status default to the existing behavior so every
-- current order is unaffected; only orders placed through "Pay Online"
-- get payment_method = 'online' and a razorpay_order_id.
alter table orders
  add column if not exists payment_method text not null default 'cod' check (payment_method in ('cod', 'online')),
  add column if not exists payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text;

create index if not exists orders_razorpay_order_id_idx on orders (razorpay_order_id);
