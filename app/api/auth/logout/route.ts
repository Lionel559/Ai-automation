import { NextResponse } from "next/server";

import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return forbiddenOriginResponse();
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set("aiflow_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
