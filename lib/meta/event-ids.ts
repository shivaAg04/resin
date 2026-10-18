/**
 * Shared by the browser pixel and the Conversions API: Meta drops the second
 * copy of an event when both sides send the same name + id.
 */
export const metaPurchaseEventId = (orderNumber: string) => `purchase-${orderNumber}`;
export const metaLeadEventId = (requestNumber: string) => `lead-${requestNumber}`;
