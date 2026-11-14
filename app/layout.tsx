import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://writeyouremail.com'),
  title: {
    default: 'WriteYourEmail | AI Cold Email Generator & Deliverability Suite',
    template: '%s | WriteYourEmail',
  },
  description:
    'Write high-converting cold outreach, sales follow-ups, and pitch emails with built-in spam scoring and deliverability optimization. Powered by Groq Llama 3.3 70B.',
  keywords: [
    'Write Your Email',
    'WriteYourEmail',
    'WriteYourEmail.com',
    'AI cold email generator',
    'email deliverability tool',
    'spam score checker',
    'cold outreach writer',
    'sales email generator',
  ],
  authors: [{ name: 'WriteYourEmail Team', url: 'https://writeyouremail.com' }],
  creator: 'WriteYourEmail',
  publisher: 'WriteYourEmail',
  alternates: {
    canonical: 'https://writeyouremail.com',
  },
  openGraph: {
    title: 'WriteYourEmail - AI Cold Email Writer & Deliverability Suite',
    description:
      'Generate high-converting cold email sequences with live deliverability scoring, spam trigger detection, and 1-click Gmail/Outlook launching.',
    url: 'https://writeyouremail.com',
    siteName: 'WriteYourEmail.com',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WriteYourEmail - AI Cold Email Writer',
    description: 'Write inbox-ready cold outreach emails with built-in spam trigger detection.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WriteYourEmail',
    alternateName: ['Write Your Email', 'WriteYourEmail.com'],
    url: 'https://writeyouremail.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'AI Cold Email Generator and Deliverability Suite for sales reps, founders, and agencies.',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-[#000000] text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}