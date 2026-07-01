import React from 'react'
import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import type { User } from '@/payload-types'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: 'Sparta Labs',
  description: 'Research-grade peptides guided by scientific literature, deliberate sourcing, and controlled operational standards.',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let user: User | null = null
  try {
    user = await getPayloadUser()
  } catch {
    // not authenticated — render without user
  }

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        <AuthProvider user={user}>
          <SmoothScroll>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  )
}
