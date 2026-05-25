import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login | AIFLOW",
  description: "Log in to your AIFLOW workspace.",
};

export default function LoginPage() {
  return (
    <AuthForm
      authMode="login"
      eyebrow="Welcome back"
      title="Welcome back"
      subtitle="Log in to manage your automations and keep business tasks moving."
      primaryAction="Log in"
      googleAction="Continue with Google"
      footerText="New to AIFLOW?"
      footerHref="/register"
      footerLink="Create an account"
      submitEndpoint="/api/auth/login"
      googleCallbackUrl="/dashboard"
      showForgotPassword
      fields={[
        {
          label: "Email address",
          name: "email",
          type: "email",
          placeholder: "you@company.com",
          autoComplete: "email",
          icon: "email",
        },
        {
          label: "Password",
          name: "password",
          type: "password",
          placeholder: "Enter your password",
          autoComplete: "current-password",
          icon: "password",
        },
      ]}
    />
  );
}
