import type { ReactNode } from "react";

import { DashboardAuthProvider } from "@/components/auth/dashboard-auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardAuthProvider>{children}</DashboardAuthProvider>;
}
