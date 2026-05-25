import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(`
Generate 3 short professional replies to this customer message:

${message}

Rules:
- Keep replies friendly and clear
- Make them suitable for WhatsApp or Instagram DM
- Keep each reply under 35 words
- Do not explain anything
- Return only the replies
`);

    return NextResponse.json({
      success: true,
      reply: result.response.text(),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "AI reply generation failed" },
      { status: 500 }
    );
  }
}