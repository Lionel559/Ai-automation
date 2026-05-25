import { verify, type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

type AuthTokenPayload = JwtPayload & {
  userId?: string;
};

export async function GET() {
  try {
    const token = (await cookies()).get("aiflow_token")?.value;

    if (!token) {
      return unauthorizedResponse();
    }

    const decoded = verify(token, getJwtSecret()) as string | AuthTokenPayload;

    if (typeof decoded === "string" || !decoded.userId) {
      return unauthorizedResponse();
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return unauthorizedResponse();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        plan: user.plan,
        dailyLimit: user.dailyLimit,
      },
    });
  } catch (error) {
    console.log(error);

    return unauthorizedResponse();
  }
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Authentication required." },
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
