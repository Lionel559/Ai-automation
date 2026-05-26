import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FAQ Assistant",
  description:
    "Generate clear AI answers for common customer questions and small business support workflows inside AIFLOW.",
};

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
