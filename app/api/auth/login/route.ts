import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
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
  loginSchema,
  validateJsonRequest,
} from "@/lib/validations/api";
import User from "@/models/User";

export const runtime = "nodejs";

const tokenMaxAge = 60 * 60 * 24 * 7;
const loginLimit = 5;
const loginWindowMs = 10 * 60 * 1000;
const tooManyRequestsMessage = "Too many requests. Please try again later.";

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const limitResult = rateLimit(
      `auth:login:${getClientIp(req)}`,
      loginLimit,
      loginWindowMs
    );

    if (!limitResult.allowed) {
      return rateLimitExceededResponse(
        tooManyRequestsMessage,
        limitResult.retryAfter
      );
    }

    const validation = await validateJsonRequest(req, loginSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const { email, password } = validation.data;

    await connectToDatabase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email" },
        { status: 404 }
      );
    }

    if (!user.password) {
      return invalidPasswordResponse();
    }

    const passwordsMatch = await compare(password, user.password);

    if (!passwordsMatch) {
      return invalidPasswordResponse();
    }

    const token = sign({ userId: String(user._id) }, getJwtSecret(), {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        plan: user.plan,
        dailyLimit: user.dailyLimit,
      },
    });

    response.cookies.set("aiflow_token", token, {
      httpOnly: true,
      maxAge: tokenMaxAge,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}

function invalidPasswordResponse() {
  return NextResponse.json(
    { success: false, message: "Invalid password" },
    { status: 401 }
  );
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Please define the JWT_SECRET environment variable.");
  }

  return secret;
}
