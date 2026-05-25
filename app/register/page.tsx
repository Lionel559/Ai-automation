import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create Account | AIFLOW",
  description: "Create your AIFLOW workspace account.",
};

export default function RegisterPage() {
  return (
    <AuthForm
      authMode="register"
      eyebrow="Start automating"
      title="Create account"
      subtitle="Set up your workspace and start creating AI-powered business assets."
      primaryAction="Create account"
      googleAction="Sign up with Google"
      footerText="Already have an account?"
      footerHref="/login"
      footerLink="Log in"
      submitEndpoint="/api/auth/register"
      googleCallbackUrl="/dashboard"
      fields={[
        {
          label: "Full name",
          name: "fullName",
          type: "text",
          placeholder: "Your full name",
          autoComplete: "name",
          icon: "name",
        },
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
          placeholder: "Create a password",
          autoComplete: "new-password",
          icon: "password",
        },
        {
          label: "Confirm password",
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm your password",
          autoComplete: "new-password",
          icon: "password",
        },
      ]}
    />
  );
}
