import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";
import connectToDatabase from "@/lib/mongodb";
import {
  getClientIp,
  rateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  invalidInputResponse,
  validateJsonRequest,
} from "@/lib/validations/api";
import User from "@/models/User";

export const runtime = "nodejs";

const resetTokenLifetimeMs = 60 * 60 * 1000;
const forgotPasswordLimit = 3;
const forgotPasswordWindowMs = 30 * 60 * 1000;
const genericSuccessMessage =
  "If an account exists, a reset link has been sent.";
const tooManyRequestsMessage = "Too many requests. Please try again later.";

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const limitResult = rateLimit(
      `auth:forgot-password:${getClientIp(req)}`,
      forgotPasswordLimit,
      forgotPasswordWindowMs
    );

    if (!limitResult.allowed) {
      return rateLimitExceededResponse(
        tooManyRequestsMessage,
        limitResult.retryAfter
      );
    }

    const validation = await validateJsonRequest(req, forgotPasswordSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const { email } = validation.data;

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return genericSuccessResponse();
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + resetTokenLifetimeMs);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken: hashResetToken(resetToken),
          resetTokenExpiry,
        },
      }
    );

    const resetUrl = buildResetUrl(req, resetToken);

    // Never return reset tokens to the browser; log local links only for dev.
    if (process.env.NODE_ENV !== "production") {
      console.log(`AIFLOW password reset link: ${resetUrl}`);
    }

    return genericSuccessResponse();
  } catch (error) {
    console.log(error);

    return genericSuccessResponse();
  }
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function buildResetUrl(req: Request, token: string) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(
    /\/+$/,
    ""
  );
  const baseUrl = configuredBaseUrl || new URL(req.url).origin;
  const resetUrl = new URL("/reset-password", baseUrl);

  resetUrl.searchParams.set("token", token);

  return resetUrl.toString();
}

function genericSuccessResponse() {
  return NextResponse.json({
    success: true,
    message: genericSuccessMessage,
  });
}
