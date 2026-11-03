import type { Metadata } from "next";
import Script from "next/script";
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
      <body className="antialiased">
        {children}
        {/* Lemon Squeezy Overlay Script */}
        <Script
          src="https://assets.lemonsqueezy.com/lemon.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}