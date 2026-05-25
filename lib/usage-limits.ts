import { NextResponse } from "next/server";

import type { AuthenticatedUser } from "@/lib/auth";
import Generation from "@/models/Generation";

export const DAILY_LIMIT_REACHED_MESSAGE =
  "Daily limit reached. Upgrade to continue.";

const defaultDailyLimit = 10;

export type GenerationUsage = {
  canGenerate: boolean;
  dailyLimit: number | null;
  generationsUsedToday: number;
  remainingGenerations: number | null;
  unlimited: boolean;
};

export async function getGenerationUsage(
  user: Pick<AuthenticatedUser, "id" | "plan" | "dailyLimit">
): Promise<GenerationUsage> {
  const generationsUsedToday = await countTodaysGenerations(user.id);
  const unlimited = user.plan === "pro";

  if (unlimited) {
    return {
      canGenerate: true,
      dailyLimit: null,
      generationsUsedToday,
      remainingGenerations: null,
      unlimited: true,
    };
  }

  const dailyLimit = Math.max(user.dailyLimit ?? defaultDailyLimit, 0);
  const remainingGenerations = Math.max(dailyLimit - generationsUsedToday, 0);

  return {
    canGenerate: remainingGenerations > 0,
    dailyLimit,
    generationsUsedToday,
    remainingGenerations,
    unlimited: false,
  };
}

export function dailyLimitReachedResponse() {
  return NextResponse.json(
    {
      success: false,
      message: DAILY_LIMIT_REACHED_MESSAGE,
    },
    { status: 403 }
  );
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { end, start };
}

async function countTodaysGenerations(userId: string) {
  const { end, start } = getTodayRange();

  return Generation.countDocuments({
    userId,
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
}
