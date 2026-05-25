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

    const { prompt } = await req.json();
    const promptText = typeof prompt === "string" ? prompt : "";

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(
     `
Generate 3 short professional social media captions for this business:

${promptText}

Rules:
- Make captions clean and modern
- Use emojis only when necessary
- Keep each caption under 40 words
- Make them suitable for Instagram and WhatsApp
- Do not explain anything
- Return only the captions
`
    );

    const response = result.response.text();

    await saveGeneration({
      userId: user.id,
      type: "caption",
      prompt: promptText,
      response,
    });

    return NextResponse.json({
      success: true,
      caption: response,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
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
