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

    const { product, features, audience } = await req.json();
    const productText = typeof product === "string" ? product : "";
    const featuresText = typeof features === "string" ? features : "";
    const audienceText = typeof audience === "string" ? audience : "";

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(`
Generate 3 short product descriptions.

Product: ${productText}
Features: ${featuresText}
Target Audience: ${audienceText}

Rules:
- Make it clear and persuasive
- Suitable for Instagram, WhatsApp, and online stores
- Keep each description under 45 words
- Do not explain anything
- Return only the descriptions
`);
    const response = result.response.text();

    await saveGeneration({
      userId: user.id,
      type: "product-description",
      prompt: `Product: ${productText}\nFeatures: ${featuresText}\nTarget Audience: ${audienceText}`,
      response,
    });

    return NextResponse.json({
      success: true,
      description: response,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Product description generation failed" },
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
