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
  invalidInputResponse,
  invoiceSchema,
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

    const validation = await validateJsonRequest(req, invoiceSchema);

    if (!validation.success) {
      return invalidInputResponse();
    }

    const {
      amount: amountText,
      business: businessText,
      customer: customerText,
      item: itemText,
    } = validation.data;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });
    const today = new Date().toISOString().split("T")[0];
    const result = await model.generateContent(`
Generate a clean JSON invoice.

Business Name: ${businessText}
Customer Name: ${customerText}
Item/Service: ${itemText}
Amount: ${amountText}
- Use the exact date provided: ${today}

Return ONLY this JSON format:

{
  "invoiceNumber": "INV-001",
  "date": "${today}",
  "business": "",
  "customer": "",
  "item": "",
  "amount": "",
  "message": ""
}
`);
    const text = result.response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const invoice = JSON.parse(cleanedText);

    await saveGeneration({
      userId: user.id,
      type: "invoice",
      prompt: `Business Name: ${businessText}\nCustomer Name: ${customerText}\nItem/Service: ${itemText}\nAmount: ${amountText}`,
      response: JSON.stringify(invoice, null, 2),
    });

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Invoice generation failed",
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
