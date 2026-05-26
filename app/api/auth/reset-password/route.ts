import { createHash } from "node:crypto";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";
import connectToDatabase from "@/lib/mongodb";
import {
  getClientIp,
  rateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";
import {
  invalidInputResponse,
  resetPasswordSchema,
  validateJsonRequest,
} from "@/lib/validations/api";
import User from "@/models/User";

export const runtime = "nodejs";

const genericSuccessMessage = "Password reset successfully.";
const resetPasswordLimit = 5;
const resetPasswordWindowMs = 30 * 60 * 1000;
const tooManyRequestsMessage = "Too many requests. Please try again later.";

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const limitResult = rateLimit(
      `auth:reset-password:${getClientIp(req)}`,
      resetPasswordLimit,
      resetPasswordWindowMs
    );

    if (!limitResult.allowed) {
      return rateLimitExceededResponse(
        tooManyRequestsMessage,
        limitResult.retryAfter
      );
    }

    const validation = await validateJsonRequest(req, resetPasswordSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const { newPassword, token } = validation.data;

    await connectToDatabase();

    const resetToken = hashResetToken(token);
    const resetTokenExpiry = { $gt: new Date() };
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry,
    }).select("_id");

    if (!user) {
      return invalidTokenResponse();
    }

    const hashedPassword = await hash(newPassword, 12);
    const updateResult = await User.updateOne(
      {
        _id: user._id,
        resetToken,
        resetTokenExpiry,
      },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return invalidTokenResponse();
    }

    return NextResponse.json({
      success: true,
      message: genericSuccessMessage,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not reset password." },
      { status: 500 }
    );
  }
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function invalidTokenResponse() {
  return NextResponse.json(
    { success: false, message: "Reset link is invalid or has expired." },
    { status: 400 }
  );
}
