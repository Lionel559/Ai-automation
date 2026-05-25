import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { business, question } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(`
You are an AI customer support assistant.

Business Info:
${business}

Customer Question:
${question}

Rules:
- Keep answers short and professional
- Suitable for WhatsApp and Instagram
- Friendly tone
- Return only the answer
`);

    return NextResponse.json({
      success: true,
      answer: result.response.text(),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "FAQ generation failed" },
      { status: 500 }
    );
  }
}