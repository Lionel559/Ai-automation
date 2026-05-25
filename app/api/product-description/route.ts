import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { product, features, audience } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(`
Generate 3 short product descriptions.

Product: ${product}
Features: ${features}
Target Audience: ${audience}

Rules:
- Make it clear and persuasive
- Suitable for Instagram, WhatsApp, and online stores
- Keep each description under 45 words
- Do not explain anything
- Return only the descriptions
`);

    return NextResponse.json({
      success: true,
      description: result.response.text(),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Product description generation failed" },
      { status: 500 }
    );
  }
}