import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from '@/trpc/clients/client'
import { Container } from '@/components/atoms/container'
import { Toaster } from '@/components/molecules/Toaster/toaster'
import { Navbar } from '@/components/organisms/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Showtime',
  description: 'Movie ticket booking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <TRPCReactProvider>
          <body className={inter.className}>
            <Toaster />
            <Navbar />
            <Container>{children}</Container>
          </body>
        </TRPCReactProvider>
      </ClerkProvider>
    </html>
  )
}

// ngrok http --url=yeti-workable-quail.ngrok-free.app 3000
