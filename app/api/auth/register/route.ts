import { hash } from "bcryptjs";
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
  registerSchema,
  validateJsonRequest,
} from "@/lib/validations/api";
import User from "@/models/User";

export const runtime = "nodejs";

const tokenMaxAge = 60 * 60 * 24 * 7;
const registerLimit = 5;
const registerWindowMs = 30 * 60 * 1000;
const tooManyRequestsMessage = "Too many requests. Please try again later.";

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const limitResult = rateLimit(
      `auth:register:${getClientIp(req)}`,
      registerLimit,
      registerWindowMs
    );

    if (!limitResult.allowed) {
      return rateLimitExceededResponse(
        tooManyRequestsMessage,
        limitResult.retryAfter
      );
    }

    const validation = await validateJsonRequest(req, registerSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const { email, name, password } = validation.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      plan: "free",
      dailyLimit: 10,
    });

    const token = sign({ userId: String(user._id) }, getJwtSecret(), {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          plan: user.plan,
          dailyLimit: user.dailyLimit,
        },
      },
      { status: 201 }
    );

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
      { success: false, message: "Registration failed." },
      { status: 500 }
    );
  }
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Please define the JWT_SECRET environment variable.");
  }

  return secret;
}
