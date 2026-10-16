import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import Image from "next/image";
import Link from "next/link";
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
  const typeParam = typeof searchParams.type === "string" ? searchParams.type : "all";
  const status = CUSTOM_REQUEST_STATUSES.find((s) => s === statusParam) as CustomRequestStatus | undefined;

  let requests = await getCustomRequestsAdmin(status);
  if (typeParam === "bulk") {
    requests = requests.filter((r) => r.looking_for.startsWith("[Bulk Order]"));
  } else if (typeParam === "custom") {
    requests = requests.filter((r) => !r.looking_for.startsWith("[Bulk Order]"));
  }

  const imageUrls = await getReferenceImageUrls(requests.flatMap((r) => r.reference_images));

  const statusFilters: { label: string; value?: CustomRequestStatus }[] = [
    { label: "All" },
    ...CUSTOM_REQUEST_STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s })),
  ];

  const typeFilters = [
    { label: "All Types", value: "all" },
    { label: "Bulk Orders", value: "bulk" },
    { label: "Custom Requests", value: "custom" },
  ];

  function buildFilterHref(newStatus?: string, newType?: string) {
    const params = new URLSearchParams();
    const s = newStatus !== undefined ? newStatus : statusParam;
    const t = newType !== undefined ? newType : typeParam;
    if (s) params.set("status", s);
    if (t && t !== "all") params.set("type", t);
    const qs = params.toString();
    return qs ? `/admin/custom-requests?${qs}` : "/admin/custom-requests";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Custom &amp; Bulk Requests</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Enquiries from the Custom Orders and Bulk &amp; Corporate Gifting forms.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-border-soft/70 bg-white p-1">
          {typeFilters.map((tf) => (
            <Link
              key={tf.value}
              href={buildFilterHref(undefined, tf.value)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                typeParam === tf.value
                  ? "bg-ink text-cream"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink",
              )}
            >
              {tf.label}
            </Link>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((filter) => (
            <Link
              key={filter.label}
              href={buildFilterHref(filter.value, undefined)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                status === filter.value
                  ? "border-ink bg-ink text-cream"
                  : "border-border-soft text-ink-soft hover:border-ink/30",
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {requests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-soft py-12 text-center text-sm text-ink-soft">
            {status || typeParam !== "all" ? "No matching requests found." : "No requests yet."}
          </p>
        ) : (
          requests.map((request) => {
            const isBulk = request.looking_for.startsWith("[Bulk Order]");
            const displayTitle = isBulk ? request.looking_for.replace("[Bulk Order] ", "") : request.looking_for;
            const waMessage = isBulk
              ? `Hi ${request.customer_name}, this is Spilled Colours regarding your bulk order enquiry (${request.request_number}).`
              : `Hi ${request.customer_name}, this is Spilled Colours about your custom request ${request.request_number}.`;

            return (
              <article key={request.id} className="rounded-2xl border border-border-soft/70 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs text-ink-soft">
                        {request.request_number} · {formatDate(request.created_at)}
                      </p>
                      {isBulk ? (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-900">
                          Bulk Order
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-dark">
                          Custom Request
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 font-display text-lg font-semibold text-ink">{request.customer_name}</h2>
                    <p className="text-sm text-ink-soft">{request.whatsapp_number}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CustomRequestStatusSelect id={request.id} status={request.status} />
                    <DeleteCustomRequestButton id={request.id} requestNumber={request.request_number} />
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  <Detail label={isBulk ? "Products / Occasion" : "Looking for"} value={displayTitle} />
                  <Detail label="Occasion" value={request.occasion} />
                  <Detail label="Budget" value={request.budget} />
                  <Detail label="Quantity" value={request.quantity} />
                  <Detail label="Needed by" value={request.required_date ? formatDate(request.required_date) : null} />
                  {!isBulk && <Detail label="Colours" value={request.preferred_colours} />}
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
                  href={buildCustomerWhatsAppUrl(request.whatsapp_number, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="sm"
                  className="mt-5"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Message on WhatsApp
                </ButtonLink>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
