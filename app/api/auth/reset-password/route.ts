import { createHash } from "node:crypto";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    const normalizedToken = typeof token === "string" ? token.trim() : "";
    const normalizedPassword =
      typeof newPassword === "string" ? newPassword : "";

    if (!normalizedToken || !normalizedPassword) {
      return NextResponse.json(
        { success: false, message: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (normalizedPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const resetToken = hashResetToken(normalizedToken);
    const resetTokenExpiry = { $gt: new Date() };
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry,
    }).select("_id");

    if (!user) {
      return invalidTokenResponse();
    }

    const hashedPassword = await hash(normalizedPassword, 12);
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
      message: "Password reset successfully.",
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
