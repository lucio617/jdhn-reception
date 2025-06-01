import "../styles/globals.css"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doctor Booking App',
  description: 'Book doctor appointments online',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}