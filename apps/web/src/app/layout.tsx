import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { metadataDescription, metadataKeywords, productName } from '@/lib/constants';
import '@/components/globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

const title: Metadata['title'] = {
  template: `%s | ${productName}`,
  default: productName,
};

export const metadata: Metadata = {
  title,
  description: metadataDescription,
  keywords: metadataKeywords,
  openGraph: {
    title,
    description: metadataDescription as string,
    siteName: productName,
    locale: 'hu_HU',
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang='hu'>
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
