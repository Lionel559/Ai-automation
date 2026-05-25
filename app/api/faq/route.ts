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

    const { business, question } = await req.json();
    const businessText = typeof business === "string" ? business : "";
    const questionText = typeof question === "string" ? question : "";

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
