import { NextResponse } from "next/server";
import type { HydratedDocument } from "mongoose";

import { getAuthenticatedUser } from "@/lib/auth";
import User, { type UserDocument } from "@/models/User";

export const runtime = "nodejs";

const currencies = ["USD", "NGN", "EUR", "GBP"] as const;
const paymentMethods = [
  "Cash",
  "Bank Transfer",
  "Credit Card",
  "PayPal",
  "Crypto",
] as const;

type Currency = (typeof currencies)[number];
type PaymentMethod = (typeof paymentMethods)[number];

type SettingsBody = {
  businessLogo?: unknown;
  businessName?: unknown;
  defaultCurrency?: unknown;
  defaultPaymentMethod?: unknown;
  name?: unknown;
};

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
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return unauthorizedResponse();
    }

    const body = (await req.json()) as SettingsBody;
    const name = normalizeText(body.name);
    const businessName = normalizeText(body.businessName);
    const defaultCurrency = normalizeText(body.defaultCurrency);
    const defaultPaymentMethod = normalizeText(body.defaultPaymentMethod);
    const businessLogo = normalizeText(body.businessLogo);

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    if (!isCurrency(defaultCurrency)) {
      return NextResponse.json(
        { success: false, message: "Invalid default currency." },
        { status: 400 }
      );
    }

    if (!isPaymentMethod(defaultPaymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Invalid default payment method." },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      currentUser.id,
      {
        businessLogo,
        businessName,
        defaultCurrency,
        defaultPaymentMethod,
        name,
      },
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

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isCurrency(value: string): value is Currency {
  return currencies.includes(value as Currency);
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return paymentMethods.includes(value as PaymentMethod);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Authentication required." },
    { status: 401 }
  );
}
