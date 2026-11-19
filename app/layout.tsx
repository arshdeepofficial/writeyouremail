import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://writeyouremail.com'),
  title: {
    default: 'WriteYourEmail.com | #1 AI Email Generator & Deliverability Suite',
    template: '%s | WriteYourEmail by Glent Global',
  },
  description:
    'Generate high-converting cold emails, sales outreach, follow-ups, and business pitches with 30+ AI strategies. Features real-time spam score analysis, A/B subject line testing, and instant Gmail & Outlook integration. Powered by Glent Global Enterprises.',
  applicationName: 'WriteYourEmail Studio',
  authors: [{ name: 'Glent Global Enterprises', url: 'https://writeyouremail.com' }],
  creator: 'Glent Global Enterprises',
  publisher: 'Glent Global Enterprises',
  category: 'Business & Productivity Software',
  keywords: [
    // Brand & Primary Keywords
    'WriteYourEmail',
    'Write Your Email',
    'writeyouremail.com',
    'Glent Global',
    'Glent Global Enterprises',
    'AI email generator',
    'free AI email writer',
    'AI email copywriter',
    'AI cold email generator',

    // Cold Outreach & B2B Sales
    'cold email outreach tool',
    'B2B cold email generator',
    'sales outreach AI',
    'lead generation email writer',
    'cold outreach templates',
    'SaaS sales email writer',
    'investor pitch email generator',
    'agency client acquisition email',
    'cold email personalization',
    'high converting sales copy',

    // Deliverability & Spam Scoring
    'email deliverability tool',
    'spam trigger word checker',
    'email spam score audit',
    'how to avoid spam folder',
    'inbox placement optimizer',
    'subject line tester AI',
    'A/B test email subject lines',
    'zero spam rate email copy',

    // Follow-ups & Strategy
    'AI follow up email generator',
    'inbound lead follow up',
    'lead win-back email template',
    'objection handling sales email',
    'cold call follow up email',
    'networking email generator',
    'magic polish email rewriter',
    'executive email rewriter',

    // High Intent & Alternatives
    'Lavender AI alternative',
    'Copy AI email alternative',
    'Jasper email generator alternative',
    'Instantly email copywriter',
    'Smartlead AI email assistant',
    'Groq Llama 3.3 email generator',
    'instant email launcher Gmail Outlook'
  ],
  alternates: {
    canonical: 'https://writeyouremail.com',
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://writeyouremail.com',
    siteName: 'WriteYourEmail Studio — Glent Global',
    title: 'WriteYourEmail.com | AI Email Generator & Deliverability Suite',
    description:
      'Stop landing in spam. Write high-converting cold emails and business outreach in seconds with 30+ AI modes and live deliverability audits.',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'WriteYourEmail AI Deliverability Suite by Glent Global',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WriteYourEmail.com | AI Email Generator',
    description:
      'Generate high-converting cold outreach and test deliverability scores in real-time. Built by Glent Global.',
    images: ['/icon.svg'],
    creator: '@glentglobal',
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
    url: 'https://writeyouremail.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    description:
      'AI email generator and deliverability suite featuring 30+ cold outreach modes, real-time spam scoring, and direct Gmail & Outlook launchers.',
    author: {
      '@type': 'Organization',
      name: 'Glent Global Enterprises',
      url: 'https://writeyouremail.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Glent Global Enterprises',
      logo: {
        '@type': 'ImageObject',
        url: 'https://writeyouremail.com/icon.svg',
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      description: 'Free tier includes 5 generations with zero credit card required.',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen selection:bg-[#0a84ff]/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}