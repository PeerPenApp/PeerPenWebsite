import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"], // Including black weight for headings
})

export const metadata: Metadata = {
  title: "PeerPen - Social Essay Platform",
  description: "Share, review, and improve college essays with AI and peer feedback",
  generator: "v0.app",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#171717',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // console.log("[v0] Clerk publishable key exists:", !!publishableKey)
  // console.log("[v0] Clerk publishable key length:", publishableKey?.length || 0)

  if (!publishableKey) {
    return (
      <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
        <body className="font-sans antialiased">
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">Clerk Configuration Required</h1>
              <p className="text-gray-600 mb-4">
                The Clerk publishable key is missing. Please add it in Project Settings:
              </p>
              <ol className="text-left text-sm text-gray-600 space-y-2">
                <li>1. Click the gear icon (⚙️) in the top right</li>
                <li>2. Go to "Environment Variables"</li>
                <li>3. Add: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                <li>4. Get your key from Clerk Dashboard</li>
              </ol>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
        <body className="font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
