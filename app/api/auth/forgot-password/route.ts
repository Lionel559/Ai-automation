import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resetTokenLifetimeMs = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email." },
        { status: 404 }
      );
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

    if (process.env.NODE_ENV !== "production") {
      console.log(`AIFLOW password reset link: ${resetUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link generated.",
      resetUrl,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not generate reset link." },
      { status: 500 }
    );
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
