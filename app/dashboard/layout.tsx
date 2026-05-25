import type { ReactNode } from "react";

import { DashboardAuthProvider } from "@/components/auth/dashboard-auth";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardAuthProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </DashboardAuthProvider>
  );
}
