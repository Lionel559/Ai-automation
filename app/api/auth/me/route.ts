import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { getGenerationUsage } from "@/lib/usage-limits";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const usage = await getGenerationUsage(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        businessName: user.businessName,
        defaultCurrency: user.defaultCurrency,
        defaultPaymentMethod: user.defaultPaymentMethod,
        businessLogo: user.businessLogo,
        dailyLimit: usage.dailyLimit,
        generationsUsedToday: usage.generationsUsedToday,
        remainingGenerations: usage.remainingGenerations,
        hasUnlimitedGenerations: usage.unlimited,
        authSource: user.authSource,
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
