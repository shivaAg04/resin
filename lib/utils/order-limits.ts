/**
 * Kept apart from validation.ts so client components (cart, quantity
 * pickers) can import it without pulling the whole zod library into
 * every page's JavaScript.
 */
export const MAX_ORDER_QUANTITY = 20;
