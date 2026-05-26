import { NextResponse } from "next/server";
import { z } from "zod";

const invalidInputMessage = "Invalid input";

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string().min(8).max(256);

const nonEmptyText = (max: number) => z.string().trim().min(1).max(max);

const optionalPositiveNumber = z.coerce.number().positive().finite().optional();

export const currencySchema = z.enum(["USD", "NGN", "EUR", "GBP"]);

export const paymentMethodSchema = z.enum([
  "Cash",
  "Bank Transfer",
  "Credit Card",
  "PayPal",
  "Crypto",
]);

export const registerSchema = z.object({
  email: emailSchema,
  name: nonEmptyText(50).min(2),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  token: nonEmptyText(128),
});

export const captionSchema = z.object({
  prompt: nonEmptyText(2000),
});

export const replySchema = z.object({
  message: nonEmptyText(2000),
});

export const faqSchema = z.object({
  business: nonEmptyText(2000),
  question: nonEmptyText(500),
});

export const invoiceSchema = z.object({
  amount: nonEmptyText(120),
  business: nonEmptyText(80),
  currency: currencySchema.optional(),
  customer: nonEmptyText(80),
  date: nonEmptyText(30).optional(),
  item: nonEmptyText(2000),
  paymentMethod: paymentMethodSchema.optional(),
  price: optionalPositiveNumber,
  quantity: optionalPositiveNumber,
});

export const productDescriptionSchema = z.object({
  audience: nonEmptyText(500),
  features: nonEmptyText(2000),
  product: nonEmptyText(2000),
});

export const settingsSchema = z.object({
  businessLogo: z.string().trim().max(1_000_000),
  businessName: z.string().trim().max(120),
  defaultCurrency: currencySchema,
  defaultPaymentMethod: paymentMethodSchema,
  name: nonEmptyText(50).min(2),
});

type ValidatedJson<TSchema extends z.ZodType> =
  | {
      data: z.infer<TSchema>;
      success: true;
    }
  | {
      success: false;
    };

// Centralized validation trims input and blocks empty or oversized abuse payloads.
export async function validateJsonRequest<TSchema extends z.ZodType>(
  req: Request,
  schema: TSchema
): Promise<ValidatedJson<TSchema>> {
  try {
    const body: unknown = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
      };
    }

    return {
      data: result.data,
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
}

export function invalidInputResponse() {
  return NextResponse.json(
    {
      success: false,
      message: invalidInputMessage,
    },
    { status: 400 }
  );
}
