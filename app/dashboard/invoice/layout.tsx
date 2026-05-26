import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Invoice Generator",
  description:
    "Create clean AI-assisted invoices for small business customers and clients inside AIFLOW.",
};

export default function InvoiceLayout({ children }: { children: ReactNode }) {
  return children;
}
