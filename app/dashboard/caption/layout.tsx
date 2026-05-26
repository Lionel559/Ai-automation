import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Caption Generator",
  description:
    "Generate short, professional social media captions for Instagram, WhatsApp, Facebook, and LinkedIn inside AIFLOW.",
};

export default function CaptionLayout({ children }: { children: ReactNode }) {
  return children;
}
