import type { Metadata, Viewport } from 'next'
import {
  Playfair_Display,
  Cormorant_Garamond,
  Lora,
  Merriweather,
  Marck_Script,
  Bad_Script,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

/*
const geist = Geist({
  subsets: ["latin"],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})*/

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: '--font-playfair-display',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: '--font-cormorant-garamond',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const lora = Lora({
  subsets: ["latin", "cyrillic"],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const libreBaskerville = Merriweather({
  subsets: ["latin", "cyrillic"],
  variable: '--font-libre-baskerville',
  display: 'swap',
  weight: ['400', '700', '900'],
})

const greatVibes = Marck_Script({
  subsets: ["latin", "cyrillic"],
  variable: '--font-great-vibes',
  display: 'swap',
  weight: '400',
})

const allura = Bad_Script({
  subsets: ["latin", "cyrillic"],
  variable: '--font-allura',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Дурсамж | Таны Цахим Цаг Хугацааны Капсул',
  description: 'Төгсөгчдөд зориулсан ирээдүйн дурсамж хуваалцах платформ. Дурсамжаа хамтдаа бүтээж, хадгалж, нээгээрэй.',
  generator: 'v0.app',
  keywords: ['memories', 'graduation', 'time capsule', 'friends', 'yearbook', 'digital memories'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f6f1eb',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${lora.variable} ${libreBaskerville.variable} ${greatVibes.variable} ${allura.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
