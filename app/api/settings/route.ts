import { NextResponse } from "next/server";
import type { HydratedDocument } from "mongoose";

import { getAuthenticatedUser } from "@/lib/auth";
import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";
import {
  invalidInputResponse,
  settingsSchema,
  validateJsonRequest,
} from "@/lib/validations/api";
import User, { type UserDocument } from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSettingsUser();

    if (!user) {
      return unauthorizedResponse();
    }

    return NextResponse.json({
      success: true,
      settings: serializeSettings(user),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not load settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const validation = await validateJsonRequest(req, settingsSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const user = await User.findByIdAndUpdate(
      currentUser.id,
      validation.data,
      { new: true }
    );

    if (!user) {
      return unauthorizedResponse();
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully.",
      settings: serializeSettings(user),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not save settings." },
      { status: 500 }
    );
  }
}

async function getSettingsUser() {
  const currentUser = await getAuthenticatedUser();

  if (!currentUser) {
    return null;
  }

  return User.findById(currentUser.id);
}

function serializeSettings(user: HydratedDocument<UserDocument>) {
  return {
    businessLogo: user.businessLogo,
    businessName: user.businessName,
    defaultCurrency: user.defaultCurrency,
    defaultPaymentMethod: user.defaultPaymentMethod,
    email: user.email,
    name: user.name,
  };
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Authentication required." },
    { status: 401 }
  );
}
