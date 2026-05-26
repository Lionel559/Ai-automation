import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";
import { saveGeneration } from "@/lib/generation-history";
import {
  getClientIp,
  rateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";
import {
  captionSchema,
  invalidInputResponse,
  validateJsonRequest,
} from "@/lib/validations/api";
import {
  dailyLimitReachedResponse,
  getGenerationUsage,
} from "@/lib/usage-limits";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const aiLimit = 20;
const aiWindowMs = 10 * 60 * 1000;
const tooManyAiRequestsMessage = "Too many AI requests. Please slow down.";

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const limitResult = rateLimit(
      `ai:${getClientIp(req)}`,
      aiLimit,
      aiWindowMs
    );

    if (!limitResult.allowed) {
      return rateLimitExceededResponse(
        tooManyAiRequestsMessage,
        limitResult.retryAfter
      );
    }

    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const usage = await getGenerationUsage(user);

    if (!usage.canGenerate) {
      return dailyLimitReachedResponse();
    }

    const validation = await validateJsonRequest(req, captionSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const promptText = validation.data.prompt;

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
