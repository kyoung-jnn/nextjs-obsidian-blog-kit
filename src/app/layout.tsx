import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import ThemeProvider from '@/components/ThemeProvider';
import { METADATA_CONFIG, METADATA_TWITTER_CONFIG, OPEN_GRAPH_CONFIG, SITE_CONFIG } from '@/config';

import '@/styles/global.css';

export const metadata: Metadata = {
  ...METADATA_CONFIG,
  ...(SITE_CONFIG.siteUrl && { metadataBase: new URL(SITE_CONFIG.siteUrl) }),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.title}`,
  },
  openGraph: OPEN_GRAPH_CONFIG,
  twitter: METADATA_TWITTER_CONFIG,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
};

function RootLayout({ children }: { children: ReactNode }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.title,
    url: SITE_CONFIG.siteUrl,
    author: { '@type': 'Person', name: SITE_CONFIG.author.localeName },
  };

  return (
    <html lang={SITE_CONFIG.locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Search Engine Verification - Replace with your own verification code */}
        {/* <meta name="naver-site-verification" content="your-verification-code" /> */}
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${SITE_CONFIG.siteUrl}/rss.xml`}
          title="rss"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/<\/script>/gi, '<\\/script>'),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ProgressBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default RootLayout;
