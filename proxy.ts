import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isMaintenanceMode, MAINTENANCE_HTML } from "@/lib/maintenance";

// Renamed from `middleware.ts` in Next.js 16 — same behavior, new file name.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMaintenanceMode() && !pathname.startsWith("/api")) {
    return new NextResponse(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "retry-after": "86400",
        "cache-control": "no-store",
      },
    });
  }

  // The matcher covers every page so the maintenance switch above can work;
  // the auth check below is only for the admin area.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";

  if (!user && pathname.startsWith("/admin") && !isLoginPage) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  // Everything except static assets, so maintenance mode can cover every page.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|logo.png|cursor-resin.svg|placeholder-product.svg|video/).*)",
  ],
};
