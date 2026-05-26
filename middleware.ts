import { NextResponse, type NextRequest } from "next/server";

const jwtCookieName = "aiflow_token";
const nextAuthSessionCookieNames = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;

export function middleware(request: NextRequest) {
  if (hasAuthCookie(request)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

function hasAuthCookie(request: NextRequest) {
  if (request.cookies.get(jwtCookieName)?.value) {
    return true;
  }

  return request.cookies
    .getAll()
    .some(
      (cookie) => cookie.value && isNextAuthSessionCookieName(cookie.name)
    );
}

function isNextAuthSessionCookieName(name: string) {
  return nextAuthSessionCookieNames.some(
    (cookieName) => name === cookieName || name.startsWith(`${cookieName}.`)
  );
}
