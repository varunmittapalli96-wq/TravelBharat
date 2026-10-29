import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TravelBharat – Explore India State by State',
    template: '%s | TravelBharat',
  },
  description:
    'Discover India\'s most breathtaking destinations — from Himalayan peaks to tropical beaches, ancient temples to hidden gems. Your comprehensive travel encyclopedia for every Indian state and union territory.',
  keywords: [
    'India travel', 'Indian tourism', 'tourist places in India',
    'travel guide India', 'state wise tourism', 'heritage sites India',
    'UNESCO India', 'hill stations India', 'beaches India',
  ],
  authors: [{ name: 'TravelBharat' }],
  creator: 'TravelBharat',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'TravelBharat',
    title: 'TravelBharat – Explore India State by State',
    description:
      'Discover India\'s most breathtaking destinations. Your comprehensive travel encyclopedia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TravelBharat – Explore India State by State',
    description:
      'Discover India\'s most breathtaking destinations. Your comprehensive travel encyclopedia.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#F97316" />
      </head>
      <body className="min-h-screen font-body antialiased">
        {children}
      </body>
    </html>
  );
}
