import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { saveGeneration } from "@/lib/generation-history";
import {
  dailyLimitReachedResponse,
  getGenerationUsage,
} from "@/lib/usage-limits";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const usage = await getGenerationUsage(user);

    if (!usage.canGenerate) {
      return dailyLimitReachedResponse();
    }

    const { message } = await req.json();
    const messageText = typeof message === "string" ? message : "";

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(`
Generate 3 short professional replies to this customer message:

${messageText}

Rules:
- Keep replies friendly and clear
- Make them suitable for WhatsApp or Instagram DM
- Keep each reply under 35 words
- Do not explain anything
- Return only the replies
`);
    const response = result.response.text();

    await saveGeneration({
      userId: user.id,
      type: "reply",
      prompt: messageText,
      response,
    });

    return NextResponse.json({
      success: true,
      reply: response,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "AI reply generation failed" },
      { status: 500 }
    );
  }
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Authentication required." },
    { status: 401 }
  );
}
