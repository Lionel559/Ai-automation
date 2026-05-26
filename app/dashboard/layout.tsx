import type { ReactNode } from "react";
import type { Metadata } from "next";

import { DashboardAuthProvider } from "@/components/auth/dashboard-auth";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Private AIFLOW workspace for AI business automation tools.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardAuthProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </DashboardAuthProvider>
  );
}
