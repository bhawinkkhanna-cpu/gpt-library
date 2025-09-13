import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Agent Library",
  description: "Minimal dashboard for hosting custom GPTs",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
