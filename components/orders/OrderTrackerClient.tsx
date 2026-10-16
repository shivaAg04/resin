"use client";

import { useEffect, useState, useTransition } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { trackOrderAction, trackMultipleOrdersAction, type TrackedOrder } from "@/app/(site)/track-order/actions";
import { formatPrice } from "@/lib/utils/format";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "spilled_colours_saved_orders";

interface SavedEntry {
  orderNumber: string;
  phone: string;
  savedAt: string;
}

const STEPS = [
  { key: "new", label: "Order Placed", desc: "Order & payment recorded" },
  { key: "confirmed", label: "Confirmed", desc: "Design & schedule approved" },
  { key: "processing", label: "In Production", desc: "Handcrafting your resin piece" },
  { key: "shipped", label: "Dispatched", desc: "Courier tracking shared on WhatsApp" },
  { key: "delivered", label: "Delivered", desc: "Enjoy your bespoke creation!" },
] as const;

function getStepIndex(status: string): number {
  switch (status) {
    case "new":
      return 0;
    case "confirmed":
      return 1;
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

export function OrderTrackerClient({ initialOrderNumber = "" }: { initialOrderNumber?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [activeOrder, setActiveOrder] = useState<TrackedOrder | null>(null);
  const [savedOrders, setSavedOrders] = useState<TrackedOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load saved orders from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const entries: SavedEntry[] = JSON.parse(raw);
      if (Array.isArray(entries) && entries.length > 0) {
        trackMultipleOrdersAction(entries).then((res) => {
          if (res.success && res.orders.length > 0) {
            setSavedOrders(res.orders);
            // If user arrived with no specific query, show the most recent order
            setActiveOrder((current) => (!initialOrderNumber && !current ? res.orders[0] : current));
          }
        });
      }
    } catch {
      // ignore JSON parse error
    }
  }, [initialOrderNumber]);

  function persistOrder(orderNum: string, ph: string) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: SavedEntry[] = raw ? JSON.parse(raw) : [];
      const filtered = existing.filter(
        (e) => e.orderNumber.toUpperCase() !== orderNum.toUpperCase()
      );
      const updated: SavedEntry[] = [
        { orderNumber: orderNum.toUpperCase(), phone: ph, savedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage failure
    }
  }

  function handleRemoveSaved(orderNum: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const existing: SavedEntry[] = JSON.parse(raw);
      const updated = existing.filter(
        (entry) => entry.orderNumber.toUpperCase() !== orderNum.toUpperCase()
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedOrders((prev) => prev.filter((o) => o.orderNumber !== orderNum));
      if (activeOrder?.orderNumber === orderNum) {
        setActiveOrder(savedOrders.find((o) => o.orderNumber !== orderNum) || null);
      }
    } catch {
      // ignore
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await trackOrderAction(orderNumber, phone);
      if (res.success && res.order) {
        setActiveOrder(res.order);
        persistOrder(res.order.orderNumber, phone);
        // add to saved list if not present
        setSavedOrders((prev) => {
          const exists = prev.some((o) => o.orderNumber === res.order!.orderNumber);
          return exists ? prev : [res.order!, ...prev];
        });
      } else {
        setError(res.error || "Could not find order. Please verify your details.");
      }
    });
  }

  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;
  const isCancelled = activeOrder?.status === "cancelled";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-dark">
          Order Tracking &amp; History
        </span>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Track Your Creation
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-soft">
          Enter your order number and WhatsApp number below to follow the journey of your bespoke handmade piece.
        </p>
      </div>

      {/* Search Box */}
      <div className="mt-8 rounded-2xl border border-border-soft bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label htmlFor="orderNumber" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft">
              Order Number
            </label>
            <Input
              id="orderNumber"
              type="text"
              placeholder="e.g. SC-1001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft">
              WhatsApp / Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto h-11 px-7 uppercase text-xs tracking-wider"
            >
              {isPending ? (
                "Tracking..."
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" /> Track
                </span>
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Saved / Previous Orders Bar */}
      {savedOrders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Your Orders on this Device ({savedOrders.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedOrders.map((o) => {
              const isSelected = activeOrder?.orderNumber === o.orderNumber;
              return (
                <button
                  key={o.orderNumber}
                  type="button"
                  onClick={() => {
                    setActiveOrder(o);
                    setOrderNumber(o.orderNumber);
                  }}
                  className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-amber-dark bg-amber-dark/5 text-ink shadow-sm"
                      : "border-border-soft bg-white text-ink-soft hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  <span className="font-semibold text-ink">{o.orderNumber}</span>
                  <span className="text-[11px] capitalize text-ink-soft">({o.status})</span>
                  <span
                    onClick={(e) => handleRemoveSaved(o.orderNumber, e)}
                    className="ml-1 opacity-40 hover:opacity-100 hover:text-red-500 transition-opacity"
                    title="Remove from this device"
                  >
                    <Trash2 className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Status Result */}
      {activeOrder && (
        <div className="mt-8 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm">
            {/* Order Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-soft bg-cream/50 px-6 py-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    Order {activeOrder.orderNumber}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium uppercase tracking-wider ${
                      isCancelled
                        ? "bg-red-100 text-red-700"
                        : activeOrder.status === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {isCancelled ? (
                      <>
                        <XCircle className="h-3.5 w-3.5" /> Cancelled
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5" /> {activeOrder.status}
                      </>
                    )}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {activeOrder.city}, {activeOrder.pincode}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-ink-soft">Total</span>
                <p className="font-display text-lg font-bold text-amber-dark">
                  {formatPrice(activeOrder.totalAmount)}
                </p>
                <span className="text-[11px] uppercase tracking-wider text-ink-soft">
                  Payment: {activeOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Stepper / Timeline */}
            {!isCancelled ? (
              <div className="p-6 sm:p-8 border-b border-border-soft">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border-soft sm:hidden" />
                  <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-border-soft">
                    <div
                      className="h-full bg-amber-dark transition-all duration-500"
                      style={{
                        width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-5 sm:gap-2">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={step.key} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 relative">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              isCompleted
                                ? "border-amber-dark bg-amber-dark text-white shadow-sm"
                                : "border-border-soft bg-white text-ink-soft"
                            } ${isCurrent ? "ring-4 ring-amber-light/30" : ""}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-xs font-semibold">{idx + 1}</span>
                            )}
                          </div>
                          <div className="sm:text-center">
                            <p
                              className={`text-sm font-semibold ${
                                isCompleted ? "text-ink" : "text-ink-soft"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-ink-soft/90 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Important Notice callouts */}
                <div className="mt-8 rounded-xl bg-lilac/30 p-4 border border-lilac">
                  <div className="flex gap-3 items-start">
                    <Sparkles className="h-5 w-5 text-amber-dark shrink-0 mt-0.5" />
                    <div className="text-xs text-ink leading-relaxed">
                      <p className="font-semibold text-ink">Bespoke Handcrafted Timeline</p>
                      <p className="mt-1 text-ink-soft">
                        Standard turnaround is <strong>15–20 days</strong> from order confirmation to dispatch.
                        Before dispatch, we share high-resolution photos/videos of your finished resin piece with you on WhatsApp for your approval!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-red-50/50 border-b border-border-soft text-sm text-red-700">
                This order was cancelled. If you believe this was an error or need assistance, please contact us on WhatsApp.
              </div>
            )}

            {/* Order Items List */}
            <div className="p-6 sm:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-4">
                Items in this Order ({activeOrder.items.length})
              </h3>

              <div className="divide-y divide-border-soft">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{item.productName}</span>
                        <span className="text-xs text-ink-soft">× {item.quantity}</span>
                      </div>

                      {item.customization && (
                        <div className="rounded-lg bg-cream/70 p-2.5 text-xs text-ink border border-border-soft/60">
                          <span className="font-medium text-amber-dark">Customization details:</span>{" "}
                          <span className="italic">{item.customization}</span>
                        </div>
                      )}

                      {item.imageUrl && (
                        <div className="mt-2 flex items-center gap-2">
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-amber-dark hover:underline font-medium"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> View uploaded reference photo
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="text-right sm:min-w-[100px]">
                      <span className="font-display font-semibold text-ink">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-cream/30 p-6 border-t border-border-soft">
              <p className="text-xs text-ink-soft">
                Need urgent updates or changes? Chat with us directly on WhatsApp.
              </p>
              <a
                href={buildOrderWhatsAppUrl({
                  orderNumber: activeOrder.orderNumber,
                  items: activeOrder.items.map((i) => ({
                    productName: i.productName,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    subtotal: i.subtotal,
                  })),
                  totalAmount: activeOrder.totalAmount,
                  customerName: activeOrder.customerName,
                  whatsappNumber: activeOrder.whatsappNumber,
                  address: "",
                  city: activeOrder.city,
                  state: activeOrder.state,
                  pincode: activeOrder.pincode,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4" /> Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
