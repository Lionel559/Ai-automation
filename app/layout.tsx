import type { Metadata } from "next";
import "./globals.css";

import { AuthSessionProvider } from "@/components/auth/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "AI Workflow Automation",
  description: "Automate your business with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <AuthSessionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
