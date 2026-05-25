import { verify, type JwtPayload } from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

type AuthSource = "jwt" | "nextauth";

type AuthTokenPayload = JwtPayload & {
  userId?: string;
};

export type AuthenticatedUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  plan?: string;
  dailyLimit?: number;
  businessName?: string;
  defaultCurrency?: string;
  defaultPaymentMethod?: string;
  businessLogo?: string;
  authSource: AuthSource;
};

export async function getAuthenticatedUser() {
  const jwtUser = await getJwtUser();

  if (jwtUser) {
    return jwtUser;
  }

  return getNextAuthUser();
}

async function getJwtUser(): Promise<AuthenticatedUser | null> {
  const token = (await cookies()).get("aiflow_token")?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const decoded = verify(token, secret) as string | AuthTokenPayload;

    if (typeof decoded === "string" || !decoded.userId) {
      return null;
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return null;
    }

    return serializeUser(user, "jwt");
  } catch {
    return null;
  }
}

async function getNextAuthUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);
  const normalizedEmail = session?.user?.email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return null;
  }

  return serializeUser(user, "nextauth");
}

function serializeUser(
  user: Awaited<ReturnType<typeof User.findOne>>,
  authSource: AuthSource
): AuthenticatedUser {
  if (!user) {
    throw new Error("Cannot serialize an empty user.");
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    plan: user.plan,
    dailyLimit: user.dailyLimit,
    businessName: user.businessName,
    defaultCurrency: user.defaultCurrency,
    defaultPaymentMethod: user.defaultPaymentMethod,
    businessLogo: user.businessLogo,
    authSource,
  };
}
