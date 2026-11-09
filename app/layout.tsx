import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://writeyouremail.com"),
  title: "WriteYourEmail — AI Email Generator & Outreach Studio",
  description:
    "Generate high-converting cold emails, LinkedIn DMs, and sales sequences in seconds with AI.",
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">{children}</body>
    </html>
  );
}