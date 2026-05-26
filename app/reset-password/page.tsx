import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your AIFLOW account.",
  robots: {
    index: false,
    follow: false,
  },
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[] | undefined;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token)
    ? params.token[0] ?? ""
    : params.token ?? "";

  return <ResetPasswordForm token={token} />;
}
