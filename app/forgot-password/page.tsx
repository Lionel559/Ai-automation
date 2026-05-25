import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | AIFLOW",
  description: "Generate a secure password reset link for your AIFLOW account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
