import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import ClientLayout from './client-layout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amourium - Produits Agricoles Biologiques Naturels',
  description: 'Stimulants de croissance biologiques premium et engrais liquides pour une agriculture durable',
  generator: 'v0.app',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
