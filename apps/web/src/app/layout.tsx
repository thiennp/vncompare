import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VNCompare.com - So sánh sơn và vật liệu xây dựng tại Việt Nam',
  description: 'Nền tảng so sánh sơn hàng đầu Việt Nam. Tìm kiếm, so sánh giá và mua sơn chất lượng cao từ các nhà cung cấp uy tín.',
  keywords: 'sơn, so sánh giá, vật liệu xây dựng, Việt Nam, mua sơn, giá sơn',
  authors: [{ name: 'VNCompare Team' }],
  creator: 'VNCompare.com',
  publisher: 'VNCompare.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vncompare.com'),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'VNCompare.com - So sánh sơn và vật liệu xây dựng',
    description: 'Tìm kiếm và so sánh giá sơn từ các nhà cung cấp hàng đầu Việt Nam',
    url: 'https://vncompare.com',
    siteName: 'VNCompare.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VNCompare.com - Paint Comparison Platform',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VNCompare.com - So sánh sơn và vật liệu xây dựng',
    description: 'Tìm kiếm và so sánh giá sơn từ các nhà cung cấp hàng đầu Việt Nam',
    images: ['/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "VNCompare.com",
              "url": "https://vncompare.com",
              "description": "Nền tảng so sánh sơn hàng đầu Việt Nam",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://vncompare.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <div id="root">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
