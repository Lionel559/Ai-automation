import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { business, customer, item, amount } =
      await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });
    const today = new Date().toISOString().split("T")[0];
    const result = await model.generateContent(`
Generate a clean JSON invoice.

Business Name: ${business}
Customer Name: ${customer}
Item/Service: ${item}
Amount: ${amount}
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