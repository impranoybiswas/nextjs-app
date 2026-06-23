import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// ─── Route Config ─────────────────────────────────────────
const routeConfig = {
  protected: ["/dashboard"],
  adminOnly: ["/admin"],
  moderatorAndAbove: ["/moderator"],
  authRoutes: ["/sign-in", "/sign-up"],
};

// ─── Helpers ──────────────────────────────────────────────
function getSessionCookie(request: NextRequest): string | undefined {
  const cookieNames = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "better-auth.session",
    "__Secure-better-auth.session",
  ];

  for (const name of cookieNames) {
    const cookie = request.cookies.get(name);
    if (cookie?.value) return cookie.value;
  }
  return undefined;
}

function getPathnameWithoutLocale(pathname: string): string {
  return routing.locales.reduce(
    (acc, locale) =>
      acc.startsWith(`/${locale}/`)
        ? acc.slice(`/${locale}`.length)
        : acc === `/${locale}`
          ? "/"
          : acc,
    pathname,
  );
}

async function getUserRole(
  origin: string,
  cookieHeader: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${origin}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
    });
    if (!res.ok) return null;
    const session = await res.json();
    return session?.user?.role ?? null;
  } catch {
    return null;
  }
}

// ─── Middleware ────────────────────────────────────────────
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const path = getPathnameWithoutLocale(pathname);
  const isLoggedIn = !!getSessionCookie(request);

  // Auth routes → logged in user go to dashboard
  if (routeConfig.authRoutes.some((r) => path.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
    return intlMiddleware(request);
  }

  // Protected routes → logged in user go to sign-in
  if (routeConfig.protected.some((r) => path.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", origin));
    }
    return intlMiddleware(request);
  }

  // Admin / Moderator routes → role check
  const isAdminRoute = routeConfig.adminOnly.some((r) => path.startsWith(r));
  const isModRoute = routeConfig.moderatorAndAbove.some((r) =>
    path.startsWith(r),
  );

  if (isAdminRoute || isModRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", origin));
    }

    const role = await getUserRole(origin, request.headers.get("cookie") ?? "");

    if (!role) {
      return NextResponse.redirect(new URL("/sign-in", origin));
    }
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
    if (isModRoute && role !== "admin" && role !== "moderator") {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }

    return intlMiddleware(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
