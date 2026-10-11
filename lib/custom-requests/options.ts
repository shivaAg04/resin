/** Dropdown choices on the custom order form. Stored as the label text, so admin sees exactly what was picked. */
export const LOOKING_FOR_OPTIONS = [
  "Personalised gift",
  "Memory keepsake / flower preservation",
  "Nameplate / home decor",
  "Pooja & festive",
  "Car accessory",
  "Bulk / corporate gifting",
  "Something else",
];

export const OCCASION_OPTIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Housewarming",
  "Festival",
  "Corporate",
  "Just because",
  "Other",
];

export const BUDGET_OPTIONS = [
  "Under ₹1,000",
  "₹1,000 – ₹2,500",
  "₹2,500 – ₹5,000",
  "₹5,000 – ₹10,000",
  "Above ₹10,000",
  "Not sure yet",
];

export const QUANTITY_OPTIONS = ["1", "2 – 5", "6 – 20", "21 – 50", "More than 50"];

export const CUSTOM_REQUEST_STATUSES = ["new", "contacted", "quoted", "confirmed", "closed"] as const;
export type CustomRequestStatus = (typeof CUSTOM_REQUEST_STATUSES)[number];

/** Private storage bucket for customers' reference photos (migration 0014). */
export const REFERENCE_BUCKET = "custom-references";
export const MAX_REFERENCE_IMAGES = 3;
export const MAX_REFERENCE_IMAGE_BYTES = 10 * 1024 * 1024;
export const REFERENCE_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

/** Upload paths the server hands out — anything else submitted with a request is rejected. */
export const REFERENCE_PATH_PATTERN = /^pending\/[0-9a-f-]{36}\.(jpg|png|webp|heic|heif)$/;
