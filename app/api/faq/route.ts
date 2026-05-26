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
  faqSchema,
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

    const validation = await validateJsonRequest(req, faqSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const { business: businessText, question: questionText } = validation.data;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(`
You are an AI customer support assistant.

Business Info:
${businessText}

Customer Question:
${questionText}

Rules:
- Keep answers short and professional
- Suitable for WhatsApp and Instagram
- Friendly tone
- Return only the answer
`);
    const response = result.response.text();

    await saveGeneration({
      userId: user.id,
      type: "faq",
      prompt: `Business Info:\n${businessText}\n\nCustomer Question:\n${questionText}`,
      response,
    });

    return NextResponse.json({
      success: true,
      answer: response,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "FAQ generation failed" },
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
