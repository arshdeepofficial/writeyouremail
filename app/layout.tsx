import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

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
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased">{children}</body>
    </html>
  );
}