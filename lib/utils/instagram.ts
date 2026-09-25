/** Accepts any instagram.com/reel|reels|p/... URL and strips tracking query params. */
export function normalizeReelUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (!/(^|\.)instagram\.com$/.test(url.hostname)) return null;
    if (!/^\/(reel|reels|p)\//.test(url.pathname)) return null;
    return `https://www.instagram.com${url.pathname}`;
  } catch {
    return null;
  }
}
