import { NextResponse } from "next/server";

const localOrigin = "http://localhost:3000";

// Origin checks block basic CSRF against cookie-auth mutation routes.
export function isAllowedOrigin(req: Request) {
  const requestOrigin = normalizeOrigin(req.headers.get("origin"));

  if (!requestOrigin) {
    return false;
  }

  return getAllowedOrigins().includes(requestOrigin);
}

export function forbiddenOriginResponse() {
  return NextResponse.json(
    {
      success: false,
      message: "Forbidden",
    },
    { status: 403 }
  );
}

function getAllowedOrigins() {
  return Array.from(
    new Set([localOrigin, process.env.NEXTAUTH_URL].map(normalizeOrigin))
  ).filter(Boolean);
}

function normalizeOrigin(origin?: string | null) {
  if (!origin) {
    return "";
  }

  try {
    return new URL(origin).origin;
  } catch {
    return "";
  }
}
