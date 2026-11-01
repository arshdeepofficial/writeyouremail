import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WriteYourEmail — AI Email Writer",
  description: "Write perfect emails in seconds using AI. Free, no signup required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}