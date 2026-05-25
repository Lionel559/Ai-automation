import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(
     `
Generate 3 short professional social media captions for this business:

${prompt}

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