import { BUSINESS_WHATSAPP_NUMBER } from "@/lib/whatsapp";

/**
 * Site-wide maintenance switch. Set MAINTENANCE_MODE=1 in the Vercel project
 * env vars and redeploy to show the maintenance page on every page; remove it
 * (and redeploy) to bring the site back. API routes keep working.
 */
export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === "1";
}

const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'd like to place an order.",
)}`;

export const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>We'll be back soon | Spilled Colours</title>
<link rel="icon" href="/favicon.ico">
<style>
  *{box-sizing:border-box;margin:0}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;
    padding:24px 16px;background:#fcf8f5;color:#1f0352;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center}
  main{max-width:440px}
  img{width:96px;height:auto;margin-bottom:24px}
  h1{font-family:Georgia,"Times New Roman",serif;font-weight:500;font-size:32px;line-height:1.2;margin-bottom:12px}
  p{font-size:16px;line-height:1.6;color:#6d5b8f;margin-bottom:28px}
  a{display:inline-block;padding:12px 22px;border-radius:999px;background:#25d366;color:#fff;
    text-decoration:none;font-weight:600;font-size:15px}
  a:hover{background:#1ebe5a}
</style>
</head>
<body>
<main>
  <img src="/logo.png" alt="Spilled Colours">
  <h1>We'll be back soon</h1>
  <p>Our website is getting a quick upgrade and will be live again in a few days.
  You can still order or ask anything on WhatsApp.</p>
  <a href="${whatsappUrl}">Chat on WhatsApp</a>
</main>
</body>
</html>`;
