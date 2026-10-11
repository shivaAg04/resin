import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CustomRequestStatusSelect } from "@/components/admin/CustomRequestStatusSelect";
import { DeleteCustomRequestButton } from "@/components/admin/DeleteCustomRequestButton";
import { getCustomRequestsAdmin, getReferenceImageUrls } from "@/lib/data/custom-requests";
import { CUSTOM_REQUEST_STATUSES, type CustomRequestStatus } from "@/lib/custom-requests/options";
import { buildCustomerWhatsAppUrl } from "@/lib/whatsapp";
import { cn, formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Custom Requests" };

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}

export default async function AdminCustomRequestsPage(props: PageProps<"/admin/custom-requests">) {
  const searchParams = await props.searchParams;
  const statusParam = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const status = CUSTOM_REQUEST_STATUSES.find((s) => s === statusParam) as CustomRequestStatus | undefined;

  const requests = await getCustomRequestsAdmin(status);
  const imageUrls = await getReferenceImageUrls(requests.flatMap((r) => r.reference_images));

  const filters: { label: string; value?: CustomRequestStatus }[] = [
    { label: "All" },
    ...CUSTOM_REQUEST_STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s })),
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Custom Requests</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Requests from the Custom Orders form. Message the customer on WhatsApp, then update the status as it
        moves along.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/custom-requests?status=${filter.value}` : "/admin/custom-requests"}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              status === filter.value
                ? "border-ink bg-ink text-cream"
                : "border-border-soft text-ink-soft hover:border-ink/30",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {requests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-soft py-12 text-center text-sm text-ink-soft">
            {status ? `No ${status} requests.` : "No custom requests yet."}
          </p>
        ) : (
          requests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-border-soft/70 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink-soft">
                    {request.request_number} · {formatDate(request.created_at)}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-ink">{request.customer_name}</h2>
                  <p className="text-sm text-ink-soft">{request.whatsapp_number}</p>
                </div>
                <div className="flex items-center gap-1">
                  <CustomRequestStatusSelect id={request.id} status={request.status} />
                  <DeleteCustomRequestButton id={request.id} requestNumber={request.request_number} />
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                <Detail label="Looking for" value={request.looking_for} />
                <Detail label="Occasion" value={request.occasion} />
                <Detail label="Budget" value={request.budget} />
                <Detail label="Quantity" value={request.quantity} />
                <Detail label="Needed by" value={request.required_date ? formatDate(request.required_date) : null} />
                <Detail label="Colours" value={request.preferred_colours} />
              </dl>

              {request.details && (
                <p className="mt-4 whitespace-pre-line rounded-xl bg-lilac/60 p-3 text-sm text-ink">{request.details}</p>
              )}

              {request.reference_images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {request.reference_images.map((path, i) =>
                    imageUrls[path] ? (
                      <a
                        key={path}
                        href={imageUrls[path]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block h-24 w-24 overflow-hidden rounded-lg border border-border-soft bg-amber-light/30"
                        title="Open full photo"
                      >
                        <Image
                          src={imageUrls[path]}
                          alt={`Reference ${i + 1} from ${request.customer_name}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </a>
                    ) : (
                      <span
                        key={path}
                        className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-border-soft text-center text-[11px] text-ink-soft"
                      >
                        Photo unavailable
                      </span>
                    ),
                  )}
                </div>
              )}

              <ButtonLink
                href={buildCustomerWhatsAppUrl(
                  request.whatsapp_number,
                  `Hi ${request.customer_name}, this is Spilled Colours about your custom request ${request.request_number}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="sm"
                className="mt-5"
              >
                <MessageCircle className="h-4 w-4" /> Message on WhatsApp
              </ButtonLink>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
